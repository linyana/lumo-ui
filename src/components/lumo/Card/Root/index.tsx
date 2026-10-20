import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/cn';

export const cardVariants = tv({
	base: ['group/card flex flex-col', 'rounded-xl border bg-card text-card-foreground shadow-sm'],
	variants: {
		size: {
			sm: 'gap-4 py-4',
			md: 'gap-6 py-6',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type CardSize = NonNullable<VariantProps<typeof cardVariants>['size']>;

export type RootProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>;

/** The surface itself. Its size cascades to the parts, which read it off `data-size`. */
export function Root({ className, size = 'md', ...props }: RootProps) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(cardVariants({ size }), className)}
			{...props}
		/>
	);
}
