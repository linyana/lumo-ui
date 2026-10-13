import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/cn';

/** Reference component — other components follow this shape. */
export const buttonVariants = tv({
	base: [
		'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
		'rounded-md font-medium select-none',
		'transition-colors',
		'disabled:pointer-events-none disabled:opacity-50',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		'cursor-pointer'
	],
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			destructive: 'bg-destructive text-white hover:bg-destructive/90',
			link: 'text-primary underline-offset-4 hover:underline',
		},
		size: {
			sm: 'h-8 gap-1.5 px-3 text-sm',
			md: 'h-9 px-4 text-sm',
			lg: 'h-10 px-6 text-base',
			icon: 'size-9',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
	return (
		<button
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	);
}
