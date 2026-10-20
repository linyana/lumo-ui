import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { useTabs } from '@/components/lumo/ui/Tabs/context';
import { cn } from '@/lib/cn';

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
