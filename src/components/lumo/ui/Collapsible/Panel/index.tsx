import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type PanelProps = ComponentProps<typeof BaseCollapsible.Panel>;

export function Panel({ className, ...props }: PanelProps) {
	return (
		<BaseCollapsible.Panel
			data-slot="collapsible-panel"
			className={cn(
				'overflow-hidden',
				'h-(--collapsible-panel-height)',
				'transition-[height] duration-(--duration-state) ease-(--ease-overlay)',
				'data-starting-style:h-0 data-ending-style:h-0',
				className,
			)}
			{...props}
		/>
	);
}
