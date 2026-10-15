import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/cn';

export type DescriptionProps = ComponentProps<typeof BasePopover.Description>;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<BasePopover.Description
			data-slot="popover-description"
			className={cn('mt-1 text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}
