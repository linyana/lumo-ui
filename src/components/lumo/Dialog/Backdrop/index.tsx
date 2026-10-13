import type { ComponentProps } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/cn';

export type BackdropProps = ComponentProps<typeof BaseDialog.Backdrop>;

export function Backdrop({ className, ...props }: BackdropProps) {
	return (
		<BaseDialog.Backdrop
			data-slot="dialog-backdrop"
			className={cn(
				'fixed inset-0 z-40 bg-black/50 transition-opacity duration-150',
				'data-starting-style:opacity-0 data-ending-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}
