import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/cn';

export type TitleProps = ComponentProps<typeof BasePopover.Title>;

export function Title({ className, ...props }: TitleProps) {
	return (
		<BasePopover.Title
			data-slot="popover-title"
			className={cn('text-sm font-semibold', className)}
			{...props}
		/>
	);
}
