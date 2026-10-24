import { ChevronRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { cn } from '@/lib/cn';
import { springSize, useSpring } from '@/lib/motion';
import { Transition } from './Transition';

export type IconProps = ComponentProps<typeof ChevronRight>;

/** Caret that turns with the panel. Reads `data-panel-open` off the trigger. */
export function Icon({ className, ...props }: IconProps) {
	return (
		<ChevronRight
			data-slot="collapsible-icon"
			aria-hidden="true"
			className={cn(
				'size-[1em] shrink-0',
				'transition-transform duration-(--duration-state) ease-(--ease-overlay)',
				'group-data-panel-open:rotate-90',
				className,
			)}
			{...props}
		/>
	);
}

export type PanelProps = Omit<ComponentProps<typeof BaseCollapsible.Panel>, 'className'> & {
	/**
	 * Whether the body sits in a `Transition`, so a body that changes size once the panel is open
	 * eases to the new size instead of jumping. `false` opts out of the wrapper altogether.
	 */
	transition?: boolean;
	/**
	 * The height the closed panel keeps, in pixels, so a folded body can still show a peek of
	 * itself. `0` means closed is out of the layout rather than short.
	 */
	peek?: number;
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/**
 * The panel is opened and closed by a spring rather than by a transition: a closed height and
 * `height: auto` are two ends of the same number to the animation, so a body that is swapped while
 * the panel is open is followed too, and a reversal mid-flight turns around from where it is.
 *
 * Base UI still measures and owns the panel — its id, the trigger's `aria-controls`, the state
 * attributes. Only `hidden` is taken off it, because a panel that is never in the layout cannot be
 * animated between two heights; `inert` keeps the closed one out of the way instead.
 */
export function Panel({ className, transition = true, peek = 0, children, ...props }: PanelProps) {
	const spring = useSpring(springSize);

	return (
		<BaseCollapsible.Panel
			keepMounted
			render={({ hidden, ...panelProps }, state) => (
				<motion.div
					// Base UI types these as a plain element's, and two of them — `onAnimationStart`,
					// `onDrag` — mean something else to an animated one.
					{...(panelProps as unknown as HTMLMotionProps<'div'>)}
					initial={false}
					animate={{ height: state.open ? 'auto' : peek }}
					transition={spring}
					inert={!state.open}
					className={cn('overflow-clip', className)}
					data-slot="collapsible-panel"
				>
					{transition === false ? children : <Transition>{children}</Transition>}
				</motion.div>
			)}
			{...props}
		/>
	);
}

export const Root = BaseCollapsible.Root;

export type TriggerProps = ComponentProps<typeof BaseCollapsible.Trigger>;

export function Trigger({ className, ...props }: TriggerProps) {
	return (
		<BaseCollapsible.Trigger
			data-slot="collapsible-trigger"
			className={cn(
				'group relative flex w-full cursor-pointer items-center justify-between gap-2',
				'rounded-md px-3 py-2 text-left text-sm font-medium select-none',
				'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
				'after:bg-current after:opacity-0 after:transition-opacity',
				'after:duration-(--duration-state)',
				'hover:after:opacity-(--state-layer-hover-opacity)',
				'active:after:opacity-(--state-layer-pressed-opacity)',
				'data-disabled:pointer-events-none data-disabled:opacity-50',
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
				className,
			)}
			{...props}
		/>
	);
}

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Collapsible = { Root, Trigger, Icon, Panel };
