import type { ComponentProps } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/cn';

export type PopupProps = ComponentProps<typeof BaseTooltip.Popup>;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseTooltip.Popup
			data-slot="tooltip-popup"
			className={cn(
				'relative origin-(--transform-origin) rounded-md bg-primary text-xs',
				'text-primary-foreground shadow-md',
				'px-2.5 py-1',
				// A Viewport inside brings its own padding, so this one would double up.
				'has-[>[data-slot=tooltip-viewport]]:p-0',
				// Set by Base UI only while a Viewport animates a size change.
				'h-(--popup-height,auto) w-(--popup-width,auto) max-w-xs',
				'transition-[width,height,opacity,scale]',
				'duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-starting-style:scale-90 data-starting-style:opacity-0',
				'data-ending-style:scale-90 data-ending-style:opacity-0',
				'data-instant:transition-none',
				className,
			)}
			{...props}
		/>
	);
}
