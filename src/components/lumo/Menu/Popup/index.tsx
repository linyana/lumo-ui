import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type PopupProps = ComponentProps<typeof BaseMenu.Popup>;

const popupClass = `
	relative h-(--popup-height,auto) w-(--popup-width,auto) py-1
	origin-(--transform-origin) rounded-lg border
	bg-popover text-popover-foreground shadow-lg outline-none
	transition-[width,height,opacity,scale]
	duration-(--duration-overlay) ease-(--ease-overlay)
	data-starting-style:scale-90 data-starting-style:opacity-0
	data-ending-style:scale-90 data-ending-style:opacity-0
	data-instant:transition-none
`;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseMenu.Popup data-slot="menu-popup" className={cn(popupClass, className)} {...props} />
	);
}
