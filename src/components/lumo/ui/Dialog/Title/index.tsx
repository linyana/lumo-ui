import type { ComponentProps } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/cn';

export type TitleProps = ComponentProps<typeof BaseDialog.Title>;

export function Title({ className, ...props }: TitleProps) {
	return (
		<BaseDialog.Title
			data-slot="dialog-title"
			className={cn('text-base font-semibold', className)}
			{...props}
		/>
	);
}
