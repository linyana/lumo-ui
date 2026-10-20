import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type PanelProps = ComponentProps<typeof BaseTabs.Panel>;

export function Panel({ className, ...props }: PanelProps) {
	return (
		<BaseTabs.Panel
			data-slot="tabs-panel"
			// Every panel claims the one cell after the list, so the panel leaving and the panel
			// arriving overlap for the length of the transition instead of stacking end to end.
			className={cn(
				'col-start-1 row-start-2 min-w-0 text-sm',
				'data-[orientation=vertical]:col-start-2 data-[orientation=vertical]:row-start-1',
				'transition-[opacity,translate]',
				'duration-(--duration-overlay) ease-(--ease-overlay)',
				'data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:pointer-events-none',
				'data-starting-style:data-[activation-direction=left]:-translate-x-2',
				'data-starting-style:data-[activation-direction=right]:translate-x-2',
				'data-ending-style:data-[activation-direction=left]:translate-x-2',
				'data-ending-style:data-[activation-direction=right]:-translate-x-2',
				className,
			)}
			{...props}
		/>
	);
}
