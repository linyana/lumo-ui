import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type SwipeAreaProps = ComponentProps<typeof BaseDrawer.SwipeArea>;

/** The gesture points into the drawer, so the strip sits on the opposite edge. */
export function SwipeArea({ className, ...props }: SwipeAreaProps) {
	return (
		<BaseDrawer.SwipeArea
			data-slot="drawer-swipe-area"
			className={cn(
				'fixed z-10',
				'data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:right-0',
				'data-[swipe-direction=left]:w-10',
				'data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:left-0',
				'data-[swipe-direction=right]:w-10',
				'data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:bottom-0',
				'data-[swipe-direction=up]:h-10',
				'data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:top-0',
				'data-[swipe-direction=down]:h-10',
				className,
			)}
			{...props}
		/>
	);
}
