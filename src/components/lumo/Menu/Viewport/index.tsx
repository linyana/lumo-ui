import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type ViewportProps = ComponentProps<typeof BaseMenu.Viewport>;

const docsViewportClass = `
	relative h-full w-full overflow-clip p-0
	[&_[data-current]]:w-[var(--popup-width)]
	[&_[data-current]]:translate-x-0 [&_[data-current]]:opacity-100
	[&_[data-current]]:transition-[translate,opacity]
	[&_[data-current]]:duration-[350ms,175ms]
	[&_[data-current]]:ease-[cubic-bezier(0.22,1,0.36,1)]
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
	[&_[data-previous]]:w-[var(--popup-width)]
	[&_[data-previous]]:translate-x-0 [&_[data-previous]]:opacity-100
	[&_[data-previous]]:transition-[translate,opacity]
	[&_[data-previous]]:duration-[350ms,175ms]
	[&_[data-previous]]:ease-[cubic-bezier(0.22,1,0.36,1)]
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0
`;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseMenu.Viewport
			data-slot="menu-viewport"
			className={cn(docsViewportClass, className)}
			{...props}
		/>
	);
}
