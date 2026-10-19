import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/cn';

export const menuSubButtonVariants = tv({
	base: [
		'flex h-7 w-full min-w-0 cursor-pointer items-center gap-2 overflow-hidden rounded-md',
		'px-2 select-none',
		'transition-[color,background-color] duration-(--duration-state)',
		'hover:bg-accent hover:text-accent-foreground',
		'data-active:bg-selected data-active:font-medium data-active:text-accent-foreground',
		'data-disabled:pointer-events-none data-disabled:opacity-50',
		'[&>span:last-child]:truncate',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
		'group-data-[compact]:hidden',
	],
	variants: {
		size: {
			sm: 'text-xs',
			md: 'text-sm',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type SubButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> &
	VariantProps<typeof menuSubButtonVariants> & {
		/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
		className?: string;
		/** Leading glyph, at the same grid as a top-level row's. */
		icon?: ReactNode;
		isActive?: boolean;
	};

export function SubButton({
	className,
	size = 'md',
	icon,
	isActive = false,
	children,
	...props
}: SubButtonProps) {
	return (
		<BaseButton
			data-slot="menu-sub-button"
			data-active={isActive || undefined}
			data-size={size}
			className={cn(menuSubButtonVariants({ size }), className)}
			{...props}
		>
			{icon}
			{children}
		</BaseButton>
	);
}
