import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type DescriptionProps = ComponentProps<typeof BaseDrawer.Description>;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<BaseDrawer.Description
			data-slot="drawer-description"
			className={cn('mt-1.5 text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}
