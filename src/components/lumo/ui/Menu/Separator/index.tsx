import type { ComponentProps } from 'react';
import { Separator as BaseSeparator } from '@/components/lumo/ui/Separator';
import { cn } from '@/lib/cn';

export type SeparatorProps = ComponentProps<typeof BaseSeparator>;

/** Section split inside the list, inset so it does not run into the rounded corners. */
export function Separator({ className, ...props }: SeparatorProps) {
	return (
		<BaseSeparator
			data-slot="menu-separator"
			className={cn('mx-2 w-auto', className)}
			{...props}
		/>
	);
}
