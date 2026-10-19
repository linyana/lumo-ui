import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type ViewportProps = ComponentProps<typeof BaseMenu.Viewport>;

const viewportClass = `
	relative h-full w-full overflow-clip p-0
	[&_[data-current]]:w-[var(--popup-width)]
	[&_[data-current]]:translate-x-0 [&_[data-current]]:opacity-100
	[&_[data-current]]:transition-[translate,opacity]
	[&_[data-current]]:duration-[var(--duration-overlay),calc(var(--duration-overlay)/2)]
	[&_[data-current]]:ease-(--ease-overlay)
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
	[&_[data-previous]]:w-[var(--popup-width)]
	[&_[data-previous]]:translate-x-0 [&_[data-previous]]:opacity-100
	[&_[data-previous]]:transition-[translate,opacity]
	[&_[data-previous]]:duration-[var(--duration-overlay),calc(var(--duration-overlay)/2)]
	[&_[data-previous]]:ease-(--ease-overlay)
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0
	[[data-instant]_&_[data-current]]:transition-none
	[[data-instant]_&_[data-previous]]:transition-none
`;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseMenu.Viewport
			data-slot="menu-viewport"
			className={cn(viewportClass, className)}
			{...props}
		/>
	);
}
