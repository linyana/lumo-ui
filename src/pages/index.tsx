import type { ReactElement } from 'react';
import { AvatarPage } from './Avatar';
import { BadgePage } from './Badge';
import { ButtonPage } from './Button';
import { CardPage } from './Card';
import { CheckboxPage } from './Checkbox';
import { CodePage } from './Code';
import { CodeDiffPage } from './CodeDiff';
import { CodeTreePage } from './CodeTree';
import { CollapsiblePage } from './Collapsible';
import { ComboboxPage } from './Combobox';
import { DialogPage } from './Dialog';
import { DrawerPage } from './Drawer';
import { FieldPage } from './Field';
import { InputPage } from './Input';
import { InstallPage } from './Install';
import { LayoutPage } from './Layout';
import { MenuPage } from './Menu';
import { NavPage } from './Nav';
import { OverviewPage } from './Overview';
import { PopoverPage } from './Popover';
import { ProgressPage } from './Progress';
import { RadioGroupPage } from './RadioGroup';
import { ScrollAreaPage } from './ScrollArea';
import { SelectPage } from './Select';
import { SeparatorPage } from './Separator';
import { SkeletonPage } from './Skeleton';
import { SpinnerPage } from './Spinner';
import { StepsPage } from './Steps';
import { SwitchPage } from './Switch';
import { TablePage } from './Table';
import { TabsPage } from './Tabs';
import { TextareaPage } from './Textarea';
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
	{ path: 'install', label: 'Install', section: 'Getting Started', element: <InstallPage /> },
	{ path: 'overview', label: 'Overview', section: 'Getting Started', element: <OverviewPage /> },
	{ path: 'avatar', label: 'Avatar', section: 'Components', element: <AvatarPage /> },
	{ path: 'badge', label: 'Badge', section: 'Components', element: <BadgePage /> },
	{ path: 'button', label: 'Button', section: 'Components', element: <ButtonPage /> },
	{ path: 'card', label: 'Card', section: 'Components', element: <CardPage /> },
	{ path: 'checkbox', label: 'Checkbox', section: 'Components', element: <CheckboxPage /> },
	{ path: 'code', label: 'Code', section: 'Components', element: <CodePage /> },
	{ path: 'code-diff', label: 'CodeDiff', section: 'Components', element: <CodeDiffPage /> },
	{ path: 'code-tree', label: 'CodeTree', section: 'Components', element: <CodeTreePage /> },
	{
		path: 'collapsible',
		label: 'Collapsible',
		section: 'Components',
		element: <CollapsiblePage />,
	},
	{ path: 'combobox', label: 'Combobox', section: 'Components', element: <ComboboxPage /> },
	{ path: 'dialog', label: 'Dialog', section: 'Components', element: <DialogPage /> },
	{ path: 'drawer', label: 'Drawer', section: 'Components', element: <DrawerPage /> },
	{ path: 'field', label: 'Field', section: 'Components', element: <FieldPage /> },
	{ path: 'input', label: 'Input', section: 'Components', element: <InputPage /> },
	{ path: 'menu', label: 'Menu', section: 'Components', element: <MenuPage /> },
	{ path: 'nav', label: 'Nav', section: 'Components', element: <NavPage /> },
	{ path: 'popover', label: 'Popover', section: 'Components', element: <PopoverPage /> },
	{ path: 'progress', label: 'Progress', section: 'Components', element: <ProgressPage /> },
	{
		path: 'radio-group',
		label: 'RadioGroup',
		section: 'Components',
		element: <RadioGroupPage />,
	},
	{
		path: 'scroll-area',
		label: 'ScrollArea',
		section: 'Components',
		element: <ScrollAreaPage />,
	},
	{ path: 'select', label: 'Select', section: 'Components', element: <SelectPage /> },
	{ path: 'separator', label: 'Separator', section: 'Components', element: <SeparatorPage /> },
	{ path: 'skeleton', label: 'Skeleton', section: 'Components', element: <SkeletonPage /> },
	{ path: 'spinner', label: 'Spinner', section: 'Components', element: <SpinnerPage /> },
	{ path: 'steps', label: 'Steps', section: 'Components', element: <StepsPage /> },
	{ path: 'switch', label: 'Switch', section: 'Components', element: <SwitchPage /> },
	{ path: 'table', label: 'Table', section: 'Components', element: <TablePage /> },
	{ path: 'tabs', label: 'Tabs', section: 'Components', element: <TabsPage /> },
	{ path: 'textarea', label: 'Textarea', section: 'Components', element: <TextareaPage /> },
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
