import type { ComponentProps } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/cn';

export type DescriptionProps = ComponentProps<typeof BaseDialog.Description>;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<BaseDialog.Description
			data-slot="dialog-description"
			className={cn('mt-1.5 text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}
