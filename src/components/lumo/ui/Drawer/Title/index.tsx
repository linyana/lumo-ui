import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type TitleProps = ComponentProps<typeof BaseDrawer.Title>;

export function Title({ className, ...props }: TitleProps) {
	return (
		<BaseDrawer.Title
			data-slot="drawer-title"
			className={cn('text-base font-semibold', className)}
			{...props}
		/>
	);
}
