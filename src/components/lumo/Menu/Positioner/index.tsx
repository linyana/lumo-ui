import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type PositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

const docsPositionerClass = `
	outline-none
	h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]
	transition-[top,left,right,bottom,transform]
	duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]
	data-instant:transition-none
`;

export function Positioner({ className, ...props }: PositionerProps) {
	return (
		<BaseMenu.Positioner
			data-slot="menu-positioner"
			className={cn(docsPositionerClass, className)}
			{...props}
		/>
	);
}
