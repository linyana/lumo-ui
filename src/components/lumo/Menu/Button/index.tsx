import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { useMenu } from '@/components/lumo/Menu/context';
import { Tooltip } from '@/components/lumo/Tooltip';
import { cn } from '@/lib/cn';

export const menuButtonVariants = tv({
	base: [
		'peer/menu-button relative flex w-full cursor-pointer items-center gap-2 overflow-hidden',
		'rounded-md p-2 text-left text-sm select-none',
		'transition-[color,background-color] duration-(--duration-state) ease-[var(--ease-spring)]',
		'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
		'after:bg-current after:opacity-0 after:transition-opacity',
		'after:duration-(--duration-state)',
		'hover:after:opacity-(--state-layer-hover-opacity)',
		'active:after:opacity-(--state-layer-pressed-opacity)',
		'data-active:bg-accent data-active:font-medium data-active:text-accent-foreground',
		'data-disabled:pointer-events-none data-disabled:opacity-50',
		'[&>span:last-child]:truncate',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
		// The rail: one square holding a single glyph, so the gap goes and the content centres.
		'group-data-[compact]:size-8! group-data-[compact]:justify-center',
		'group-data-[compact]:gap-0 group-data-[compact]:p-0!',
	],
	variants: {
		variant: {
			default: '',
			outline: 'border bg-background shadow-[0_0_0_1px_var(--border)]',
		},
		size: {
			sm: 'h-7 text-xs',
			md: 'h-8 text-sm',
			lg: 'h-12 text-sm',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> &
	VariantProps<typeof menuButtonVariants> & {
		/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
		className?: string;
		/** Leading glyph. Survives the compact menu on its own. */
		icon?: ReactNode;
		/**
		 * The row's text. Given it, the compact menu can stand in with its first letter when there
		 * is no icon, and the tooltip has something to say.
		 */
		label?: string;
		/** Marks the row as the page you are on. */
		isActive?: boolean;
		/** Shown only while the menu is compact. Defaults to `label`; `false` when something else
		 * already opens from the row, such as a submenu popover. */
		tooltip?: ReactNode;
		tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
	};

export function Button({
	className,
	variant = 'default',
	size = 'md',
	icon,
	label,
	isActive = false,
	tooltip,
	tooltipSide = 'right',
	children,
	...props
}: ButtonProps) {
	const { compact } = useMenu();
	const initial = label?.trim().charAt(0) ?? '';

	const button = (
		<BaseButton
			data-slot="menu-button"
			data-active={isActive || undefined}
			data-size={size}
			className={cn(menuButtonVariants({ variant, size }), className)}
			{...props}
		>
			{icon}
			{label !== undefined && (
				<span
					data-slot="menu-button-label"
					// `truncate` keeps the a11y name while `w-0` hides the text: overflow is what lets a
					// flex item shrink past its content width, so it is the width that stops applying,
					// not the text that disappears.
					className="truncate group-data-[compact]:w-0"
				>
					{label}
				</span>
			)}
			{icon === undefined && initial !== '' && (
				<span
					data-slot="menu-button-initial"
					aria-hidden="true"
					className="hidden group-data-[compact]:block"
				>
					{initial}
				</span>
			)}
			{children}
		</BaseButton>
	);

	const hint = tooltip ?? label;
	if (hint === undefined || hint === false || !compact) return button;

	return (
		<Tooltip.Root>
			<Tooltip.Trigger render={button} />
			<Tooltip.Portal>
				<Tooltip.Positioner side={tooltipSide} align="center">
					<Tooltip.Popup>{hint}</Tooltip.Popup>
				</Tooltip.Positioner>
			</Tooltip.Portal>
		</Tooltip.Root>
	);
}
