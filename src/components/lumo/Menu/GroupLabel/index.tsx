import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type GroupLabelProps = ComponentProps<typeof BaseMenu.GroupLabel>;

const groupLabelClass = `
	px-4 py-2 text-sm leading-4 text-muted-foreground select-none
`;

export function GroupLabel({ className, ...props }: GroupLabelProps) {
	return (
		<BaseMenu.GroupLabel
			data-slot="menu-group-label"
			className={cn(groupLabelClass, className)}
			{...props}
		/>
	);
}
