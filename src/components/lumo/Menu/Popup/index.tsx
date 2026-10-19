import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type PopupProps = ComponentProps<typeof BaseMenu.Popup>;

const docsPopupClass = `
	relative h-[var(--popup-height,auto)] w-[var(--popup-width,auto)] py-1
	origin-[var(--transform-origin)] border border-neutral-950
	bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 outline-none
	transition-[width,height,opacity,scale]
	duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]
	data-starting-style:scale-90 data-starting-style:opacity-0
	data-ending-style:scale-90 data-ending-style:opacity-0
	data-instant:transition-none
	dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none
`;

export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseMenu.Popup
			data-slot="menu-popup"
			className={cn(docsPopupClass, className)}
			{...props}
		/>
	);
}
