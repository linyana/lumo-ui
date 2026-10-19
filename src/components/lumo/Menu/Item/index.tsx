import type { ComponentProps } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type ItemProps = ComponentProps<typeof BaseMenu.Item>;

const docsItemClass = `
	flex cursor-default py-2 pr-8 pl-4
	text-sm leading-4 outline-none select-none
	data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white
	data-highlighted:before:absolute data-highlighted:before:inset-x-1
	data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]
	data-highlighted:before:bg-neutral-950 data-highlighted:before:content-['']
	dark:data-highlighted:text-neutral-950 dark:data-highlighted:before:bg-white
`;

export function Item({ className, ...props }: ItemProps) {
	return (
		<BaseMenu.Item data-slot="menu-item" className={cn(docsItemClass, className)} {...props} />
	);
}
