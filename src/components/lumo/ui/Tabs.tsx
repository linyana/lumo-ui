import { createContext, useContext, type ComponentProps, useMemo } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/cn';

export type TabsVariant = 'rounded' | 'square' | 'point';
export type TabsSize = 'sm' | 'md' | 'lg';

export type TabsContextValue = {
	variant: TabsVariant;
	size: TabsSize;
};

export const TabsContext = createContext<TabsContextValue>({ variant: 'rounded', size: 'md' });

/** The variant and size set on `Tabs.Root`, which every part inherits unless it overrides one. */
export function useTabs() {
	return useContext(TabsContext);
}

export const indicatorVariants = tv({
	base: [
		'pointer-events-none absolute top-0 left-0 z-0',
		'h-(--active-tab-height) w-(--active-tab-width)',
		'translate-x-(--active-tab-left) translate-y-(--active-tab-top)',
		'transition-[translate,width,height]',
		'duration-(--duration-overlay) ease-(--ease-overlay)',
	],
	variants: {
		variant: {
			rounded: 'rounded-md bg-card shadow-sm',
			square: [
				'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary',
				'data-[orientation=vertical]:after:inset-x-auto',
				'data-[orientation=vertical]:after:inset-y-0 data-[orientation=vertical]:after:right-0',
				'data-[orientation=vertical]:after:h-auto data-[orientation=vertical]:after:w-0.5',
			],
			point: [
				'after:absolute after:bottom-1 after:left-1/2 after:size-1.5',
				'after:-translate-x-1/2 after:rounded-full after:bg-primary',
			],
		},
	},
	defaultVariants: {
		variant: 'rounded',
	},
});

export type IndicatorProps = Omit<ComponentProps<typeof BaseTabs.Indicator>, 'className'> &
	VariantProps<typeof indicatorVariants> & {
		/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
		className?: string;
	};

/**
 * The moving highlight. Base UI measures the active tab and hands the result over as CSS
 * variables, so this only draws — and the same element follows the tab in either orientation.
 */
export function Indicator({ className, variant, ...props }: IndicatorProps) {
	const context = useTabs();
	const resolved = variant ?? context.variant;

	return (
		<BaseTabs.Indicator
			data-slot="tabs-indicator"
			data-variant={resolved}
			className={cn(indicatorVariants({ variant: resolved }), className)}
			{...props}
		/>
	);
}

export const listVariants = tv({
	base: [
		'relative flex w-fit items-center',
		'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
	],
	variants: {
		variant: {
			rounded: 'gap-1 rounded-lg bg-muted p-1',
			square: [
				'gap-4',
				'shadow-[inset_0_-1px_0_var(--border)]',
				'data-[orientation=vertical]:shadow-[inset_-1px_0_0_var(--border)]',
			],
			point: 'gap-4',
		},
	},
	defaultVariants: {
		variant: 'rounded',
	},
});

export type ListProps = Omit<ComponentProps<typeof BaseTabs.List>, 'className'> &
	VariantProps<typeof listVariants> & {
		/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
		className?: string;
	};

export function List({ className, variant, ...props }: ListProps) {
	const context = useTabs();
	const resolved = variant ?? context.variant;

	return (
		<BaseTabs.List
			data-slot="tabs-list"
			data-variant={resolved}
			className={cn(listVariants({ variant: resolved }), className)}
			{...props}
		/>
	);
}

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

export const tabVariants = tv({
	base: [
		'relative z-1 flex cursor-pointer items-center justify-center gap-1.5',
		'font-medium whitespace-nowrap select-none',
		'text-muted-foreground transition-[color,translate] duration-(--duration-state)',
		'active:translate-y-(--press-offset)',
		'hover:text-foreground data-active:text-foreground',
		'data-disabled:pointer-events-none data-disabled:opacity-50',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
	],
	variants: {
		variant: {
			rounded: 'rounded-md',
			// Both of these are shaped by the space their indicator needs, not by a fixed height.
			square: 'h-auto! rounded-none py-2',
			point: 'h-auto! rounded-none pt-1.5 pb-3',
		},
		size: {
			sm: 'h-7 px-2.5 text-xs',
			md: 'h-8 px-3 text-sm',
			lg: 'h-9 px-4 text-sm',
		},
	},
	defaultVariants: {
		variant: 'rounded',
		size: 'md',
	},
});

export type TabProps = Omit<ComponentProps<typeof BaseTabs.Tab>, 'className'> &
	VariantProps<typeof tabVariants> & {
		/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
		className?: string;
	};

export function Tab({ className, variant, size, ...props }: TabProps) {
	const context = useTabs();
	const resolvedVariant = variant ?? context.variant;
	const resolvedSize = size ?? context.size;

	return (
		<BaseTabs.Tab
			data-slot="tabs-tab"
			data-variant={resolvedVariant}
			data-size={resolvedSize}
			className={cn(tabVariants({ variant: resolvedVariant, size: resolvedSize }), className)}
			{...props}
		/>
	);
}

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Tabs = {
	Root,
	List,
	Tab,
	Panel,
	/** The moving highlight. One per `Tabs.List`. */
	Indicator,
};
