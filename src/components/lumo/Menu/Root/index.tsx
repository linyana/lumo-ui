import { useMemo, type ComponentProps } from 'react';
import { MenuContext } from '@/components/lumo/Menu/context';
import { cn } from '@/lib/cn';

export type RootProps = ComponentProps<'div'> & {
	/** Collapse to one glyph per row. The menu needs nothing else to know how wide it is. */
	compact?: boolean;
};

/**
 * Holds the list's layout, and the one fact a menu has about its container: whether it is a rail.
 * Everything else — width, position, scrolling, whether it lives in a drawer — belongs outside.
 */
export function Root({ compact = false, className, children, ...props }: RootProps) {
	const value = useMemo(() => ({ compact }), [compact]);

	return (
		<MenuContext.Provider value={value}>
			<div
				data-slot="menu-root"
				data-compact={compact ? '' : undefined}
				className={cn('group flex w-full min-w-0 flex-col gap-1', className)}
				{...props}
			>
				{children}
			</div>
		</MenuContext.Provider>
	);
}
