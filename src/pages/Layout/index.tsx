import { Code } from '@/components/lumo/ui/Code';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocPage,
	DocSection,
	DocTable,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';

const files = [
	'src/components/lumo/blocks/Layout/index.tsx',
	'src/components/lumo/blocks/Layout/types.ts',
	'src/components/lumo/blocks/Layout/Header/index.tsx',
	'src/components/lumo/blocks/Layout/Content/index.tsx',
	'src/components/lumo/blocks/Layout/Sidebar/index.tsx',
];

const layoutProps: Record<string, PropNode> = {
	menu: {
		type: 'LayoutMenuEntry[]',
		description:
			'Rows, groups, separators and skeletons, in the order the rail draws them. Every row carries its own key, and its own href if it goes somewhere.',
	},
	selectedKey: {
		type: 'string',
		description: 'The row that is the page you are on. A row can also set isActive itself.',
	},
	onSelect: {
		type: '(key: string) => void',
		description: 'What a row did. The shell reports it and decides nothing further.',
	},
	variant: {
		type: '"default" | "plain"',
		default: '"default"',
		description:
			'Default insets the surface as a card on every edge; plain lets the content be the page.',
	},
	logo: {
		type: 'ReactNode',
		description: 'The brand mark in the rail’s top-left, sized to its text.',
	},
	title: {
		type: 'ReactNode',
		description:
			'The product’s name beside the mark — not a page title, which belongs to the page.',
	},
	footer: {
		type: 'ReactNode',
		description: 'Pinned to the rail’s bottom edge: an account row, a version, a status.',
	},
	collapsible: {
		type: 'boolean',
		default: 'false',
		description:
			'Lets the rail narrow to its icons. The brand row carries the toggle, and cmd/ctrl+b does the same.',
	},
	collapsed: {
		type: 'boolean',
		description:
			'Controlled; pass onCollapsedChange to keep it. Where it is stored is the app’s business.',
	},
	defaultCollapsed: {
		type: 'boolean',
		default: 'false',
		description: 'The uncontrolled starting point.',
	},
	onCollapsedChange: {
		type: '(collapsed: boolean) => void',
		description: 'Fires on the toggle and on the shortcut.',
	},
	resetScrollKey: {
		type: 'string',
		description:
			'Scrolls the surface back to the top whenever this changes — a route’s path, most of the time. The shell owns the box that scrolls, so the shell is what puts it back; a page has no way to.',
	},
};

const headerProps: Record<string, PropNode> = {
	title: {
		type: 'ReactNode',
		description: 'The page’s own name. A page draws this itself — the shell never holds one.',
	},
	description: {
		type: 'ReactNode',
		description: 'A line under the name, muted and truncated with it.',
	},
	actions: {
		type: 'ReactNode',
		description: 'Trailing controls, pushed to the far edge.',
	},
};

const partRows = [
	['Layout', 'the shell', 'the rail, the scroll container and the surface above it.'],
	[
		'Layout.Header',
		'the page’s own bar',
		'sticky, border-b, bg-inherit — so a page can drop it anywhere in its content.',
	],
	[
		'Layout.Content',
		'a padded block',
		'the surface a page scrolls in already scrolls; this is padding.',
	],
	[
		'Layout.Sidebar',
		'the rail',
		'assembled from menu, which is why a shell needs no markup for it.',
	],
];

const hookRows = [
	[
		'data-slot="layout"',
		'the shell',
		'h-svh, overflow-hidden, bg-muted — one token paints the rail and the gap.',
	],
	['data-variant', 'default | plain', 'on the shell; the surface’s inset and fill follow it.'],
	[
		'data-slot="layout-surface"',
		'the scroll container',
		'overflow-y-auto, and the element a page’s sticky header sticks inside.',
	],
	[
		'data-slot="layout-header"',
		'a page bar',
		'sticky top-0, bg-inherit, so it takes the surface’s colour rather than its own.',
	],
	['data-slot="layout-sidebar"', 'the rail', 'holds the brand row, the menu and the footer.'],
	['data-collapsed', 'present while narrow', 'on the shell, and read by the rail’s own parts.'],
];

const usageImport = "import { Layout } from '@/components/lumo/blocks/Layout';";
const usageExample = `<Layout menu={menu} selectedKey={key} onSelect={setKey} logo={<Logo />} title="lumo">
	<Layout.Header title="projects" description="4 of them" actions={<Button size="sm">new</Button>} />
	<Layout.Content>{page}</Layout.Content>
</Layout>`;

export function LayoutPage() {
	return (
		<DocPage title="layout" description="the shell: a rail, and the surface a page scrolls in">
			<DocSection
				title="installation"
				note={
					<>
						the one block here: five files, because the rail is a composition rather
						than a primitive. it is also the only component in the library that is not a
						wrapper around Base UI — a shell has no behaviour of its own to borrow.
					</>
				}
			>
				<DocInstall
					name="layout"
					packages={['tailwind-variants']}
					files={files}
					reachesNote={
						<>
							the rail is drawn by <Mono>Menu</Mono>, scrolls inside{' '}
							<Mono>ScrollArea</Mono> and collapses from a <Mono>Button</Mono> — and
							those reach for five more. the command takes the whole chain; by hand,
							start with these three.
						</>
					}
					reaches={[
						'src/components/lumo/ui/Button.tsx',
						'src/components/lumo/ui/Menu.tsx',
						'src/components/lumo/ui/ScrollArea.tsx',
						'src/lib/cn.ts',
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						one element, and the rail is drawn from data — a shell needs no markup of
						its own for it. everything inside is the page’s, header included.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="the shell around this page"
				note={
					<>
						what you are reading in is the <Mono>default</Mono> variant of this
						component. the shell reports the fold; where it is remembered is the app’s
						business, so this app writes a cookie and Layout never does.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					one <Mono>menu</Mono> array draws the rail. each row carries its own{' '}
					<Mono>href</Mono> and is handed to <Mono>react-router</Mono> through{' '}
					<Mono>render</Mono>, so the shell never imports a router and still navigates
					without a reload.
				</p>
			</DocSection>

			<DocSection
				title="variants"
				note={
					<>
						<Mono>default</Mono> insets the surface as a card on every edge;{' '}
						<Mono>plain</Mono> lets the content be the page. the surface, not the rail,
						is what changes.
					</>
				}
			>
				<div className="grid gap-3 md:grid-cols-2">
					<div className="rounded-xl border bg-card p-4 text-sm text-card-foreground">
						<div className="text-xs text-muted-foreground">variant=default</div>
						<div className="pt-1">a card inset on every edge</div>
					</div>
					<div className="rounded-xl border bg-background p-4 text-sm">
						<div className="text-xs text-muted-foreground">variant=plain</div>
						<div className="pt-1">the page is the surface</div>
					</div>
				</div>
			</DocSection>

			<DocSection
				title="the header belongs to the page"
				note={
					<>
						the bar above this text is written by this page, not by the shell. it sticks
						to the top of the scroll container and carries that container’s own fill, so
						a page can drop it anywhere in its content and still keep it in place.
					</>
				}
			>
				<PropTable props={headerProps} />
			</DocSection>

			<DocSection
				title="api reference"
				note="what a shell knows: a variant, a menu, a selection — and a page’s parts hanging off the same name."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Layout</Mono> — the shell
						</p>
						<PropTable props={layoutProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the surface is the scroll container, which is why a page’s sticky header sticks inside it and not to the window."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
