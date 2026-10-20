import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type ContentProps = ComponentProps<typeof BaseDrawer.Content>;

export function Content({ className, ...props }: ContentProps) {
	return (
		<BaseDrawer.Content
			data-slot="drawer-content"
			className={cn('flex min-h-0 flex-col gap-2 overflow-y-auto p-6', className)}
			{...props}
		/>
	);
}
