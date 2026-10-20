import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ActionProps = ComponentProps<'button'> & {
	/** Keeps the row quiet until it is hovered or focused. */
	showOnHover?: boolean;
};

/** A secondary action that rides on a row, such as "more" or a delete. */
export function Action({ className, showOnHover = false, ...props }: ActionProps) {
	return (
		<button
			data-slot="menu-action"
			className={cn(
				'absolute end-1 flex aspect-square w-5 cursor-pointer items-center justify-center',
				'rounded-md p-0 text-muted-foreground select-none',
				'transition-[color,background-color,opacity] duration-(--duration-state)',
				'hover:bg-accent hover:text-accent-foreground',
				'peer-hover/menu-button:text-accent-foreground',
				// Widens the hit area on touch, where the glyph itself is too small.
				'after:absolute after:-inset-2 md:after:hidden',
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
				'peer-data-[size=sm]/menu-button:top-1',
				'peer-data-[size=md]/menu-button:top-1.5',
				'peer-data-[size=lg]/menu-button:top-2.5',
				'group-data-[compact]:hidden',
				showOnHover &&
					'md:opacity-0 group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100',
				className,
			)}
			{...props}
		/>
	);
}
