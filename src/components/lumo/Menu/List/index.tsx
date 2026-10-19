import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ListProps = ComponentProps<'ul'>;

export function List({ className, ...props }: ListProps) {
	return (
		<ul
			data-slot="menu-list"
			className={cn('flex w-full min-w-0 flex-col gap-1', className)}
			{...props}
		/>
	);
}
