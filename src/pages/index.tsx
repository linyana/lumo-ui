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

/**
 * One page per component, in the order the rail lists them: getting started first, then the
 * components alphabetically.
 */
export const docRoutes: DocRoute[] = [
	{ path: 'overview', label: 'Overview', element: <OverviewPage /> },
	{ path: 'layout', label: 'Layout', element: <LayoutPage /> },
	{ path: 'button', label: 'Button', element: <ButtonPage /> },
	{ path: 'collapsible', label: 'Collapsible', element: <CollapsiblePage /> },
	{ path: 'dialog', label: 'Dialog', element: <DialogPage /> },
	{ path: 'drawer', label: 'Drawer', element: <DrawerPage /> },
	{ path: 'dropdown', label: 'Dropdown', element: <DropdownPage /> },
	{ path: 'menu', label: 'Menu', element: <MenuPage /> },
	{ path: 'popover', label: 'Popover', element: <PopoverPage /> },
	{ path: 'separator', label: 'Separator', element: <SeparatorPage /> },
	{ path: 'spinner', label: 'Spinner', element: <SpinnerPage /> },
	{ path: 'tabs', label: 'Tabs', element: <TabsPage /> },
	{ path: 'tooltip', label: 'Tooltip', element: <TooltipPage /> },
];
