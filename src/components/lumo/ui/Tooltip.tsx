import type { ComponentProps } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/cn';

export type ArrowProps = ComponentProps<typeof BaseTooltip.Arrow>;

export function Arrow({ className, ...props }: ArrowProps) {
	return (
		<BaseTooltip.Arrow
			data-slot="tooltip-arrow"
			className={cn(
				'block h-1.5 w-3 overflow-clip',
				'transition-[left,top] duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-instant:transition-none',
				// Base UI places the arrow on the anchor axis; which edge it hangs off is ours.
				'data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180',
				'data-[side=left]:-right-2.25 data-[side=left]:rotate-90',
				'data-[side=right]:-left-2.25 data-[side=right]:-rotate-90',
				// A square of 6px·√2 centred on the popup edge, clipped to its upper half.
				'before:absolute before:bottom-0 before:left-1/2 before:size-[calc(6px*sqrt(2))]',
				'before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:bg-primary',
				className,
			)}
			{...props}
		/>
	);
}

export type PopupProps = ComponentProps<typeof BaseTooltip.Popup>;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseTooltip.Popup
			data-slot="tooltip-popup"
			className={cn(
				'relative origin-(--transform-origin) rounded-md bg-primary text-xs',
				'text-primary-foreground shadow-md',
				'px-2.5 py-1',
				// A Viewport inside brings its own padding, so this one would double up.
				'has-[>[data-slot=tooltip-viewport]]:p-0',
				// Set by Base UI only while a Viewport animates a size change.
				'h-(--popup-height,auto) w-(--popup-width,auto) max-w-xs',
				'transition-[width,height,opacity,scale]',
				'duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-starting-style:scale-90 data-starting-style:opacity-0',
				'data-ending-style:scale-90 data-ending-style:opacity-0',
				'data-instant:transition-none',
				className,
			)}
			{...props}
		/>
	);
}

export const Portal = BaseTooltip.Portal;

export type PositionerProps = ComponentProps<typeof BaseTooltip.Positioner>;

export function Positioner({ className, sideOffset = 11, ...props }: PositionerProps) {
	return (
		<BaseTooltip.Positioner
			data-slot="tooltip-positioner"
			sideOffset={sideOffset}
			className={cn(
				'z-50 max-w-(--available-width)',
				// Set by Base UI only while a Viewport animates a size change.
				'h-(--positioner-height,auto) w-(--positioner-width,auto)',
				'transition-[top,left,right,bottom,transform]',
				'duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-instant:transition-none',
				className,
			)}
			{...props}
		/>
	);
}

export const Provider = BaseTooltip.Provider;

export const Root = BaseTooltip.Root;

export type TriggerProps = ComponentProps<typeof BaseTooltip.Trigger>;

export const Trigger = ({ ...props }: TriggerProps) => (
	<BaseTooltip.Trigger delay={100} {...props} />
);

export type ViewportProps = ComponentProps<typeof BaseTooltip.Viewport>;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseTooltip.Viewport
			data-slot="tooltip-viewport"
			className={cn(
				'[--viewport-inline-padding:--spacing(2.5)]',
				'relative h-full w-full overflow-clip px-(--viewport-inline-padding) py-1',
				'[&_:is([data-current],[data-previous])]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))]',
				'[&_:is([data-current],[data-previous])]:translate-x-0',
				'[&_:is([data-current],[data-previous])]:opacity-100',
				'[&_:is([data-current],[data-previous])]:transition-[translate,opacity]',
				'[&_:is([data-current],[data-previous])]:duration-[var(--duration-overlay),calc(var(--duration-overlay)/2)]',
				'[&_:is([data-current],[data-previous])]:ease-(--ease-overlay)',
				'[[data-instant]_&_:is([data-current],[data-previous])]:transition-none',
				"data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2",
				"data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0",
				"data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2",
				"data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0",
				"data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2",
				"data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0",
				"data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2",
				"data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0",
				className,
			)}
			{...props}
		/>
	);
}

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Viewport,
	Arrow,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BaseTooltip.createHandle,
};
