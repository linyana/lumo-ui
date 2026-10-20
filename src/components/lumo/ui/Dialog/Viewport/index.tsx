import type { ComponentProps } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/cn';

export type ViewportProps = ComponentProps<typeof BaseDialog.Viewport>;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseDialog.Viewport
			data-slot="dialog-viewport"
			className={cn('fixed inset-0 z-50 grid place-items-center p-4', className)}
			{...props}
		/>
	);
}
