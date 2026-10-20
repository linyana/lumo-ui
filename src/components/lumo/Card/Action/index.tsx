import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ActionProps = ComponentProps<'div'>;

/** The slot in the corner of a header — one button, one menu trigger, nothing tall. */
export function Action({ className, ...props }: ActionProps) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className,
			)}
			{...props}
		/>
	);
}
