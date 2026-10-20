import type { ReactElement } from 'react';
import { ButtonPage } from './Button';
import { CollapsiblePage } from './Collapsible';
import { DialogPage } from './Dialog';
import { DrawerPage } from './Drawer';
import { DropdownPage } from './Dropdown';
import { LayoutPage } from './Layout';
import { MenuPage } from './Menu';
import { OverviewPage } from './Overview';
import { PopoverPage } from './Popover';
import { SeparatorPage } from './Separator';
import { SpinnerPage } from './Spinner';
import { TabsPage } from './Tabs';
import { TooltipPage } from './Tooltip';

export type DocRoute = { path: string; label: string; element: ReactElement };

/** One page per component, in the order the rail lists them. */
export const docRoutes: DocRoute[] = [
	{ path: 'overview', label: 'overview', element: <OverviewPage /> },
	{ path: 'layout', label: 'layout', element: <LayoutPage /> },
	{ path: 'button', label: 'button', element: <ButtonPage /> },
	{ path: 'spinner', label: 'spinner', element: <SpinnerPage /> },
	{ path: 'tooltip', label: 'tooltip', element: <TooltipPage /> },
	{ path: 'collapsible', label: 'collapsible', element: <CollapsiblePage /> },
	{ path: 'popover', label: 'popover', element: <PopoverPage /> },
	{ path: 'dialog', label: 'dialog', element: <DialogPage /> },
	{ path: 'drawer', label: 'drawer', element: <DrawerPage /> },
	{ path: 'separator', label: 'separator', element: <SeparatorPage /> },
	{ path: 'tabs', label: 'tabs', element: <TabsPage /> },
	{ path: 'dropdown', label: 'dropdown', element: <DropdownPage /> },
	{ path: 'menu', label: 'menu', element: <MenuPage /> },
];
