import { ArrowUpRight, Search } from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/lumo/ui/Button';
import { Card } from '@/components/lumo/ui/Card';
import { Input } from '@/components/lumo/ui/Input';
import { Toast } from '@/components/lumo/ui/Toast';
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

/**
 * How much of the column a tile takes. It is not a look: a demo that lays out a list or a pane needs
 * the height before its own layout reads, and one that is a row of buttons would only be padding.
 */
type Room = 'compact' | 'regular' | 'tall' | 'xtall';

type ComponentPreview = {
	/** The route, which the rail and the router already use. */
	path: string;
	label: string;
	/** The demo that page opens with, rendered as the card's thumbnail. */
	Demo: ComponentType;
	/** Defaults to `regular`. */
	room?: Room;
	/** The surface the demo needs under it, when the tile's own grey would swallow it. */
	canvas?: 'page';
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
		previews: [{ path: 'button', label: 'Button', Demo: ButtonBasic, room: 'compact' }],
	},
	{
		title: 'Navigation',
		previews: [
			{ path: 'menu', label: 'Menu', Demo: MenuBasic },
			// The rail is a list from its first group to its last: it takes the one step above `tall`,
			// so neither end of it is cut.
			{ path: 'nav', label: 'Nav', Demo: NavBasic, room: 'xtall' },
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
			{ path: 'input', label: 'Input', Demo: InputBasic, room: 'compact' },
			{ path: 'radio-group', label: 'RadioGroup', Demo: RadioGroupBasic },
			{ path: 'select', label: 'Select', Demo: SelectBasic, room: 'compact' },
			{ path: 'switch', label: 'Switch', Demo: SwitchBasic, room: 'compact' },
			{ path: 'textarea', label: 'Textarea', Demo: TextareaBasic, room: 'tall' },
		],
	},
	{
		title: 'Data Display',
		previews: [
			{ path: 'card', label: 'Card', Demo: CardBasic, room: 'tall' },
			{ path: 'code', label: 'Code', Demo: CodeBasic, room: 'tall' },
			{ path: 'code-diff', label: 'CodeDiff', Demo: CodeDiffBasic, room: 'tall' },
			{ path: 'code-tree', label: 'CodeTree', Demo: CodeTreeBasic, room: 'tall' },
			{ path: 'collapsible', label: 'Collapsible', Demo: CollapsibleBasic, room: 'compact' },
			{ path: 'popover', label: 'Popover', Demo: PopoverBasic, room: 'compact' },
			{ path: 'tooltip', label: 'Tooltip', Demo: TooltipBasic, room: 'compact' },
		],
	},
	{
		title: 'Feedback',
		previews: [
			{ path: 'dialog', label: 'Dialog', Demo: DialogBasic, room: 'compact' },
			{ path: 'drawer', label: 'Drawer', Demo: DrawerBasic, room: 'compact' },
			{
				path: 'skeleton',
				label: 'Skeleton',
				Demo: SkeletonBasic,
				room: 'compact',
				canvas: 'page',
			},
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

const rooms: Record<Room, string> = {
	compact: 'h-52',
	regular: 'h-72',
	tall: 'h-96',
	// One demo is a whole rail rather than a row or a panel, and is the only one that outgrows
	// `tall`: the list is not cut at either end.
	xtall: 'h-116',
};

type PreviewProps = ComponentPreview;

/**
 * One tile: the demo, and one white pill over it that names the component and is the way in. The
 * pill appears when the tile is pointed at or reached by keyboard — the demo under it keeps its own
 * interactions, so the tile itself is not a link.
 */
function Preview({ path, label, Demo, room = 'regular', canvas }: PreviewProps) {
	return (
		<Card.Root
			data-slot="overview-card"
			// Drawn as a fill rather than as a frame: the demo inside is a surface of its own, and a
			// card that outlined it would put two edges around one thing. It does not answer the
			// pointer with a lift of its own either — the pill arriving is the whole reply.
			className={cn(
				'group/tile relative mb-4 break-inside-avoid gap-0 overflow-hidden rounded-2xl border-0 bg-muted py-0 shadow-none',
				rooms[room],
			)}
		>
			{/*
				Nothing is scaled to fit: a transform here would hand `getBoundingClientRect` a size
				the demo never had, which is exactly what Transition measures. A demo taller than the
				tile scrolls instead, so no part of it is out of reach.
			*/}
			<div
				className={cn(
					'min-h-0 flex-1 overflow-auto p-5',
					'[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
					// A demo drawn in the muted fill would vanish into the tile, so the one that is gets a
					// panel of the page inset into it instead — a screenshot inside a frame.
					canvas === 'page' && 'm-3 rounded-xl bg-background',
				)}
			>
				<div className="flex min-h-full flex-wrap items-center justify-center gap-2">
					<Demo />
				</div>
			</div>
			<div data-slot="overview-card-open" className="absolute end-3 top-3 flex items-center">
				<Button
					size="sm"
					variant="secondary"
					nativeButton={false}
					// A link, not a button: the tile navigates, and an anchor keeps the middle-click,
					// the context menu and the status bar the browser gives every link.
					render={<Link to={`/${path}`} />}
					aria-label={label}
					icon={<ArrowUpRight />}
					// Hidden until the tile is pointed at, but reachable before it is: a link that
					// could not be seen while it held focus would be a target with no target.
					className={cn(
						'rounded-full bg-background px-3 text-muted-foreground',
						// The pill drops into its corner out of the edge it belongs to, so the tile answers
						// the pointer with motion rather than with a change in its own fill.
						'-translate-y-1 scale-95 opacity-0',
						'transition-[color,opacity,translate,scale] ease-(--ease-spring) duration-(--duration-turn)',
						'group-hover/tile:translate-y-0 group-hover/tile:scale-100 group-hover/tile:opacity-100',
						'focus-visible:translate-y-0 focus-visible:scale-100 focus-visible:opacity-100',
						// The fill is the tile's opposite and stays that way under the pointer. What moves
						// is the ink: the name and the arrow deepen to the foreground.
						'hover:text-foreground after:hidden',
					)}
				>
					{label}
				</Button>
			</div>
		</Card.Root>
	);
}

/** One entry of the filter row: a group, or everything. */
function FilterChip({
	active,
	onSelect,
	children,
}: {
	active: boolean;
	onSelect: () => void;
	children: string;
}) {
	return (
		<Button
			size="lg"
			variant={active ? 'default' : 'secondary'}
			aria-pressed={active}
			onClick={onSelect}
			className="rounded-full px-4 text-sm"
		>
			{children}
		</Button>
	);
}

export function OverviewPage() {
	const [query, setQuery] = useState('');
	const [active, setActive] = useState<string>('all');
	const needle = query.trim().toLowerCase();
	const shown = groups
		.filter((group) => active === 'all' || group.title === active)
		.flatMap((group) =>
			group.previews.filter(({ path, label }) =>
				`${label} ${path}`.toLowerCase().includes(needle),
			),
		);

	return (
		<DocPage wide title="overview" description="base ui behaviour + token-driven styling">
			{/* The toast demo reads its queue from context, and shows it in the fixed strip. */}
			<Toast.Provider>
				<div className="space-y-6">
					{/* The filter stays put: the column it filters is longer than the screen. */}
					<div
						data-slot="overview-filter"
						className={cn(
							'sticky top-0 z-10 -mx-8 flex flex-wrap items-center gap-2',
							'bg-background/90 px-8 py-3 backdrop-blur',
						)}
					>
						<FilterChip active={active === 'all'} onSelect={() => setActive('all')}>
							All
						</FilterChip>
						{groups.map((group) => (
							<FilterChip
								key={group.title}
								active={active === group.title}
								onSelect={() => setActive(group.title)}
							>
								{group.title}
							</FilterChip>
						))}
						<div className="relative ms-auto">
							<Search
								aria-hidden
								className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								type="text"
								size="lg"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="filter components"
								aria-label="filter components"
								autoComplete="off"
								spellCheck={false}
								className="w-full rounded-full ps-10 sm:w-64"
							/>
						</div>
					</div>

					{shown.length === 0 ? (
						<div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
							<p>no component matches “{query.trim() || active}”.</p>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => {
									setQuery('');
									setActive('all');
								}}
							>
								clear filters
							</Button>
						</div>
					) : (
						/* Columns, not a grid: a tile keeps its own height and the next one starts right
						   under it, which is what makes the column read as one run down the page. */
						<div
							data-slot="overview-columns"
							className="columns-1 gap-4 md:columns-2 xl:columns-3"
						>
							{shown.map((preview) => (
								<Preview {...preview} key={preview.path} />
							))}
						</div>
					)}
				</div>
				<Toast.Toaster />
			</Toast.Provider>
		</DocPage>
	);
}
