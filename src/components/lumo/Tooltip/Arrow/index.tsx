import type { ComponentProps } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/cn';

export type ArrowProps = ComponentProps<typeof BaseTooltip.Arrow>;

export function Arrow({ className, ...props }: ArrowProps) {
	return (
		<BaseTooltip.Arrow
			data-slot="tooltip-arrow"
			className={cn(
				'block h-1.5 w-3 overflow-clip',
				'transition-[left,top] duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-instant:transition-none',
				// Base UI places the arrow on the anchor axis; which edge it hangs off is ours.
				'data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180',
				'data-[side=left]:-right-2.25 data-[side=left]:rotate-90',
				'data-[side=right]:-left-2.25 data-[side=right]:-rotate-90',
				// A square of 6px·√2 centred on the popup edge, clipped to its upper half.
				'before:absolute before:bottom-0 before:left-1/2 before:size-[calc(6px*sqrt(2))]',
				'before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:bg-primary',
				className,
			)}
			{...props}
		/>
	);
}
