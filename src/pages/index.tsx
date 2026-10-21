import type { ReactElement } from 'react';
import { ButtonPage } from './Button';
import { CardPage } from './Card';
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
import { ScrollAreaPage } from './ScrollArea';
import { SeparatorPage } from './Separator';
import { SpinnerPage } from './Spinner';
import { StepsPage } from './Steps';
import { TabsPage } from './Tabs';
import { ToastPage } from './Toast';
import { TooltipPage } from './Tooltip';
import { TransitionPage } from './Transition';

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
	{ path: 'card', label: 'Card', section: 'Components', element: <CardPage /> },
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
	{
		path: 'scroll-area',
		label: 'ScrollArea',
		section: 'Components',
		element: <ScrollAreaPage />,
	},
	{ path: 'separator', label: 'Separator', section: 'Components', element: <SeparatorPage /> },
	{ path: 'spinner', label: 'Spinner', section: 'Components', element: <SpinnerPage /> },
	{ path: 'steps', label: 'Steps', section: 'Components', element: <StepsPage /> },
	{ path: 'tabs', label: 'Tabs', section: 'Components', element: <TabsPage /> },
	{ path: 'toast', label: 'Toast', section: 'Components', element: <ToastPage /> },
	{ path: 'tooltip', label: 'Tooltip', section: 'Components', element: <TooltipPage /> },
	{
		path: 'transition',
		label: 'Transition',
		section: 'Components',
		element: <TransitionPage />,
	},
	{ path: 'layout', label: 'Layout', section: 'Blocks', element: <LayoutPage /> },
];
