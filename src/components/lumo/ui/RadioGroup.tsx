import { Radio, type RadioRootProps } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup, type RadioGroupProps } from '@base-ui/react/radio-group';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type RootProps<Value = unknown> = Omit<RadioGroupProps<Value>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** The group: one value for all of the items inside it, and the arrow keys between them. */
export function Root<Value>({ className, ...props }: RootProps<Value>) {
	return (
		<BaseRadioGroup
			data-slot="radio-group"
			className={cn('grid gap-2', className)}
			{...props}
		/>
	);
}

export type ItemProps<Value = unknown> = Omit<RadioRootProps<Value>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** One option. Base UI's `Radio`, named for what it is within the group rather than on its own. */
export function Item<Value>({ className, ...props }: ItemProps<Value>) {
	return (
		<Radio.Root
			data-slot="radio"
			className={cn(
				'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center',
				'rounded-full border border-input bg-background',
				'transition-[color,background-color,border-color] duration-(--duration-state)',
				'data-checked:border-primary',
				'data-invalid:border-destructive',
				'data-disabled:cursor-not-allowed data-disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	);
}

export type IndicatorProps = Omit<ComponentProps<typeof Radio.Indicator>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** The dot. Mounted only for the item that holds the group's value. */
export function Indicator({ className, ...props }: IndicatorProps) {
	return (
		<Radio.Indicator
			data-slot="radio-indicator"
			className={cn(
				'size-2 rounded-full bg-primary',
				'transition-[scale,opacity] duration-(--duration-state) ease-(--ease-spring)',
				'data-starting-style:scale-50 data-starting-style:opacity-0',
				'data-ending-style:scale-50 data-ending-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}

/** Exactly one of these. Give the group a name with `Field`, and each item one with `Field.Item`. */
export const RadioGroup = { Root, Item, Indicator };
