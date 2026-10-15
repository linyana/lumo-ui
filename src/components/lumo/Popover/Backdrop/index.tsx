import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/cn';

export type BackdropProps = ComponentProps<typeof BasePopover.Backdrop>;

export function Backdrop({ className, ...props }: BackdropProps) {
	return (
		<BasePopover.Backdrop
			data-slot="popover-backdrop"
			className={cn(
				'fixed inset-0 z-40 min-h-dvh bg-black/50 transition-opacity duration-(--duration-state) ease-(--ease-overlay)',
				// iOS 26+: a fixed backdrop falls short of the visible viewport while scrolling.
				'supports-[-webkit-touch-callout:none]:absolute',
				'data-starting-style:opacity-0 data-ending-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}
