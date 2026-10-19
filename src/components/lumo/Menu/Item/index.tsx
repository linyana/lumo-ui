import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type ItemProps = ComponentProps<typeof BaseMenu.Item>;

const itemClass = `
	flex cursor-default py-2 pr-8 pl-4
	text-sm leading-4 outline-none select-none
	data-highlighted:relative data-highlighted:z-0 data-highlighted:text-accent-foreground
	data-highlighted:before:absolute data-highlighted:before:inset-x-1
	data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]
	data-highlighted:before:bg-accent data-highlighted:before:content-['']
`;

export function Item({ className, ...props }: ItemProps) {
	return <BaseMenu.Item data-slot="menu-item" className={cn(itemClass, className)} {...props} />;
}
