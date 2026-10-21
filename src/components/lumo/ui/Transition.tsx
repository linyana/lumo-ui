import { AnimatePresence, motion, type Variants } from 'motion/react';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

/** The side the new content travels in from; the old one leaves the other way. */
export type TransitionDirection = 'left' | 'right' | 'up' | 'down';

export type TransitionOptions = {
	/**
	 * Identity of the content. Changing it swaps it — and swap is what the fade, the travel and
	 * the blur are attached to. Leave it out and the box only follows the size of one block.
	 */
	value?: string | number;
	/** Cross-fade the old out and the new in. Off by default: the size is the whole show. */
	fade?: boolean;
	/** The side the new content arrives from. Needs `fade`, because a slide alone is two texts
	 *  passing each other. */
	direction?: TransitionDirection;
	/** Soften what leaves, so it reads as motion and not as a second text underneath. Leave it
	 *  off when the new content shares lines with the old: a shared line is drawn twice during
	 *  the swap, and softening one of the two copies reads as a focus pull on it. */
	blur?: boolean;
};

export type TransitionProps = TransitionOptions & {
	className?: string;
	children: ReactNode;
};

type Bezier = [number, number, number, number];

const LINEAR: Bezier = [0, 0, 1, 1];

type Timing = {
	/** The child on its way out: short, already moving, so it is gone before the new one lands. */
	leave: { duration: number; ease: Bezier };
	/** The child arriving: longer, and slow to start, so it resolves after the old one is gone. */
	arrive: { duration: number; ease: Bezier };
	/**
	 * The box changing size. It runs on the leave beat, so it has reached the new height while the
	 * arriving text is still faint — lines are then not revealed one at a time under the reader.
	 */
	morph: { duration: number; ease: Bezier };
	/** Pixels the content travels. */
	shift: number;
	/** Pixels of blur on the way out. */
	blur: number;
};

const NONE: Timing = {
	leave: { duration: 0, ease: LINEAR },
	arrive: { duration: 0, ease: LINEAR },
	morph: { duration: 0, ease: LINEAR },
	shift: 0,
	blur: 0,
};

/** A token in pixels, or zero when it is missing — never NaN, which would poison the layout. */
const px = (value: string) => Number.parseFloat(value) || 0;

function bezier(value: string, fallback: Bezier): Bezier {
	const points = /cubic-bezier\(([^)]+)\)/.exec(value)?.[1]?.split(',').map(Number.parseFloat);
	return points?.length === 4 && points.every(Number.isFinite) ? (points as Bezier) : fallback;
}

const cssEase = (ease: Bezier) => `cubic-bezier(${ease.join(', ')})`;

/**
 * Timing is read off the tokens rather than written here, so a theme — and the
 * `prefers-reduced-motion` block in the tokens file, which zeroes every duration — reaches the
 * animation without the component knowing anything about either.
 */
function readTiming(): Timing {
	if (typeof document === 'undefined') return NONE;
	const token = getComputedStyle(document.documentElement);
	const out = px(token.getPropertyValue('--duration-swap-out')) / 1000;
	const into = px(token.getPropertyValue('--duration-swap-in')) / 1000;

	return {
		leave: {
			duration: out,
			ease: bezier(token.getPropertyValue('--ease-leave'), LINEAR),
		},
		arrive: {
			duration: into,
			ease: bezier(token.getPropertyValue('--ease-arrive'), LINEAR),
		},
		morph: {
			// Shorter than the fade on purpose: the box is at its new height by the time the arriving
			// text is legible, so the lines are not revealed one by one under the reader's eye.
			duration: out,
			ease: bezier(token.getPropertyValue('--ease-overlay'), LINEAR),
		},
		shift: px(token.getPropertyValue('--shift-content')),
		blur: px(token.getPropertyValue('--blur-swap')),
	};
}

/** The offset the arriving content starts at, by the side it comes from. */
const from = (side: TransitionDirection | undefined, shift: number) => ({
	x: side === 'left' ? -shift : side === 'right' ? shift : 0,
	y: side === 'up' ? -shift : side === 'down' ? shift : 0,
});

/** And the offset the content on its way out ends at: the other side. */
const away = (side: TransitionDirection | undefined, shift: number) => ({
	x: side === 'left' ? shift : side === 'right' ? -shift : 0,
	y: side === 'up' ? shift : side === 'down' ? -shift : 0,
});

/**
 * A box that holds one block of content and keeps its height to what is inside it.
 *
 * By default that is all it does: the height is measured and eased, so content that changes
 * around it does not jump, and a swap lands at the new size without the page beneath it moving.
 * The fade, the travel and the blur are opt-in — a box that eases its size is the quiet default,
 * and a cross-fade is a thing you ask for.
 */
export function Transition({ value, fade, direction, blur, className, children }: TransitionProps) {
	const key = value === undefined ? 'content' : String(value);
	const fading = fade === true;

	// Re-read when the content changes rather than once on mount: the tokens carry the answer to
	// prefers-reduced-motion, and that can change while the page is open. Adjusting state during
	// render keeps the timing stable between swaps, so nothing downstream re-runs on a plain
	// re-render.
	const [timing, setTiming] = useState(readTiming);
	const [seen, setSeen] = useState(key);
	if (seen !== key) {
		setSeen(key);
		setTiming(readTiming());
	}

	const boxRef = useRef<HTMLDivElement>(null);
	/** The node each key last put on the page, so a swap measures the right one. */
	const nodes = useRef(new Map<string, HTMLDivElement>());
	/** The height the box is meant to be, so a swap knows where it is starting from. */
	const height = useRef<number | undefined>(undefined);
	const glide = useRef<Animation | null>(null);
	// The latest node to arrive, used as a re-render trigger: a box with no `value` has no key to
	// watch, and its contents can still be replaced from the outside.
	const [content, setContent] = useState<HTMLDivElement | null>(null);

	// `AnimatePresence` detaches the child it is still holding, so the map only ever gains an
	// entry per key: going back to a value whose child is still on its way out revives that child
	// instead of mounting one, and the node measured is the node still on the page.
	const attachContent = useCallback((node: HTMLDivElement | null) => {
		if (node === null) return;
		const own = node.dataset.value ?? '';
		nodes.current.set(own, node);
		setContent(node);
		return () => {
			if (nodes.current.get(own) === node) nodes.current.delete(own);
		};
	}, []);

	useLayoutEffect(() => {
		const box = boxRef.current;
		// The node for this key, not merely the latest arrival: going back to a value whose child
		// is still on its way out revives a node that never re-mounted.
		const node = nodes.current.get(key) ?? content;
		if (box === null || node === null) return;

		// The child is measured, not the box: the box is mid-glide while it glides. A box that
		// carries its own padding or border still needs room for it, being border-box.
		const extent = () => {
			const style = getComputedStyle(box);
			return (
				node.getBoundingClientRect().height +
				px(style.paddingTop) +
				px(style.paddingBottom) +
				px(style.borderTopWidth) +
				px(style.borderBottomWidth)
			);
		};

		const show = (next: number) => {
			// A first measurement of zero means the content is not laid out yet — inside a closed
			// dialog or a hidden tab — not that it is empty.
			if (height.current === undefined && next === 0) return;
			// The target the box was already aiming at is the target it keeps: a glide in flight
			// is left to finish rather than re-aimed at the same height.
			if (height.current !== undefined && Math.abs(height.current - next) < 0.5) return;
			// Where the box is now, not where the last glide was heading — an interrupted swap
			// continues from what is on screen.
			const start =
				height.current === undefined
					? undefined
					: glide.current === null
						? height.current
						: box.getBoundingClientRect().height;
			height.current = next;
			box.style.height = `${next}px`;
			if (start === undefined || Math.abs(start - next) < 0.5) return;
			glide.current?.cancel();
			// Clipped only while the box is a size the content is not.
			box.style.overflow = 'clip';
			box.dataset.swapping = '';
			const animation = box.animate([{ height: `${start}px` }, { height: `${next}px` }], {
				duration: timing.morph.duration * 1000,
				easing: cssEase(timing.morph.ease),
			});
			glide.current = animation;
			const settle = () => {
				if (glide.current !== animation) return;
				glide.current = null;
				box.style.removeProperty('overflow');
				delete box.dataset.swapping;
			};
			animation.finished.then(settle, settle);
		};

		show(extent());
		// Anything inside that changes size mid-glide re-targets it rather than snapping.
		const observer = new ResizeObserver(() => {
			const next = extent();
			// A child that sizes itself off the box (h-full) would otherwise re-target the glide
			// to wherever the box currently is, and park it there.
			if (glide.current !== null && Math.abs(next - box.getBoundingClientRect().height) < 0.5)
				return;
			show(next);
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, [key, timing, content]);

	useEffect(() => () => glide.current?.cancel(), []);

	const { arrive, leave, shift, blur: pixels } = timing;
	const soften = blur === true ? pixels : 0;
	const contentVariants: Variants = useMemo(
		() => ({
			enter: (side: TransitionDirection | undefined) => ({
				opacity: 0,
				...from(side, shift),
				transition: arrive,
			}),
			idle: { opacity: 1, x: 0, y: 0, transition: arrive },
			exit: (side: TransitionDirection | undefined) => ({
				opacity: 0,
				...away(side, shift),
				// Only on the way out: a node that stays must not keep a filter on itself, which
				// would become a containing block for everything inside it.
				...(soften > 0 ? { filter: `blur(${soften}px)` } : null),
				transition: leave,
			}),
		}),
		[arrive, leave, shift, soften],
	);

	const swapping = fading
		? {
				custom: direction,
				variants: contentVariants,
				initial: 'enter',
				animate: 'idle',
				exit: 'exit',
			}
		: {};

	return (
		// Relative, so the node on its way out is placed against the box it is leaving.
		<div ref={boxRef} data-slot="transition" className={cn('relative', className)}>
			<AnimatePresence initial={false} mode="popLayout" custom={direction}>
				<motion.div
					key={key}
					ref={attachContent}
					data-slot="transition-content"
					data-value={key}
					// flow-root keeps the margins of what is inside inside, so the height measured
					// here is the height the content actually takes.
					className="flow-root"
					{...swapping}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
