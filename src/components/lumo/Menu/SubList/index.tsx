import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type SubListProps = ComponentProps<'ul'>;

/** The list of sub rows: indented from the menu edge, then filling the rest of the line. */
export function SubList({ className, ...props }: SubListProps) {
	return (
		<ul
			data-slot="menu-sub-list"
			className={cn(
				'ms-4 me-2 mt-1 flex min-w-0 flex-col gap-1 border-s ps-1',
				'group-data-[compact]:hidden',
				className,
			)}
			{...props}
		/>
	);
}
