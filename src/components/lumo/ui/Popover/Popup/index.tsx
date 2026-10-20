import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/cn';

export type PopupProps = ComponentProps<typeof BasePopover.Popup>;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BasePopover.Popup
			data-slot="popover-popup"
			className={cn(
				'relative origin-(--transform-origin) rounded-lg border bg-popover text-popover-foreground',
				'p-3 shadow-lg',
				// A Viewport inside brings its own padding, so this one would double up.
				'has-[>[data-slot=popover-viewport]]:p-0',
				// Set by Base UI only while a Viewport animates a size change.
				'h-(--popup-height,auto) w-(--popup-width,auto) max-w-md',
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
