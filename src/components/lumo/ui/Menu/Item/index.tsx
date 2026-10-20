import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ItemProps = ComponentProps<'li'>;

/** The anchor a row's action and badge are positioned against. */
export function Item({ className, ...props }: ItemProps) {
	return (
		<li
			data-slot="menu-item"
			className={cn('group/menu-item relative', className)}
			{...props}
		/>
	);
}
