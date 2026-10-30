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
import Collapsed from './demos/collapsed';
import Primary from './demos/primary';

const files = [
	'src/components/blocks/code-tree/index.tsx',
	'src/components/blocks/code-tree/tree.ts',
	'src/components/blocks/code-tree/glyph.tsx',
];

const codeTreeProps: Record<string, PropNode> = {
	paths: {
		required: true,
		type: 'string[]',
		description:
			'The files to draw, as full paths — src/lib/utils.ts. Folders are made from the paths: two paths that share a prefix share the folders on the way.',
	},
	selected: {
		type: 'string',
		description:
			'The file on screen, by path. Kept by the caller: the tree draws the row, it does not decide what is being shown.',
	},
	onSelect: {
		type: '(path: string) => void',
		description:
			'Called with the path of a clicked file. The row is a nav row, so it is focusable either way — given no handler it simply does nothing.',
	},
	defaultCollapsed: {
		type: 'string[]',
		description:
			'Folders shut on the first frame, by path. Everything else opens; after that the open state belongs to Base UI, so a folder the reader opens stays open.',
	},
	primary: {
		type: 'string[]',
		description:
			'The files the tree is about. The folders leading to them start open and every other folder starts shut, and a row outside the list is drawn in text-muted-foreground — the component first, its dependencies after. The selected file is never quiet, because it is the one being read.',
	},
	action: {
		type: '(path: string) => ReactNode',
		description:
			"A secondary action riding on every file row, drawn from the file's path — the copy in a source dialog. It sits on the row's trailing edge and comes out on hover; a folder has none, because there is nothing on a folder to act on.",
	},
	size: {
		type: '"sm" | "md"',
		default: '"sm"',
		description:
			"The row height — sm for a column beside a pane, md on a page. The type is the page's at both, because a path is text a reader reads rather than code they compare. A row is a nav row, so this is the only measure the tree adds to it.",
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(), onto the tree itself.',
	},
	'...props': {
		type: 'HTMLDivElement props',
		description: 'The tree is a div: id, data-*, aria-* all land on it.',
	},
};

const hookRows = [
	['data-slot="code-tree"', 'the tree', 'a div carrying the size; everything under it is Nav.'],
	['data-size', 'sm | md', 'mirrored onto it, so plain CSS can reach the row density.'],
	[
		'data-slot="nav-button"',
		'a folder',
		'Nav’s row on Base UI’s collapsible trigger: aria-expanded, aria-controls and the panel id are Base UI’s.',
	],
	[
		'data-panel-open',
		'whether it is open',
		'set by Base UI on the trigger; the caret turns and the folder glyph swaps off it.',
	],
	[
		'data-slot="nav-list"',
		'one level',
		'a ul per folder; the rows carry their own indent, one step per level.',
	],
	[
		'data-slot="nav-sub-button"',
		'one file',
		'a nav row: its cursor, hover layer and focus ring are the nav’s, not the tree’s.',
	],
	[
		'data-active',
		'the file on screen',
		'set by the row’s isActive and painted with the nav’s kept hover tint. Only the file carries it — a tree of filled ancestors says nothing.',
	],
	[
		'data-quiet',
		'not one of the primary files',
		'a row outside primary: drawn in text-muted-foreground and, for a folder, shut on the first frame. Only the file on screen is exempt.',
	],
	[
		'aria-current',
		'true on the shown file',
		'what a button row has instead of a link’s promise that it is the page.',
	],
];

const usageImport = "import { CodeTree } from '@/components/blocks/code-tree';";
const usageExample = `<CodeTree
	paths={['src/components/ui/code.tsx', 'src/lib/utils.ts']}
	selected={showing}
	onSelect={setShowing}
/>`;

export function CodeTreePage() {
	return (
		<DocPage
			title="code tree"
			description="the files behind a component, in the shape of the repository"
		>
			<DocPreview path="src/pages/CodeTree/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						three files, and none of them draws a row: the rows are <Mono>Nav</Mono>’s,
						so the command takes the nav and its chain too. the glyphs come from lucide,
						chosen by the file’s own name.
					</>
				}
			>
				<DocInstall
					name="code-tree"
					files={files}
					copyNote={
						<>
							the rows are <Mono>Nav</Mono>’s — a folder is its <Mono>Sub</Mono>, a
							file its <Mono>SubButton</Mono> — and the nav reaches for the
							collapsible, the tooltip, the popover and <Mono>cn()</Mono> in turn. the
							list below is that whole chain, the component last to first.
						</>
					}
					reaches={['src/components/ui/nav.tsx', 'src/lib/utils.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="hand it the paths. it builds the folders, the order and the glyphs itself."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="paths, not a tree"
				note={
					<>
						the input is a flat list, because that is what a caller already has — the
						files a component imports, the output of a directory walk. A folder exists
						here exactly when a path lives in it, so the tree can never claim a
						directory nobody handed over.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					folders sort before files and names sort with <Mono>numeric</Mono>, so{' '}
					<Mono>demos/2.tsx</Mono> sits before <Mono>demos/10.tsx</Mono> and a folder
					never reads as an accident of spelling. A repeated path is drawn once; the
					selection is a path, so two rows could never disagree about what is on screen.
				</p>
			</DocSection>

			<DocSection
				title="folders"
				note={
					<>
						<Mono>defaultCollapsed</Mono> starts a folder shut — the open state after
						that belongs to Base UI, so a reader who opens one keeps it open while the
						page re-renders around them.
					</>
				}
			>
				<DocPreview path="src/pages/CodeTree/demos/collapsed.tsx">
					<Collapsed />
				</DocPreview>
			</DocSection>

			<DocSection
				title="the component, then its dependencies"
				note={
					<>
						<Mono>primary</Mono> names the files the tree is about — the component
						itself. they and the folders on the way to them keep the full strength;
						every other row is drawn quiet, so a tree of a component and everything it
						installs reads as one thing and its context. quiet is only the colour: what
						starts shut is <Mono>defaultCollapsed</Mono>’s to say, which is why the demo
						names its dependencies’ folders. selecting a quiet file brings that row back
						to full strength, because the file being read is never context.
					</>
				}
			>
				<DocPreview path="src/pages/CodeTree/demos/primary.tsx">
					<Primary />
				</DocPreview>
			</DocSection>

			<DocSection
				title="the rows are the nav"
				note={
					<>
						the tree adds no second navigation vocabulary: a file is{' '}
						<Mono>Nav.SubButton</Mono> and a folder is <Mono>Nav.Button</Mono> — the
						same ingredients <Mono>Nav.Sub</Mono> is built from, a Base UI collapsible
						around a nav row. the cursor, the hover layer, the active fill, the caret
						and the focus ring are therefore the ones a sidebar already uses.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					what the tree does decide is the layout and the type, because a path is not a
					sidebar: the caret leads its row rather than trailing it, a folder indents its
					children by 8px rather than <Mono>Nav.SubList</Mono>’s 28px — a sidebar has one
					level of sub rows and a path five folders deep in a 240px column — and the rows
					read in the page's own type rather than in a monospace, since a path is text a
					reader reads, not code they compare.
				</p>
				<p className="text-sm text-muted-foreground">
					what is left once <Mono>Nav</Mono> is taken away is two pure functions,{' '}
					<Mono>treeOf</Mono> and <Mono>fileGlyph</Mono>. a hand-drawn row would have been
					a copy of the nav’s look, and a copy is exactly the thing that drifts.
				</p>
			</DocSection>

			<DocSection
				title="a list, not a tree widget"
				note={
					<>
						the rows are a nested list of links and Base UI collapsibles. Nothing here
						needs <Mono>role="tree"</Mono> and the arrow-key model that comes with it: a
						reader tabs to the folder they want, and the tab stop is honest about what
						is in front of them.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the folder panel is <Mono>hidden="until-found"</Mono>, so the browser's own find
					opens the folder it finds a match in instead of skipping the shut ones. that is
					the whole reason a fold can be shut without hiding its files from search.
				</p>
			</DocSection>

			<DocSection
				title="where it is used"
				note={
					<>
						every <Mono>view code</Mono> dialog in these docs is this component. the
						tree is read from <Mono>registry.json</Mono> — the item's own files, then
						everything its <Mono>registryDependencies</Mono> install — so what a reader
						sees is exactly what <Mono>shadcn add</Mono> would copy, in the folders it
						would copy it into. the file on screen is what that tree is about: its
						folders and its row keep the full strength and every other row is quiet, so
						the tree says where the reader is rather than what the item is made of. no
						folder starts shut, because the dialog is where a reader goes to see the
						whole install at once.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the manifest is not trusted to be right: <Mono>bun run check</Mono> resolves
					every <Mono>@/…</Mono> import a component makes and fails when the item does not
					declare the item that owns it. an undeclared import is a file the CLI never
					copies, and it is better found here than in a project that only fails at build
					time.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="paths is the only thing it needs; everything else is about what the reader is looking at."
			>
				<PropTable props={codeTreeProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note={
					<>
						the open state rides on an attribute Base UI already sets, so the caret and
						the folder glyph follow it in CSS rather than in a second piece of state.
					</>
				}
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
