import type { ComponentProps } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/cn';

export type PopupProps = ComponentProps<typeof BaseDialog.Popup>;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseDialog.Popup
			data-slot="dialog-popup"
			className={cn(
				'w-full max-w-md rounded-xl border bg-popover p-6 text-popover-foreground shadow-lg',
				'transition-[transform,opacity] duration-150',
				'data-starting-style:scale-95 data-starting-style:opacity-0',
				'data-ending-style:scale-95 data-ending-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}
