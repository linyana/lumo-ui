import type { ComponentType } from 'react';
import AccordionBasic from '@/pages/Accordion/demos/basic';
import AlertDialogBasic from '@/pages/AlertDialog/demos/basic';
import AvatarBasic from '@/pages/Avatar/demos/basic';
import BadgeBasic from '@/pages/Badge/demos/basic';
import ButtonBasic from '@/pages/Button/demos/basic';
import CardBasic from '@/pages/Card/demos/basic';
import CheckboxBasic from '@/pages/Checkbox/demos/basic';
import CodeBasic from '@/pages/Code/demos/basic';
import CodeDiffBasic from '@/pages/CodeDiff/demos/basic';
import CodeTreeBasic from '@/pages/CodeTree/demos/basic';
import CollapsibleBasic from '@/pages/Collapsible/demos/basic';
import ComboboxBasic from '@/pages/Combobox/demos/basic';
import DialogBasic from '@/pages/Dialog/demos/basic';
import DrawerBasic from '@/pages/Drawer/demos/basic';
import FieldBasic from '@/pages/Field/demos/basic';
import FieldsetBasic from '@/pages/Fieldset/demos/basic';
import FormBasic from '@/pages/Form/demos/basic';
import HoverCardBasic from '@/pages/HoverCard/demos/basic';
import InputBasic from '@/pages/Input/demos/basic';
import LayoutResponsive from '@/pages/Layout/demos/responsive';
import MenuBasic from '@/pages/Menu/demos/basic';
import NavBasic from '@/pages/Nav/demos/basic';
import PaginationBasic from '@/pages/Pagination/demos/basic';
import PopoverBasic from '@/pages/Popover/demos/basic';
import ProgressBasic from '@/pages/Progress/demos/basic';
import RadioGroupBasic from '@/pages/RadioGroup/demos/basic';
import ScrollAreaBasic from '@/pages/ScrollArea/demos/basic';
import SelectBasic from '@/pages/Select/demos/basic';
import SeparatorBasic from '@/pages/Separator/demos/basic';
import SkeletonBasic from '@/pages/Skeleton/demos/basic';
import SliderBasic from '@/pages/Slider/demos/basic';
import SpinnerBasic from '@/pages/Spinner/demos/basic';
import StepsVertical from '@/pages/Steps/demos/vertical';
import SwitchBasic from '@/pages/Switch/demos/basic';
import TableBasic from '@/pages/Table/demos/basic';
import TabsBasic from '@/pages/Tabs/demos/basic';
import TextareaBasic from '@/pages/Textarea/demos/basic';
import ToastKinds from '@/pages/Toast/demos/kinds';
import ToggleBasic from '@/pages/Toggle/demos/basic';
import ToggleGroupBasic from '@/pages/ToggleGroup/demos/basic';
import TooltipBasic from '@/pages/Tooltip/demos/basic';
import TransitionSize from '@/pages/Transition/demos/size';

/**
 * How much of the column a tile takes. It is not a look: a demo that lays out a list or a pane needs
 * the height before its own layout reads, and one that is a row of buttons would only be padding.
 */
export type Room = 'compact' | 'regular' | 'tall' | 'xtall';

export type ComponentPreview = {
	/** The route, which the rail and the router already use. */
	path: string;
	label: string;
	/** The demo that page opens with, rendered as the card's thumbnail. */
	Demo: ComponentType;
	/** Defaults to `regular`. */
	room?: Room;
};

type PreviewGroup = {
	/** What these have in common — the kind of work they do, not where their name sorts. */
	title: string;
	previews: ComponentPreview[];
};

/** Every component page, grouped by the part of an interface it belongs to. */
export const previewGroups: PreviewGroup[] = [
	{
		title: 'General',
		previews: [{ path: 'button', label: 'Button', Demo: ButtonBasic, room: 'compact' }],
	},
	{
		title: 'Navigation',
		previews: [
			{ path: 'menu', label: 'Menu', Demo: MenuBasic },
			// The rail is a list from its first group to its last: it takes the one step above `tall`,
			// so neither end of it is cut.
			{ path: 'nav', label: 'Nav', Demo: NavBasic, room: 'xtall' },
			{ path: 'pagination', label: 'Pagination', Demo: PaginationBasic, room: 'compact' },
			{ path: 'steps', label: 'Steps', Demo: StepsVertical, room: 'tall' },
			{ path: 'tabs', label: 'Tabs', Demo: TabsBasic, room: 'compact' },
		],
	},
	{
		title: 'Data Entry',
		previews: [
			{ path: 'checkbox', label: 'Checkbox', Demo: CheckboxBasic, room: 'compact' },
			{ path: 'combobox', label: 'Combobox', Demo: ComboboxBasic, room: 'compact' },
			{ path: 'field', label: 'Field', Demo: FieldBasic },
			{ path: 'fieldset', label: 'Fieldset', Demo: FieldsetBasic },
			{ path: 'form', label: 'Form', Demo: FormBasic },
			{ path: 'input', label: 'Input', Demo: InputBasic, room: 'compact' },
			{ path: 'radio-group', label: 'RadioGroup', Demo: RadioGroupBasic },
			{ path: 'select', label: 'Select', Demo: SelectBasic, room: 'compact' },
			{ path: 'slider', label: 'Slider', Demo: SliderBasic, room: 'compact' },
			{ path: 'switch', label: 'Switch', Demo: SwitchBasic, room: 'compact' },
			{ path: 'textarea', label: 'Textarea', Demo: TextareaBasic, room: 'tall' },
			{ path: 'toggle', label: 'Toggle', Demo: ToggleBasic, room: 'compact' },
			{ path: 'toggle-group', label: 'ToggleGroup', Demo: ToggleGroupBasic, room: 'compact' },
		],
	},
	{
		title: 'Data Display',
		previews: [
			// An answer is a paragraph, not a line: the compact tile would hold this demo and leave nothing
			// around it.
			{ path: 'accordion', label: 'Accordion', Demo: AccordionBasic },
			{ path: 'avatar', label: 'Avatar', Demo: AvatarBasic, room: 'compact' },
			{ path: 'badge', label: 'Badge', Demo: BadgeBasic, room: 'compact' },
			{ path: 'card', label: 'Card', Demo: CardBasic, room: 'tall' },
			{ path: 'code', label: 'Code', Demo: CodeBasic, room: 'tall' },
			{ path: 'code-diff', label: 'CodeDiff', Demo: CodeDiffBasic, room: 'tall' },
			{ path: 'code-tree', label: 'CodeTree', Demo: CodeTreeBasic, room: 'tall' },
			{ path: 'collapsible', label: 'Collapsible', Demo: CollapsibleBasic, room: 'compact' },
			{ path: 'table', label: 'Table', Demo: TableBasic },
			{ path: 'hover-card', label: 'HoverCard', Demo: HoverCardBasic, room: 'compact' },
			{ path: 'popover', label: 'Popover', Demo: PopoverBasic, room: 'compact' },
			{ path: 'tooltip', label: 'Tooltip', Demo: TooltipBasic, room: 'compact' },
		],
	},
	{
		title: 'Feedback',
		previews: [
			{ path: 'dialog', label: 'Dialog', Demo: DialogBasic, room: 'compact' },
			{ path: 'alert-dialog', label: 'AlertDialog', Demo: AlertDialogBasic, room: 'compact' },
			{ path: 'drawer', label: 'Drawer', Demo: DrawerBasic, room: 'compact' },
			{ path: 'progress', label: 'Progress', Demo: ProgressBasic, room: 'compact' },
			{ path: 'skeleton', label: 'Skeleton', Demo: SkeletonBasic, room: 'compact' },
			{ path: 'spinner', label: 'Spinner', Demo: SpinnerBasic, room: 'compact' },
			{ path: 'toast', label: 'Toast', Demo: ToastKinds },
		],
	},
	{
		title: 'Other',
		previews: [
			{ path: 'scroll-area', label: 'ScrollArea', Demo: ScrollAreaBasic, room: 'tall' },
			{ path: 'separator', label: 'Separator', Demo: SeparatorBasic, room: 'compact' },
			{ path: 'transition', label: 'Transition', Demo: TransitionSize, room: 'tall' },
		],
	},
];

export const componentPreviews = new Map<string, ComponentPreview>([
	...previewGroups.flatMap(({ previews }) =>
		previews.map((preview) => [preview.path, preview] as const),
	),
	['layout', { path: 'layout', label: 'Layout', Demo: LayoutResponsive }],
]);
