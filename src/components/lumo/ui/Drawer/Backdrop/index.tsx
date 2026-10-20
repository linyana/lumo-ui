import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type BackdropProps = ComponentProps<typeof BaseDrawer.Backdrop>;

export function Backdrop({ className, ...props }: BackdropProps) {
	return (
		<BaseDrawer.Backdrop
			data-slot="drawer-backdrop"
			className={cn(
				'fixed inset-0 z-40 min-h-dvh bg-black/50 transition-opacity duration-(--duration-state) ease-(--ease-overlay)',
				'supports-[-webkit-touch-callout:none]:absolute',
				'data-starting-style:opacity-0 data-ending-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}
