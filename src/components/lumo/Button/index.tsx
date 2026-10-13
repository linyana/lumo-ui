import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Spinner } from '@/components/lumo/Spinner';
import { cn } from '@/lib/cn';

/** Reference component — other components follow this shape. */
export const buttonVariants = tv({
	base: [
		'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
		'rounded-md font-medium select-none',
		'transition-colors',
		'disabled:pointer-events-none disabled:opacity-50',
		'data-loading:pointer-events-none',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		'cursor-pointer',
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

export type ButtonProps = ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		/** Leading graphic. While `loading` the spinner takes this slot. */
		icon?: ReactNode;
		/** Custom spinner, defaults to the built-in one. */
		loadingIcon?: ReactNode;
		loading?: boolean;
	};

export function Button({
	className,
	variant = 'default',
	size = 'md',
	icon = null,
	loadingIcon,
	loading = false,
	disabled = false,
	children,
	...props
}: ButtonProps) {
	const spinner = loadingIcon ?? <Spinner label={null} />;

	return (
		<BaseButton
			data-slot="button"
			data-variant={variant}
			data-size={size}
			data-loading={loading ? '' : undefined}
			aria-busy={loading || undefined}
			disabled={disabled || loading}
			focusableWhenDisabled={loading || undefined}
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		>
			{icon ? (
				<>
					{loading ? spinner : icon}
					{children}
				</>
			) : (
				<span data-slot="button-content" className="grid">
					<span className={cn('col-start-1 row-start-1', loading && 'opacity-0')}>
						{children}
					</span>
					{loading && (
						<span className="col-start-1 row-start-1 flex place-self-center">
							{spinner}
						</span>
					)}
				</span>
			)}
		</BaseButton>
	);
}
