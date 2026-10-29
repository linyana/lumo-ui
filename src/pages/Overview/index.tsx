import { ArrowUpRight, Search } from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/lumo/ui/Button';
import { Card } from '@/components/lumo/ui/Card';
import { Toast } from '@/components/lumo/ui/Toast';
import { Input } from '@/components/lumo/ui/Input';
import { cn } from '@/lib/cn';
import { DocPage } from '@/pages/DocPage';
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
import InputBasic from '@/pages/Input/demos/basic';
import MenuBasic from '@/pages/Menu/demos/basic';
import NavBasic from '@/pages/Nav/demos/basic';
import PopoverBasic from '@/pages/Popover/demos/basic';
import RadioGroupBasic from '@/pages/RadioGroup/demos/basic';
import ScrollAreaBasic from '@/pages/ScrollArea/demos/basic';
import SelectBasic from '@/pages/Select/demos/basic';
import SeparatorBasic from '@/pages/Separator/demos/basic';
import SkeletonBasic from '@/pages/Skeleton/demos/basic';
import SpinnerBasic from '@/pages/Spinner/demos/basic';
import StepsVertical from '@/pages/Steps/demos/vertical';
import SwitchBasic from '@/pages/Switch/demos/basic';
import TabsBasic from '@/pages/Tabs/demos/basic';
import TextareaBasic from '@/pages/Textarea/demos/basic';
import ToastKinds from '@/pages/Toast/demos/kinds';
import TooltipBasic from '@/pages/Tooltip/demos/basic';
import TransitionSize from '@/pages/Transition/demos/size';

type ComponentPreview = {
	/** The route, which the rail and the router already use. */
	path: string;
	label: string;
	/** The demo that page opens with, rendered as the card's thumbnail. */
	Demo: ComponentType;
};

type PreviewGroup = {
	/** What these have in common — the kind of work they do, not where their name sorts. */
	title: string;
	previews: ComponentPreview[];
};

/** Every component page, grouped by the part of an interface it belongs to. */
const groups: PreviewGroup[] = [
	{
		title: 'General',
		previews: [{ path: 'button', label: 'Button', Demo: ButtonBasic }],
	},
	{
		title: 'Navigation',
		previews: [
			{ path: 'menu', label: 'Menu', Demo: MenuBasic },
			{ path: 'nav', label: 'Nav', Demo: NavBasic },
			// The horizontal opener needs half a page before its connectors read as lines; the
			// vertical one is the demo a square can hold.
			{ path: 'steps', label: 'Steps', Demo: StepsVertical },
			{ path: 'tabs', label: 'Tabs', Demo: TabsBasic },
		],
	},
	{
		title: 'Data Entry',
		previews: [
			{ path: 'checkbox', label: 'Checkbox', Demo: CheckboxBasic },
			{ path: 'combobox', label: 'Combobox', Demo: ComboboxBasic },
			{ path: 'field', label: 'Field', Demo: FieldBasic },
			{ path: 'input', label: 'Input', Demo: InputBasic },
			{ path: 'radio-group', label: 'RadioGroup', Demo: RadioGroupBasic },
			{ path: 'select', label: 'Select', Demo: SelectBasic },
			{ path: 'switch', label: 'Switch', Demo: SwitchBasic },
			{ path: 'textarea', label: 'Textarea', Demo: TextareaBasic },
		],
	},
	{
		title: 'Data Display',
		previews: [
			{ path: 'card', label: 'Card', Demo: CardBasic },
			{ path: 'code', label: 'Code', Demo: CodeBasic },
			{ path: 'code-diff', label: 'CodeDiff', Demo: CodeDiffBasic },
			{ path: 'code-tree', label: 'CodeTree', Demo: CodeTreeBasic },
			{ path: 'collapsible', label: 'Collapsible', Demo: CollapsibleBasic },
			{ path: 'popover', label: 'Popover', Demo: PopoverBasic },
			{ path: 'tooltip', label: 'Tooltip', Demo: TooltipBasic },
		],
	},
	{
		title: 'Feedback',
		previews: [
			{ path: 'dialog', label: 'Dialog', Demo: DialogBasic },
			{ path: 'drawer', label: 'Drawer', Demo: DrawerBasic },
			{ path: 'skeleton', label: 'Skeleton', Demo: SkeletonBasic },
			{ path: 'spinner', label: 'Spinner', Demo: SpinnerBasic },
			{ path: 'toast', label: 'Toast', Demo: ToastKinds },
		],
	},
	{
		title: 'Other',
		previews: [
			{ path: 'scroll-area', label: 'ScrollArea', Demo: ScrollAreaBasic },
			{ path: 'separator', label: 'Separator', Demo: SeparatorBasic },
			{ path: 'transition', label: 'Transition', Demo: TransitionSize },
		],
	},
];

/** The arrow is the way in; the demo under it keeps its own interactions. */
function Preview({ path, label, Demo }: ComponentPreview) {
	return (
		<Card.Root
			data-slot="overview-card"
			hoverable
			// The tile is drawn edge to edge: the header band and the demo area bring their own
			// padding, so the card's own gap and vertical padding would only inset them twice.
			className="aspect-square gap-0 overflow-hidden py-0"
		>
			<div
				data-slot="overview-card-bar"
				className="flex shrink-0 items-center justify-between gap-2 py-1 pr-1 pl-3"
			>
				{/* The name is not the target — the arrow is — so it only answers the pointer with
				    its colour, the same step the card's own edge takes. */}
				<span
					className={cn(
						'truncate text-xs font-medium text-muted-foreground',
						'transition-colors duration-(--duration-state)',
						'group-hover/card:text-foreground',
					)}
				>
					{label}
				</span>
				<Button
					variant="ghost"
					size="icon"
					nativeButton={false}
					// A link, not a button: the tile navigates, and an anchor keeps the middle-click,
					// the context menu and the status bar the browser gives every link.
					render={<Link to={`/${path}`} />}
					aria-label={label}
					icon={<ArrowUpRight />}
					// Hidden until the tile is pointed at, but reachable before it is: a link that
					// could not be seen while it held focus would be a target with no target.
					className={cn(
						'size-7 text-muted-foreground',
						'opacity-0 transition-opacity duration-(--duration-state)',
						'group-hover/card:opacity-100 focus-visible:opacity-100',
					)}
				/>
			</div>
			{/*
				Nothing is scaled to fit: a transform here would hand `getBoundingClientRect` a size
				the demo never had, which is exactly what Transition measures. A demo taller than the
				square scrolls instead, so no part of it is out of reach.
			*/}
			<div
				className={cn(
					'min-h-0 flex-1 overflow-auto p-4',
					'[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
				)}
			>
				<div className="flex min-h-full flex-wrap items-center justify-center gap-2">
					<Demo />
				</div>
			</div>
		</Card.Root>
	);
}

export function OverviewPage() {
	const [query, setQuery] = useState('');
	const needle = query.trim().toLowerCase();
	const shown = groups
		.map((group) => ({
			title: group.title,
			previews: group.previews.filter(({ path, label }) =>
				`${label} ${path}`.toLowerCase().includes(needle),
			),
		}))
		.filter((group) => group.previews.length > 0);

	return (
		<DocPage wide title="overview" description="base ui behaviour + token-driven styling">
			{/* The toast demo reads its queue from context, and shows it in the fixed strip. */}
			<Toast.Provider>
				<div className="space-y-8">
					<div className="relative">
						<Search
							aria-hidden
							className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							type="text"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="filter components"
							aria-label="filter components"
							autoComplete="off"
							spellCheck={false}
							className="pl-9"
						/>
					</div>

					{shown.length === 0 ? (
						<p className="py-12 text-center text-sm text-muted-foreground">
							no component matches “{query.trim()}”.
						</p>
					) : (
						shown.map((group) => (
							<section key={group.title} className="space-y-3">
								<h2 className="text-sm font-medium text-muted-foreground">
									{group.title}
								</h2>
								{/* A floor on the width, so a demo keeps the room its layout asks for
								    and the row drops a column instead of squeezing every card. */}
								<div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
									{group.previews.map((preview) => (
										<Preview key={preview.path} {...preview} />
									))}
								</div>
							</section>
						))
					)}
				</div>
				<Toast.Toaster />
			</Toast.Provider>
		</DocPage>
	);
}
