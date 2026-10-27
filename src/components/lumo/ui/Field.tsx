import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * A control is labelled and validated by the field around it, so this part owns no look: whatever
 * element it renders — Base UI's Input, a native `<textarea>`, a Checkbox — keeps its own.
 */
export const Control = BaseField.Control;

export type DescriptionProps = Omit<ComponentProps<typeof BaseField.Description>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<BaseField.Description
			data-slot="field-description"
			className={cn('text-sm text-muted-foreground data-disabled:opacity-50', className)}
			{...props}
		/>
	);
}

export type ErrorProps = Omit<ComponentProps<typeof BaseField.Error>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/**
 * Renders nothing while the field is valid, and the field's own message — the browser's, or the
 * string `validate` returned — when it is not. Children replace that message.
 */
export function Error({ className, ...props }: ErrorProps) {
	return (
		<BaseField.Error
			data-slot="field-error"
			className={cn('text-sm text-destructive', className)}
			{...props}
		/>
	);
}

/** One entry in a group that shares a field: the label and the sentence beside it. */
export const Item = BaseField.Item;

export type LabelProps = Omit<ComponentProps<typeof BaseField.Label>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

export function Label({ className, ...props }: LabelProps) {
	return (
		<BaseField.Label
			data-slot="field-label"
			className={cn('text-sm font-medium select-none data-disabled:opacity-50', className)}
			{...props}
		/>
	);
}

export type RootProps = Omit<ComponentProps<typeof BaseField.Root>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** The state: the name the value is submitted under, the validation, and the disabled flag. */
export function Root({ className, ...props }: RootProps) {
	return (
		<BaseField.Root
			data-slot="field"
			className={cn('flex flex-col gap-1.5', className)}
			{...props}
		/>
	);
}

/** The field's validity, handed to a function — for a message the `Error` cannot type itself. */
export const Validity = BaseField.Validity;

/** One control, its name, and the line under it that explains or complains. */
export const Field = { Root, Label, Control, Description, Error, Item, Validity };
