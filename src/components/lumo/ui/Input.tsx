import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/cn';

export const inputVariants = tv({
	base: [
		'w-full min-w-0 rounded-md border border-input bg-background text-foreground',
		'placeholder:text-muted-foreground',
		'selection:bg-primary selection:text-primary-foreground',
		'transition-colors duration-(--duration-state)',
		'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-disabled:cursor-not-allowed data-disabled:opacity-50',
		// Still selectable, so still a field — but a settled one, like a value that is being shown.
		'read-only:bg-muted',
		// Written by Field when the control fails validation; aria-invalid is the same fact for a
		// form that is not Base UI's.
		'data-invalid:border-destructive aria-invalid:border-destructive',
	],
	variants: {
		size: {
			sm: 'h-8 px-2.5 text-sm',
			md: 'h-9 px-3 text-sm',
			lg: 'h-10 px-3.5 text-base',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type InputProps = Omit<ComponentProps<typeof BaseInput>, 'className' | 'size'> &
	VariantProps<typeof inputVariants> & {
		/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
		className?: string;
	};

/**
 * A single line of text. `size` is its height — the same 32/36/40 a Button takes, so the two line
 * up in a row — and never the browser's character count: the width comes from the container.
 */
export function Input({ className, size = 'md', ...props }: InputProps) {
	return (
		<BaseInput
			data-slot="input"
			data-size={size}
			className={cn(inputVariants({ size }), className)}
			{...props}
		/>
	);
}
