import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type PositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

const positionerClass = `
	z-50 outline-none
	h-(--positioner-height,auto) w-(--positioner-width,auto) max-w-(--available-width)
	transition-[top,left,right,bottom,transform]
	duration-(--duration-overlay) ease-(--ease-overlay)
	data-instant:transition-none
`;

export function Positioner({ className, ...props }: PositionerProps) {
	return (
		<BaseMenu.Positioner
			data-slot="dropdown-positioner"
			className={cn(positionerClass, className)}
			{...props}
		/>
	);
}
