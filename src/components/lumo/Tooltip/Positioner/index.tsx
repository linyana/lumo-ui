import type { ComponentProps } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/cn';

export type PositionerProps = ComponentProps<typeof BaseTooltip.Positioner>;

export function Positioner({ className, sideOffset = 11, ...props }: PositionerProps) {
	return (
		<BaseTooltip.Positioner
			data-slot="tooltip-positioner"
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
