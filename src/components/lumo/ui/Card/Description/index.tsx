import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type DescriptionProps = ComponentProps<'div'>;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}
