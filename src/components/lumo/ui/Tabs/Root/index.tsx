import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { useMemo, type ComponentProps } from 'react';
import { TabsContext, type TabsSize, type TabsVariant } from '@/components/lumo/ui/Tabs/context';
import { cn } from '@/lib/cn';

export type RootProps = ComponentProps<typeof BaseTabs.Root> & {
	variant?: TabsVariant;
	size?: TabsSize;
};

export function Root({
	className,
	variant = 'rounded',
	size = 'md',
	children,
	...props
}: RootProps) {
	const context = useMemo(() => ({ variant, size }), [variant, size]);

	return (
		<TabsContext.Provider value={context}>
			<BaseTabs.Root
				data-slot="tabs"
				data-variant={variant}
				data-size={size}
				className={cn(
					'grid grid-cols-1 gap-4',
					'data-[orientation=vertical]:grid-cols-[auto_1fr] data-[orientation=vertical]:items-start',
					className,
				)}
				{...props}
			>
				{children}
			</BaseTabs.Root>
		</TabsContext.Provider>
	);
}
