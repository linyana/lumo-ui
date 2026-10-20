import type { ReactElement } from 'react';
import { ButtonPage } from './Button';
import { CodePage } from './Code';
import { CodeDiffPage } from './CodeDiff';
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

/** Rail sections, top to bottom: the intro, the primitives, then the shell. */
export const docSections = ['Getting Started', 'Components', 'Blocks'] as const;
export type DocSection = (typeof docSections)[number];

export type DocRoute = {
	path: string;
	label: string;
	section: DocSection;
	element: ReactElement;
};

/** One page per component, in the order the rail lists them: a section, then alphabetical. */
export const docRoutes: DocRoute[] = [
	{ path: 'overview', label: 'Overview', section: 'Getting Started', element: <OverviewPage /> },
	{ path: 'button', label: 'Button', section: 'Components', element: <ButtonPage /> },
	{ path: 'code', label: 'Code', section: 'Components', element: <CodePage /> },
	{ path: 'code-diff', label: 'CodeDiff', section: 'Components', element: <CodeDiffPage /> },
	{
		path: 'collapsible',
		label: 'Collapsible',
		section: 'Components',
		element: <CollapsiblePage />,
	},
	{ path: 'dialog', label: 'Dialog', section: 'Components', element: <DialogPage /> },
	{ path: 'drawer', label: 'Drawer', section: 'Components', element: <DrawerPage /> },
	{ path: 'dropdown', label: 'Dropdown', section: 'Components', element: <DropdownPage /> },
	{ path: 'menu', label: 'Menu', section: 'Components', element: <MenuPage /> },
	{ path: 'popover', label: 'Popover', section: 'Components', element: <PopoverPage /> },
	{ path: 'separator', label: 'Separator', section: 'Components', element: <SeparatorPage /> },
	{ path: 'spinner', label: 'Spinner', section: 'Components', element: <SpinnerPage /> },
	{ path: 'tabs', label: 'Tabs', section: 'Components', element: <TabsPage /> },
	{ path: 'tooltip', label: 'Tooltip', section: 'Components', element: <TooltipPage /> },
	{ path: 'layout', label: 'Layout', section: 'Blocks', element: <LayoutPage /> },
];
