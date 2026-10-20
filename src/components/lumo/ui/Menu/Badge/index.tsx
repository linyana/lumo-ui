import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type BadgeProps = ComponentProps<'div'>;

/** A count or a state on the row's trailing edge. Purely decorative — the row must say it too. */
export function Badge({ className, ...props }: BadgeProps) {
	return (
		<div
			data-slot="menu-badge"
			className={cn(
				'pointer-events-none absolute end-1 flex h-5 min-w-5 items-center justify-center',
				'rounded-md px-1 text-xs font-medium tabular-nums select-none',
				'peer-hover/menu-button:text-accent-foreground',
				'peer-data-[active]/menu-button:text-accent-foreground',
				'peer-data-[size=sm]/menu-button:top-1',
				'peer-data-[size=md]/menu-button:top-1.5',
				'peer-data-[size=lg]/menu-button:top-2.5',
				'group-data-[compact]:hidden',
				className,
			)}
			{...props}
		/>
	);
}
