import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type ViewportProps = ComponentProps<typeof BaseDrawer.Viewport>;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseDrawer.Viewport
			data-slot="drawer-viewport"
			className={cn('fixed inset-0 z-50', className)}
			{...props}
		/>
	);
}
