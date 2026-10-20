import { Indicator, indicatorVariants } from './Indicator';
import { List, listVariants } from './List';
import { Panel } from './Panel';
import { Root } from './Root';
import { Tab, tabVariants } from './Tab';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Tabs = {
	Root,
	List,
	Tab,
	Panel,
	/** The moving highlight. One per `Tabs.List`. */
	Indicator,
};

export { indicatorVariants, listVariants, tabVariants };
export { useTabs } from './context';
export type { TabsContextValue, TabsSize, TabsVariant } from './context';
