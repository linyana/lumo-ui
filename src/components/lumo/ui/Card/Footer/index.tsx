import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type FooterProps = ComponentProps<'div'>;

export function Footer({ className, ...props }: FooterProps) {
	return (
		<div
			data-slot="card-footer"
			className={cn('flex items-center gap-2 px-6 group-data-[size=sm]/card:px-4', className)}
			{...props}
		/>
	);
}
