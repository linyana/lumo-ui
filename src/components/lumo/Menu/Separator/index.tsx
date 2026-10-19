import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type SeparatorProps = ComponentProps<typeof BaseMenu.Separator>;

export function Separator({ className, ...props }: SeparatorProps) {
	return (
		<BaseMenu.Separator
			data-slot="menu-separator"
			className={cn('mx-1 my-1 h-px bg-border', className)}
			{...props}
		/>
	);
}
