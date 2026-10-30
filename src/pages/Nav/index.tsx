import { Code } from '@/components/ui/code';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Basic from './demos/basic';
import Compact from './demos/compact';
import Loading from './demos/loading';

const files = ['src/components/ui/nav.tsx'];

const buttonProps: Record<string, PropNode> = {
	icon: {
		type: 'ReactNode',
		default: 'null',
		description:
			'Leading glyph, at the text’s own size. It is the only thing the compact nav keeps.',
	},
	label: {
		type: 'string',
		description:
			'The row’s text. Given it, the compact nav can stand in with its first letter when there is no icon, and the tooltip has something to say.',
	},
	href: {
		type: 'string',
		description:
			'Where the row goes. Given it the row is an anchor rather than a button — it navigates, opens in a new tab and can be copied from the context menu.',
	},
	render: {
		type: 'RenderProp',
		description:
			'Draws the row with an element of your own, such as a router’s link. The row still supplies the href, the active state and the classes.',
	},
	isActive: {
		type: 'boolean',
		default: 'false',
		description:
			'Marks the row as the page you are on. On a link of its own it also sets aria-current="page".',
	},
	variant: {
		type: '"default" | "outline"',
		default: '"default"',
		description:
			'Outline is for a row that is a control on its own — a button in the rail, not a page.',
	},
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description: '28 / 32 / 48 tall. The large one is for a rail’s primary rows.',
	},
	tooltip: {
		type: 'ReactNode',
		default: 'label',
		description:
			'Shown only while the nav is compact. false where something else already opens from the row, such as a nested popover.',
	},
	tooltipSide: {
		type: '"top" | "right" | "bottom" | "left"',
		default: '"right"',
		description: 'Which side the rail’s hint hangs on.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Half opacity and no pointer; a disabled link also leaves the tab order.',
	},
	onClick: {
		type: 'MouseEventHandler',
		description:
			'A row that does something rather than going somewhere, given no href and no render.',
	},
};

const subProps: Record<string, PropNode> = {
	label: {
		required: true,
		type: 'string',
		description: 'The row’s text, and the title of the popover once the nav is compact.',
	},
	children: {
		required: true,
		type: 'ReactNode',
		description: 'SubItem rows. The same ones serve the inline list and the compact popover.',
	},
	icon: {
		type: 'ReactNode',
		default: 'null',
		description: 'Leading glyph, as on any other row.',
	},
	isActive: {
		type: 'boolean',
		default: 'false',
		description:
			'Highlights the parent, so a group reads as current when one of its children is.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Whether the inline list starts expanded. Ignored once the nav is compact.',
	},
	popoverSide: {
		type: '"top" | "right" | "bottom" | "left"',
		default: '"right"',
		description: 'Which side the popover opens on while the nav is compact.',
	},
};

const skeletonProps: Record<string, PropNode> = {
	showIcon: {
		type: 'boolean',
		default: 'false',
		description: 'Draws the leading square as well, so the rail loads into its final shape.',
	},
	width: {
		type: 'string',
		default: '"70%"',
		description:
			'The bar’s width. Deterministic on purpose: a random width differs between server and client.',
	},
};

const actionProps: Record<string, PropNode> = {
	showOnHover: {
		type: 'boolean',
		default: 'false',
		description:
			'Keeps the action out of the way until its own row is hovered, or until it is reached by the keyboard. It is held back by pointer events as well as opacity, so the row underneath still takes the click — the action only takes the pointer once the row has handed it over.',
	},
};

const partRows = [
	[
		'Nav.Root',
		'the layout, and compact',
		'the one fact a nav has about its container: whether it is a rail.',
	],
	[
		'Nav.List',
		'a column of rows',
		'gap-1, no padding — the group around it decides the padding.',
	],
	['Nav.Group', 'a block of rows', 'p-2, and the box a group action is positioned against.'],
	[
		'Nav.GroupLabel',
		'its name',
		'collapses to nothing in the rail, but keeps its text in the DOM.',
	],
	[
		'Nav.GroupAction',
		'the group’s own button',
		'the “+” that belongs to the section, not to one row.',
	],
	['Nav.Item', 'one row’s box', 'what a badge and an action are positioned against.'],
	['Nav.Button', 'the row', 'a link with href, a button without it; either way the same look.'],
	['Nav.Action', 'a secondary action', 'rides on the row’s trailing edge, optional showOnHover.'],
	['Nav.Badge', 'a count or a state', 'decorative — the row has to say it too.'],
	[
		'Nav.Separator',
		'a line between groups',
		'inset, so it does not run into the rounded corners.',
	],
	[
		'Nav.Sub',
		'a row that owns rows',
		'expands inline, and opens a popover once the nav is compact.',
	],
	[
		'Nav.SubList · SubItem · SubButton',
		'the nested rows',
		'indented by a border, hidden in the rail.',
	],
	[
		'Nav.Skeleton',
		'a row while loading',
		'the same square as a real row, so nothing shifts when it lands.',
	],
];

const hookRows = [
	[
		'data-slot="nav-root"',
		'the nav',
		'group, and the scope every compact rule is written against.',
	],
	['data-compact', 'present in the rail', 'empty-valued, as Base UI writes its own flags.'],
	[
		'data-slot="nav-button"',
		'one row',
		'data-active on the current one, data-size for its height.',
	],
	[
		'data-active',
		'on the row',
		'the hover tint kept, the font weight up — and one more step of tint while the pointer is on it. A router’s link sets it through isActive.',
	],
	['aria-current="page"', 'on a current link', 'set by the row when it draws its own anchor.'],
	[
		'data-slot="nav-button-label"',
		'the row’s text',
		'w-0 in the rail, so the a11y name survives the collapse.',
	],
	[
		'data-slot="nav-button-initial"',
		'the first letter',
		'drawn only in the rail, and only without an icon.',
	],
	[
		'data-slot="nav-badge" · nav-action',
		'the trailing edge',
		'hidden in the rail, where there is no room for either.',
	],
	[
		'group-data-[compact]',
		'the rail, as a selector',
		'one attribute on the root drives every part into its shape.',
	],
];

const usageImport = "import { Nav } from '@/components/ui/nav';";
const usageExample = `<Nav.Root compact={folded}>
	<Nav.Group>
		<Nav.GroupLabel>workspace</Nav.GroupLabel>
		<Nav.List>
			<Nav.Item>
				<Nav.Button icon={<Folder />} label="projects" render={<NavLink to="/projects" />} />
			</Nav.Item>
		</Nav.List>
	</Nav.Group>
</Nav.Root>`;

export function NavPage() {
	return (
		<DocPage title="nav" description="navigation rows: groups, icons, badges and sub rows">
			<DocPreview path="src/pages/Nav/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file that reaches for four others: <Mono>Collapsible</Mono> for a sub
						row that expands, <Mono>Popover</Mono> for the same row once there is no
						room, plus <Mono>Tooltip</Mono> for the rail and <Mono>Skeleton</Mono> for
						the loading rows.
					</>
				}
			>
				<DocInstall
					name="nav"
					files={files}
					reaches={[
						'src/components/ui/collapsible.tsx',
						'src/components/ui/popover.tsx',
						'src/components/ui/tooltip.tsx',
						'src/components/ui/separator.tsx',
						'src/components/ui/skeleton.tsx',
						'src/components/ui/transition.tsx',
						'src/lib/motion.ts',
						'src/lib/measure.ts',
						'src/lib/utils.ts',
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the nav knows nothing about the shell it sits in. it takes rows, draws them,
						and reports a selection; the shell decides what a selection means.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a row is a link or a button"
				note={
					<>
						a row that goes somewhere is an anchor, not a button with an anchor inside —
						Base UI’s button would put <Mono>role=&quot;button&quot;</Mono> on the
						anchor and take the link’s own semantics away. <Mono>render</Mono> hands the
						row to a router’s link, which keeps the navigation and sets its own{' '}
						<Mono>aria-current</Mono>.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					with no <Mono>href</Mono> and no <Mono>render</Mono> the row is a button, and{' '}
					<Mono>onClick</Mono> is what it does. the difference is one prop, and the
					appearance is the same on both.
				</p>
			</DocSection>

			<DocSection
				title="the compact rail"
				note={
					<>
						<Mono>compact</Mono> is the whole of what the nav knows about its width:
						rows keep one glyph, labels and badges go, and a row with children opens
						them in a popover instead of expanding into room that is not there.
					</>
				}
			>
				<DocPreview path="src/pages/Nav/demos/compact.tsx">
					<Compact />
				</DocPreview>
			</DocSection>

			<DocSection
				title="while it loads"
				note="a skeleton row is the height and shape of a real one, so the nav does not move when the navigation lands."
			>
				<DocPreview path="src/pages/Nav/demos/loading.tsx">
					<Loading />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the row is where the props are; the rest are boxes with an opinion about layout."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Nav.Button</Mono> — one row
						</p>
						<PropTable props={buttonProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Nav.Sub</Mono> — a row that owns rows
						</p>
						<PropTable props={subProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Nav.Skeleton</Mono> — a row while loading
						</p>
						<PropTable props={skeletonProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Nav.Action</Mono> — a secondary action
						</p>
						<PropTable props={actionProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="one attribute on the root is what every compact rule is written against, so nothing is passed down by hand."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
