import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type SubItemProps = ComponentProps<'li'>;

export function SubItem({ className, ...props }: SubItemProps) {
	return (
		<li
			data-slot="menu-sub-item"
			className={cn('group/menu-sub-item relative', className)}
			{...props}
		/>
	);
}
