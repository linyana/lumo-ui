import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/cn';

export type PositionerProps = ComponentProps<typeof BasePopover.Positioner>;

export function Positioner({ className, sideOffset = 8, ...props }: PositionerProps) {
	return (
		<BasePopover.Positioner
			data-slot="popover-positioner"
			sideOffset={sideOffset}
			className={cn(
				'z-50 max-w-(--available-width)',
				// Set by Base UI only while a Viewport animates a size change.
				'h-(--positioner-height,auto) w-(--positioner-width,auto)',
				'transition-[top,left,right,bottom,transform]',
				'duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-instant:transition-none',
				className,
			)}
			{...props}
		/>
	);
}
