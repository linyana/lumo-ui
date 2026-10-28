import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { buttonVariants } from '@/components/lumo/ui/Button';
import { cn } from '@/lib/cn';
import { popup, positioner, viewport } from '@/lib/surface';

export const Group = BaseMenu.Group;

export type GroupLabelProps = ComponentProps<typeof BaseMenu.GroupLabel>;

const groupLabelClass = cn('px-4 py-2 text-sm leading-4 text-muted-foreground select-none');

export function GroupLabel({ className, ...props }: GroupLabelProps) {
	return (
		<BaseMenu.GroupLabel
			data-slot="menu-group-label"
			className={cn(groupLabelClass, className)}
			{...props}
		/>
	);
}

export type ItemProps = ComponentProps<typeof BaseMenu.Item>;

const itemClass = cn(
	'flex cursor-default py-2 pr-8 pl-4',
	'text-sm leading-4 outline-none select-none',
	'data-highlighted:relative data-highlighted:z-0 data-highlighted:text-accent-foreground',
	'data-highlighted:before:absolute data-highlighted:before:inset-x-1',
	'data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]',
	"data-highlighted:before:bg-accent data-highlighted:before:content-['']",
);

export function Item({ className, ...props }: ItemProps) {
	return <BaseMenu.Item data-slot="menu-item" className={cn(itemClass, className)} {...props} />;
}

export type PopupProps = ComponentProps<typeof BaseMenu.Popup>;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseMenu.Popup
			data-slot="menu-popup"
			className={cn(
				'relative rounded-lg border bg-popover py-1 text-popover-foreground',
				'shadow-lg outline-none',
				popup,
				className,
			)}
			{...props}
		/>
	);
}

export const Portal = BaseMenu.Portal;

export type PositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

export function Positioner({ className, ...props }: PositionerProps) {
	return (
		<BaseMenu.Positioner
			data-slot="menu-positioner"
			className={cn('z-50 outline-none', positioner, className)}
			{...props}
		/>
	);
}

export const Root = BaseMenu.Root;

export type SeparatorProps = ComponentProps<typeof BaseMenu.Separator>;

export function Separator({ className, ...props }: SeparatorProps) {
	return (
		<BaseMenu.Separator
			data-slot="menu-separator"
			className={cn('mx-1 my-1 h-px bg-border', className)}
			{...props}
		/>
	);
}

export type TriggerProps<Payload = unknown> = BaseMenu.Trigger.Props<Payload>;

/**
 * The button that opens it: a Button's outlined, small shape, so a trigger in a row of controls is
 * the same height and the same weight as everything beside it. An open menu keeps the hover tint
 * rather than the press one, because it is held open rather than being pressed.
 */
const triggerClass = cn(
	buttonVariants({ variant: 'outline', size: 'sm' }),
	'font-normal data-pressed:after:opacity-(--state-layer-hover-opacity)',
);

export function Trigger<Payload>({ className, ...props }: TriggerProps<Payload>) {
	return (
		<BaseMenu.Trigger
			data-slot="menu-trigger"
			className={cn(triggerClass, className)}
			{...props}
		/>
	);
}

export type ViewportProps = ComponentProps<typeof BaseMenu.Viewport>;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseMenu.Viewport
			data-slot="menu-viewport"
			// The popup's own padding is vertical only, so the track takes its full width.
			className={cn(viewport, '[--viewport-inline-padding:--spacing(0)] py-0', className)}
			{...props}
		/>
	);
}

/**
 * Base UI supplies behaviour — the roving highlight, the typeahead, the focus that returns to the
 * trigger — and these parts supply appearance. Compose with `render`.
 *
 * Not to be confused with `Nav`, which is a list of destinations that is always in the layout: a
 * menu is opened, holds actions, and closes.
 */
export const Menu = {
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
