import { createContext, useContext } from 'react';

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
