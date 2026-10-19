import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type GroupProps = ComponentProps<'div'>;

export function Group({ className, ...props }: GroupProps) {
	return (
		<div
			data-slot="menu-group"
			className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
			{...props}
		/>
	);
}
