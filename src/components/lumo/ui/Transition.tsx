import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, type Transition as MotionTransition } from 'motion/react';
import { cn } from '@/lib/cn';

export type TransitionProps = {
	/** Merged last through `cn()`, onto the box whose size glides. */
	className?: string;
	/** One block of content. Its size is what the box follows. */
	children: ReactNode;
};

type Bezier = [number, number, number, number];

/** The size the box is meant to be. No width means the page sizes it, not the content. */
type Size = { width?: number; height: number };

/** What sizes the box: the content, or the page. Decided once, when content has a size. */
type Mode = 'page' | 'content';

const LINEAR: Bezier = [0, 0, 1, 1];

/** A change that is not a glide: the first measurement, a mode settling. */
const REST: MotionTransition = { duration: 0 };

/** A token in pixels, or zero when it is missing — never NaN, which would poison the layout. */
const px = (value: string) => Number.parseFloat(value) || 0;

function bezier(value: string, fallback: Bezier): Bezier {
	const points = /cubic-bezier\(([^)]+)\)/.exec(value)?.[1]?.split(',').map(Number.parseFloat);
	return points?.length === 4 && points.every(Number.isFinite) ? (points as Bezier) : fallback;
}

/** Border and padding: what the content does not cover, and the box still has to be big for. */
function frame(box: HTMLElement) {
	const style = getComputedStyle(box);
	const x =
		px(style.paddingLeft) +
		px(style.paddingRight) +
		px(style.borderLeftWidth) +
		px(style.borderRightWidth);
	const y =
		px(style.paddingTop) +
		px(style.paddingBottom) +
		px(style.borderTopWidth) +
		px(style.borderBottomWidth);

	return {
		x,
		y,
		/** The inline size that makes the border box the size given, whatever `box-sizing` is. */
		fit: (size: number, run: number) => (style.boxSizing === 'border-box' ? size : size - run),
	};
}

/**
 * The width the box has to work with: the parent's content box, margins taken out, or `null` when
 * there is no block parent to hand one over.
 */
function room(box: HTMLElement): number | null {
	const parent = box.parentElement;
	if (parent === null || parent.clientWidth === 0) return null;
	const out = getComputedStyle(parent);
	const own = getComputedStyle(box);
	return (
		parent.clientWidth -
		px(out.paddingLeft) -
		px(out.paddingRight) -
		px(own.marginLeft) -
		px(own.marginRight)
	);
}

/**
 * Read from the tokens at the moment a glide starts, so a theme — and the
 * `prefers-reduced-motion` block in the tokens file, which collapses every duration — reaches it
 * without the component knowing about either.
 */
function readGlide(): MotionTransition {
	if (typeof document === 'undefined') return REST;
	const token = getComputedStyle(document.documentElement);
	return {
		duration: px(token.getPropertyValue('--duration-size')) / 1000,
		ease: bezier(token.getPropertyValue('--ease-overlay'), LINEAR),
	};
}

/** Whether two targets ask for the same size — a repeat measurement rather than a change. */
function same(a: Size, b: Size) {
	if (Math.abs(a.height - b.height) >= 0.5) return false;
	if (a.width === undefined || b.width === undefined) return a.width === b.width;
	return Math.abs(a.width - b.width) < 0.5;
}

/** Whether the box is already the size measured — a child sizing itself off the box, not a change. */
function at(live: DOMRect, size: Size) {
	if (Math.abs(live.height - size.height) >= 0.5) return false;
	return size.width === undefined || Math.abs(live.width - size.width) < 0.5;
}

/** Whether the size measured is somewhere other than where the box is. */
function travels(live: DOMRect, size: Size) {
	if (Math.abs(live.height - size.height) >= 0.5) return true;
	return size.width !== undefined && Math.abs(live.width - size.width) >= 0.5;
}

/** What the box is doing: the size it is meant to be, and how it gets there. */
type Glide = { size?: Size; timing: MotionTransition; moving: boolean };

const STILL: Glide = { timing: REST, moving: false };

/**
 * A box that holds one block of content and keeps its size to what is inside it.
 *
 * The height is the box's own: measured, and glided to each new one, so content that grows,
 * shrinks or re-wraps — a swap, a late font, a list that gains a line — never moves the page
 * beneath it. The width belongs to the page whenever the page sizes the box, and is measured and
 * glided the same way when it is the content that sizes it (a `w-fit` pill, a chip).
 *
 * The content is replaced in place, not remounted: no fade, no travel, no second copy of the
 * same text underneath — a clip and a measured glide are the whole of it.
 */
export function Transition({ className, children }: TransitionProps) {
	const boxRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	/** The size the box is meant to be, so a measurement can tell a change from a repeat. */
	const target = useRef<Size | undefined>(undefined);
	const mode = useRef<Mode | undefined>(undefined);
	const gliding = useRef(false);
	const [glide, setGlide] = useState<Glide>(STILL);

	const follow = useCallback(() => {
		const box = boxRef.current;
		const content = contentRef.current;
		if (box === null || content === null) return;

		// Where the box is now, not where the last glide was heading: an interrupted one continues
		// from what is on screen.
		const live = box.getBoundingClientRect();
		const edge = frame(box);
		const limit = room(box);

		// A box the page sizes keeps the width the page gives it, and only its height is the box's
		// to glide. A box the content sizes is measured in both directions — and the answer to
		// which one it is does not change, so it is asked once.
		//
		// Not laid out yet — inside a closed dialog or a hidden tab — so not a size to decide on.
		if (mode.current === undefined && content.getBoundingClientRect().height === 0) return;

		// `max-content`, to ask the content how wide it wants to be — free of the width the box is
		// pinned at now, which would only wrap what it measured.
		content.style.width = 'max-content';
		const natural = content.getBoundingClientRect().width + edge.x;

		let width: number | undefined;
		if (mode.current !== 'page') {
			const fits = limit === null || natural <= limit + 0.5;
			const own = mode.current === 'content' || Math.abs(natural - live.width) < 0.5;
			if (own && fits) {
				mode.current = 'content';
				width = natural;
			} else {
				// Content that wants more room than the page has is the page's to give, and it wraps
				// there, which is what `w-fit` would have computed anyway.
				mode.current = 'page';
			}
		}

		// Measured at the width the box is heading for, not the one it is at while gliding to it.
		if (width === undefined) content.style.removeProperty('width');
		else content.style.width = `${edge.fit(width, edge.x)}px`;
		const measured = content.getBoundingClientRect().height + edge.y;
		content.style.removeProperty('width');

		const next: Size = { width, height: measured };

		const previous = target.current;
		if (previous !== undefined && same(previous, next)) return;
		// A child that sizes itself off the box (`h-full`) would re-aim the glide at wherever the
		// box currently is, and park it there.
		if (gliding.current && at(live, next)) return;

		target.current = next;
		const travel = previous !== undefined && travels(live, next);
		gliding.current = travel;
		// Clipped only while the box is a size the content is not, so an overlay hanging out of the
		// content is not cut off once everything has settled.
		setGlide({ size: next, timing: travel ? readGlide() : REST, moving: travel });
	}, []);

	useLayoutEffect(() => {
		const content = contentRef.current;
		if (content === null) return;

		follow();
		// Anything inside that changes size re-targets the glide rather than snapping: content that
		// wraps at a new width, a font that arrives late, a list that gains a line.
		const observer = new ResizeObserver(follow);
		observer.observe(content);
		return () => observer.disconnect();
	}, [follow]);

	return (
		// Relative, so an absolutely positioned child lands against the box it is measured in.
		<motion.div
			ref={boxRef}
			data-slot="transition"
			data-moving={glide.moving ? '' : undefined}
			initial={false}
			animate={glide.size ?? {}}
			transition={glide.timing}
			onAnimationComplete={() => {
				gliding.current = false;
				setGlide((current) => (current.moving ? { ...current, moving: false } : current));
			}}
			className={cn('relative data-moving:overflow-clip', className)}
		>
			{/* flow-root keeps the margins of what is inside inside, so what is measured here is the
			    size the content actually takes. */}
			<div ref={contentRef} data-slot="transition-content" className="flow-root">
				{children}
			</div>
		</motion.div>
	);
}
