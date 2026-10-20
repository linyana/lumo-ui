import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type GroupLabelProps = ComponentProps<'div'>;

/** Collapses to nothing in the compact menu, so the rows can stack without a heading. */
export function GroupLabel({ className, ...props }: GroupLabelProps) {
	return (
		<div
			data-slot="menu-group-label"
			className={cn(
				'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground',
				// Hidden in the rail, but the text stays in the DOM — truncating keeps it from
				// pushing a horizontal scrollbar out of a 3rem column.
				'truncate',
				'transition-[margin,opacity] duration-(--duration-state) ease-linear',
				'group-data-[compact]:-mt-8 group-data-[compact]:opacity-0',
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
				className,
			)}
			{...props}
		/>
	);
}
