import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type HeaderProps = ComponentProps<'div'>;

export function Header({ className, ...props }: HeaderProps) {
	return (
		<div
			data-slot="card-header"
			// Two columns only when an action is present, so a title and its description stay in
			// one column and the action sits opposite both of them.
			className={cn(
				'grid auto-rows-min items-start gap-1.5 px-6 group-data-[size=sm]/card:px-4',
				'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
				'has-data-[slot=card-description]:grid-rows-[auto_auto]',
				className,
			)}
			{...props}
		/>
	);
}
