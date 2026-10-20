import type { ComponentProps } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/cn';

export type IndentBackgroundProps = ComponentProps<typeof BaseDrawer.IndentBackground>;

/** The surface a scaled-down app reveals at its edges. */
export function IndentBackground({ className, ...props }: IndentBackgroundProps) {
	return (
		<BaseDrawer.IndentBackground
			data-slot="drawer-indent-background"
			className={cn('absolute inset-0 bg-foreground', className)}
			{...props}
		/>
	);
}
