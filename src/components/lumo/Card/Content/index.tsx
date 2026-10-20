import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ContentProps = ComponentProps<'div'>;

export function Content({ className, ...props }: ContentProps) {
	return (
		<div
			data-slot="card-content"
			// Grows into the slack of a stretched card, which keeps a footer on the bottom edge
			// when cards of different heights share a row.
			className={cn('flex-1 px-6 group-data-[size=sm]/card:px-4', className)}
			{...props}
		/>
	);
}
