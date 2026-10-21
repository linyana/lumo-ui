import { ChevronRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
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
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/**
 * Base UI animates the panel itself from 0 to its measured height; the body inside is a
 * `Transition`, so a body that changes size once it is open eases to the new size instead of
 * jumping.
 */
export function Panel({ className, transition = true, children, ...props }: PanelProps) {
	return (
		<BaseCollapsible.Panel
			data-slot="collapsible-panel"
			className={cn(
				'overflow-hidden',
				'h-(--collapsible-panel-height)',
				'transition-[height] duration-(--duration-state) ease-(--ease-overlay)',
				'data-starting-style:h-0 data-ending-style:h-0',
				className,
			)}
			{...props}
		>
			{transition === false ? children : <Transition>{children}</Transition>}
		</BaseCollapsible.Panel>
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
