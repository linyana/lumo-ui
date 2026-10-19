import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type GroupActionProps = ComponentProps<'button'>;

/** The "+" that belongs to a group rather than to one of its rows. */
export function GroupAction({ className, ...props }: GroupActionProps) {
	return (
		<button
			data-slot="menu-group-action"
			className={cn(
				'absolute end-3 top-3.5 flex aspect-square w-5 cursor-pointer items-center justify-center',
				'rounded-md p-0 text-muted-foreground select-none',
				'transition-colors duration-(--duration-state)',
				'hover:bg-accent hover:text-accent-foreground',
				// Widens the hit area on touch, where the glyph itself is too small.
				'after:absolute after:-inset-2 md:after:hidden',
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
				'group-data-[compact]:hidden',
				className,
			)}
			{...props}
		/>
	);
}
