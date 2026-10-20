import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/cn';

export type ArrowProps = ComponentProps<typeof BasePopover.Arrow>;

export function Arrow({ className, ...props }: ArrowProps) {
	return (
		<BasePopover.Arrow
			data-slot="popover-arrow"
			className={cn(
				'block h-1.5 w-3 overflow-clip',
				'transition-[left,top] duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-instant:transition-none',
				// Base UI places the arrow on the anchor axis; which edge it hangs off is ours.
				'data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180',
				'data-[side=left]:-right-2.25 data-[side=left]:rotate-90',
				'data-[side=right]:-left-2.25 data-[side=right]:-rotate-90',
				// A square of 6px·√2 centred on the popup edge, clipped to its upper half. It
				// carries the popup's own border and fill, so the outline reads as one shape.
				'before:absolute before:bottom-0 before:left-1/2 before:size-[calc(6px*sqrt(2))]',
				'before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45',
				'before:border before:border-border before:bg-popover',
				className,
			)}
			{...props}
		/>
	);
}

export type BackdropProps = ComponentProps<typeof BasePopover.Backdrop>;

export function Backdrop({ className, ...props }: BackdropProps) {
	return (
		<BasePopover.Backdrop
			data-slot="popover-backdrop"
			className={cn(
				'fixed inset-0 z-40 min-h-dvh bg-black/50 transition-opacity duration-(--duration-state) ease-(--ease-overlay)',
				// iOS 26+: a fixed backdrop falls short of the visible viewport while scrolling.
				'supports-[-webkit-touch-callout:none]:absolute',
				'data-starting-style:opacity-0 data-ending-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}

export const Close = BasePopover.Close;

export type DescriptionProps = ComponentProps<typeof BasePopover.Description>;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<BasePopover.Description
			data-slot="popover-description"
			className={cn('mt-1 text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

export type PopupProps = ComponentProps<typeof BasePopover.Popup>;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BasePopover.Popup
			data-slot="popover-popup"
			className={cn(
				'relative origin-(--transform-origin) rounded-lg border bg-popover text-popover-foreground',
				'p-3 shadow-lg',
				// A Viewport inside brings its own padding, so this one would double up.
				'has-[>[data-slot=popover-viewport]]:p-0',
				// Set by Base UI only while a Viewport animates a size change.
				'h-(--popup-height,auto) w-(--popup-width,auto) max-w-md',
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

export const Portal = BasePopover.Portal;

export type PositionerProps = ComponentProps<typeof BasePopover.Positioner>;

export function Positioner({ className, sideOffset = 8, ...props }: PositionerProps) {
	return (
		<BasePopover.Positioner
			data-slot="popover-positioner"
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

export const Root = BasePopover.Root;

export type TitleProps = ComponentProps<typeof BasePopover.Title>;

export function Title({ className, ...props }: TitleProps) {
	return (
		<BasePopover.Title
			data-slot="popover-title"
			className={cn('text-sm font-semibold', className)}
			{...props}
		/>
	);
}

export const Trigger = BasePopover.Trigger;

export type ViewportProps = ComponentProps<typeof BasePopover.Viewport>;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BasePopover.Viewport
			data-slot="popover-viewport"
			className={cn(
				'[--viewport-inline-padding:--spacing(3)]',
				'relative h-full w-full overflow-clip px-(--viewport-inline-padding) py-3',
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
export const Popover = {
	Root,
	Trigger,
	Close,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Viewport,
	Arrow,
	Title,
	Description,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BasePopover.createHandle,
};
