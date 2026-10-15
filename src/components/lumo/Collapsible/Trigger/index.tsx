import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type TriggerProps = ComponentProps<typeof BaseCollapsible.Trigger>;

export function Trigger({ className, ...props }: TriggerProps) {
	return (
		<BaseCollapsible.Trigger
			data-slot="collapsible-trigger"
			className={cn(
				'group relative flex w-full cursor-pointer items-center justify-between gap-2',
				'rounded-md px-3 py-2 text-left text-sm font-medium select-none',
				'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
				'after:bg-current after:opacity-0 after:transition-opacity',
				'after:duration-(--duration-state)',
				'hover:after:opacity-(--state-layer-hover-opacity)',
				'active:after:opacity-(--state-layer-pressed-opacity)',
				'data-disabled:pointer-events-none data-disabled:opacity-50',
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
				className,
			)}
			{...props}
		/>
	);
}
