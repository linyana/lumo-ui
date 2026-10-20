import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export const Group = BaseMenu.Group;

export type GroupLabelProps = ComponentProps<typeof BaseMenu.GroupLabel>;

const groupLabelClass = `
	px-4 py-2 text-sm leading-4 text-muted-foreground select-none
`;

export function GroupLabel({ className, ...props }: GroupLabelProps) {
	return (
		<BaseMenu.GroupLabel
			data-slot="dropdown-group-label"
			className={cn(groupLabelClass, className)}
			{...props}
		/>
	);
}

export type ItemProps = ComponentProps<typeof BaseMenu.Item>;

const itemClass = `
	flex cursor-default py-2 pr-8 pl-4
	text-sm leading-4 outline-none select-none
	data-highlighted:relative data-highlighted:z-0 data-highlighted:text-accent-foreground
	data-highlighted:before:absolute data-highlighted:before:inset-x-1
	data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]
	data-highlighted:before:bg-accent data-highlighted:before:content-['']
`;

export function Item({ className, ...props }: ItemProps) {
	return (
		<BaseMenu.Item data-slot="dropdown-item" className={cn(itemClass, className)} {...props} />
	);
}

export type PopupProps = ComponentProps<typeof BaseMenu.Popup>;

const popupClass = `
	relative h-(--popup-height,auto) w-(--popup-width,auto) py-1
	origin-(--transform-origin) rounded-lg border
	bg-popover text-popover-foreground shadow-lg outline-none
	transition-[width,height,opacity,scale]
	duration-(--duration-overlay) ease-(--ease-overlay)
	data-starting-style:scale-90 data-starting-style:opacity-0
	data-ending-style:scale-90 data-ending-style:opacity-0
	data-instant:transition-none
`;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseMenu.Popup
			data-slot="dropdown-popup"
			className={cn(popupClass, className)}
			{...props}
		/>
	);
}

export const Portal = BaseMenu.Portal;

export type PositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

const positionerClass = `
	z-50 outline-none
	h-(--positioner-height,auto) w-(--positioner-width,auto) max-w-(--available-width)
	transition-[top,left,right,bottom,transform]
	duration-(--duration-overlay) ease-(--ease-overlay)
	data-instant:transition-none
`;

export function Positioner({ className, ...props }: PositionerProps) {
	return (
		<BaseMenu.Positioner
			data-slot="dropdown-positioner"
			className={cn(positionerClass, className)}
			{...props}
		/>
	);
}

export const Root = BaseMenu.Root;

export type SeparatorProps = ComponentProps<typeof BaseMenu.Separator>;

export function Separator({ className, ...props }: SeparatorProps) {
	return (
		<BaseMenu.Separator
			data-slot="dropdown-separator"
			className={cn('mx-1 my-1 h-px bg-border', className)}
			{...props}
		/>
	);
}

export type TriggerProps<Payload = unknown> = BaseMenu.Trigger.Props<Payload>;

const triggerClass = `
	relative flex h-8 items-center justify-center
	rounded-md border bg-background
	px-3 text-sm font-normal text-foreground select-none
	transition-[color,background-color,border-color]
	ease-[var(--ease-spring)] duration-[var(--duration-state)]
	after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]
	after:bg-current after:opacity-0 after:transition-opacity
	after:duration-[var(--duration-state)]
	hover:after:opacity-[var(--state-layer-hover-opacity)]
	active:after:opacity-[var(--state-layer-pressed-opacity)]
	data-pressed:after:opacity-[var(--state-layer-hover-opacity)]
`;

export function Trigger<Payload>({ className, ...props }: TriggerProps<Payload>) {
	return (
		<BaseMenu.Trigger
			data-slot="dropdown-trigger"
			className={cn(triggerClass, className)}
			{...props}
		/>
	);
}

export type ViewportProps = ComponentProps<typeof BaseMenu.Viewport>;

const viewportClass = `
	relative h-full w-full overflow-clip p-0
	[&_[data-current]]:w-[var(--popup-width)]
	[&_[data-current]]:translate-x-0 [&_[data-current]]:opacity-100
	[&_[data-current]]:transition-[translate,opacity]
	[&_[data-current]]:duration-[var(--duration-overlay),calc(var(--duration-overlay)/2)]
	[&_[data-current]]:ease-(--ease-overlay)
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
	[&_[data-previous]]:w-[var(--popup-width)]
	[&_[data-previous]]:translate-x-0 [&_[data-previous]]:opacity-100
	[&_[data-previous]]:transition-[translate,opacity]
	[&_[data-previous]]:duration-[var(--duration-overlay),calc(var(--duration-overlay)/2)]
	[&_[data-previous]]:ease-(--ease-overlay)
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0
	[[data-instant]_&_[data-current]]:transition-none
	[[data-instant]_&_[data-previous]]:transition-none
`;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseMenu.Viewport
			data-slot="dropdown-viewport"
			className={cn(viewportClass, className)}
			{...props}
		/>
	);
}

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Dropdown = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Viewport,
	Group,
	GroupLabel,
	Item,
	Separator,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BaseMenu.createHandle,
};
