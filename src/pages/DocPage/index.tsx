import { ArrowLeft, ArrowRight, Braces, Check, Copy as CopyIcon, Info, X } from 'lucide-react';
import {
	Children,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/lumo/ui/Button';
import { Code, Copy } from '@/components/lumo/ui/Code';
import { Dialog } from '@/components/lumo/ui/Dialog';
import { Skeleton } from '@/components/lumo/ui/Skeleton';
import { Steps } from '@/components/lumo/ui/Steps';
import { Tabs } from '@/components/lumo/ui/Tabs';
import { Tooltip } from '@/components/lumo/ui/Tooltip';
import { cn } from '@/lib/cn';
import { languageOf, readSource, readTree, type SourceFile } from './sources';

/** The anchor a section's title becomes, and the id its `h2` carries. */
export function sectionId(title: string) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export type DocNeighbor = { path: string; label: string };

const DocNeighborsContext = createContext<{
	previous?: DocNeighbor;
	next?: DocNeighbor;
}>({});

/**
 * The rail's order, handed down rather than imported: pages import this file, so reading the
 * route table here would close a cycle.
 */
export function DocNeighborsProvider({
	value,
	children,
}: {
	value: { previous?: DocNeighbor; next?: DocNeighbor };
	children: ReactNode;
}) {
	return <DocNeighborsContext.Provider value={value}>{children}</DocNeighborsContext.Provider>;
}

function CopyPage({ title, description }: { title: string; description?: string }) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1600);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<Button
			size="sm"
			variant="secondary"
			icon={copied ? <Check /> : <CopyIcon />}
			aria-label={copied ? 'copied' : 'copy page'}
			onClick={() => {
				const content = document.querySelector('[data-slot=doc-page-content]');
				const text = `${title}\n\n${description ?? ''}\n\n${content?.textContent ?? ''}`;
				navigator.clipboard.writeText(text).then(
					() => setCopied(true),
					() => {},
				);
			}}
		>
			{copied ? 'copied' : 'copy page'}
		</Button>
	);
}

/** One neighbour as an arrow: the whole page's order, in the corner of its header. */
function NeighborButton({
	neighbor,
	direction,
}: {
	neighbor?: DocNeighbor;
	direction: 'previous' | 'next';
}) {
	const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;

	if (neighbor === undefined) {
		return (
			<Button
				size="icon"
				variant="secondary"
				className="size-8"
				disabled
				aria-label={direction}
			>
				<Icon />
			</Button>
		);
	}

	return (
		<Button
			size="icon"
			variant="secondary"
			className="size-8"
			aria-label={`${direction}: ${neighbor.label}`}
			render={<Link to={`/${neighbor.path}`} />}
		>
			<Icon />
		</Button>
	);
}

function DocActions({ title, description }: { title: string; description?: string }) {
	const { previous, next } = useContext(DocNeighborsContext);

	return (
		<div data-slot="doc-actions" className="flex shrink-0 items-center gap-1">
			<CopyPage title={title} description={description} />
			<NeighborButton neighbor={previous} direction="previous" />
			<NeighborButton neighbor={next} direction="next" />
		</div>
	);
}

export type DocPageProps = {
	title: string;
	description?: string;
	/** The column is prose-wide by default; a page of cards takes the whole of the surface. */
	wide?: boolean;
	children: ReactNode;
};

/**
 * The shell a doc page draws inside `Layout.Content`: the page's own title, the column, and the
 * section list beside it. It keeps no chrome of its own — the title scrolls with the page.
 */
export function DocPage({ title, description, wide = false, children }: DocPageProps) {
	return (
		<div
			data-slot="doc-page"
			className={cn(
				'mx-auto flex w-full items-start gap-12 p-8',
				!wide && 'max-w-3xl xl:max-w-5xl',
			)}
		>
			<div data-slot="doc-page-content" className="min-w-0 flex-1 space-y-12">
				<div data-slot="doc-page-head" className="space-y-2">
					<div className="flex items-start justify-between gap-4">
						<h1 className="text-2xl font-semibold">{title}</h1>
						<DocActions title={title} description={description} />
					</div>
					{description !== undefined && (
						<p className="text-muted-foreground">{description}</p>
					)}
				</div>
				{children}
			</div>
			<Toc titles={sectionTitles(children)} />
		</div>
	);
}

/** A name that is code, in running text: a prop, an attribute, a token. */
export function Mono({ children }: { children: ReactNode }) {
	return <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">{children}</code>;
}

/** One command, with the way to take it — no header, no language label. */
export function Command({ children }: { children: string }) {
	return (
		<div
			data-slot="doc-command"
			className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2"
		>
			<code className="min-w-0 truncate font-mono">{children}</code>
			<Copy value={children} />
		</div>
	);
}

/** One file of the manual, as a path: its text lives behind the dialog, never in the page. */
export type DocSource = { path: string };

/** The file's own name, which is what a reader recognises it by: `Button.tsx`, not its path. */
function fileName(path: string) {
	return path.split('/').pop() ?? path;
}

/** `a`, `a and b`, `a, b and c` — read out rather than cut off with an ellipsis. */
function list(names: string[]): string {
	if (names.length <= 1) return names.join('');
	return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
}

/** A helper is called; a component is named. The only difference a sentence has to make. */
function reachName(path: string) {
	const name = fileName(path).replace(/\.\w+$/, '');
	return name === 'cn' ? 'cn()' : name;
}

/** A stable empty list, so the default prop does not make a new array on every render. */
const NO_PATHS: string[] = [];

/**
 * One file of the manual: its path, and the way to read it. The text is behind the same dialog an
 * example's source opens in, so the installation section carries no source of its own either.
 */
function ManualFile({ path }: DocSource) {
	return (
		<SourceDialog path={path}>
			<Button
				size="sm"
				variant="outline"
				icon={<Braces />}
				className="w-full justify-start font-mono text-xs"
			>
				<span className="truncate">{path}</span>
			</Button>
		</SourceDialog>
	);
}

export type DocInstallProps = {
	/** The registry item the CLI takes, as `linyana/lumo-ui/<name>`. */
	name: string;
	/** npm packages the copied files import. */
	packages: string[];
	/** The component's own files, in the order the CLI copies them. */
	files: string[];
	/** What those files reach for, when it is more than `cn()`. */
	reaches?: string[];
	/** The one sentence under the command. Written from the manifest unless given. */
	note?: ReactNode;
	/** The sentence above the reached files, for a chain longer than the list can say. */
	reachesNote?: ReactNode;
	/** Whether the manual ends on the tokens. A helper that only merges classes does not need them. */
	tokens?: boolean;
};

/**
 * The two routes to the same component: the command, or the files by hand. Every page's
 * installation section is this block, so what differs between two components is the manifest and
 * nothing else — and a page that copies a file the manual forgets cannot happen.
 */
export function DocInstall({
	name,
	packages,
	files,
	reaches = NO_PATHS,
	note,
	reachesNote,
	tokens = true,
}: DocInstallProps) {
	const own = files.map(fileName);
	const reached = reaches.map(reachName);
	const steps = [packages.length > 0, true, reaches.length > 0, tokens].filter(Boolean).length;
	const counted = ['no', 'one', 'two', 'three', 'four'][steps] ?? 'a few';

	const tabs: DocTabItem[] = [
		{
			value: 'cli',
			label: 'Command',
			content: (
				<div className="space-y-3">
					<Command>{`bunx shadcn@latest add linyana/lumo-ui/${name}`}</Command>
					<p className="text-muted-foreground">
						{note ?? (
							<>
								copies <Mono>{list(own)}</Mono>
								{reached.length > 0 && (
									<>
										, and the files it reaches for: <Mono>{list(reached)}</Mono>
									</>
								)}
								.{' '}
								{packages.length > 0 && (
									<>
										<Mono>{list(packages)}</Mono>
										{packages.length === 1 ? ' comes' : ' come'} from the
										package manager.
									</>
								)}
							</>
						)}
					</p>
				</div>
			),
		},
		{
			value: 'manual',
			label: 'Manual',
			content: (
				<div className="space-y-4">
					<p className="text-muted-foreground">
						<>
							the command does {counted} {steps === 1 ? 'thing' : 'things'}, in order.
							by hand they are:
						</>
					</p>
					<Steps.Root orientation="vertical">
						{packages.length > 0 && (
							<Steps.Item>
								<Steps.Title>install the packages</Steps.Title>
								<Steps.Description>
									what the files below import, from the package manager.
								</Steps.Description>
								<Command>{`bun add ${packages.join(' ')}`}</Command>
							</Steps.Item>
						)}
						<Steps.Item>
							<Steps.Title>copy the component</Steps.Title>
							<Steps.Description>
								its imports already read <Mono>@/…</Mono>, so it goes where they
								point.
							</Steps.Description>
							<div className="space-y-1.5">
								{files.map((path) => (
									<ManualFile key={path} path={path} />
								))}
							</div>
						</Steps.Item>
						{reaches.length > 0 && (
							<Steps.Item>
								<Steps.Title>copy what it reaches for</Steps.Title>
								<Steps.Description>
									{reachesNote ?? (
										<>
											the {list(reached)} it imports, without which it does
											not compile.
										</>
									)}
								</Steps.Description>
								<div className="space-y-1.5">
									{reaches.map((path) => (
										<ManualFile key={path} path={path} />
									))}
								</div>
							</Steps.Item>
						)}
						{tokens && (
							<Steps.Item>
								<Steps.Title>bring the tokens</Steps.Title>
								<Steps.Description>
									skip this one if the project already defines{' '}
									<Mono>--primary</Mono>, <Mono>--radius</Mono> and the rest — the
									component then wears its colours.
								</Steps.Description>
								<ManualFile path="src/styles/lumo-tokens.css" />
							</Steps.Item>
						)}
					</Steps.Root>
				</div>
			),
		},
	];

	return <DocTabs tabs={tabs} />;
}

/**
 * The titles of the sections the page drew. Read off the elements themselves rather than passed
 * a second time, so the list beside the page and the page cannot disagree.
 */
function sectionTitles(children: ReactNode) {
	return Children.toArray(children).flatMap((child) =>
		isValidElement<DocSectionProps>(child) && typeof child.props.title === 'string'
			? [child.props.title]
			: [],
	);
}

/** The section under the top of the column, tracked so the list can point at it. */
function useActiveSection(titles: string[]) {
	const [active, setActive] = useState('');
	const key = titles.join('\n');

	useEffect(() => {
		const ids = key === '' ? [] : key.split('\n').map(sectionId);
		const elements = ids.flatMap((id) => {
			const element = document.getElementById(id);
			return element === null ? [] : [element];
		});
		if (elements.length === 0) return;

		const onScreen = new Set<string>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) onScreen.add(entry.target.id);
					else onScreen.delete(entry.target.id);
				}
				const first = ids.find((id) => onScreen.has(id));
				if (first !== undefined) setActive(first);
			},
			{ rootMargin: '-24px 0px -55% 0px' },
		);
		for (const element of elements) observer.observe(element);

		return () => observer.disconnect();
	}, [key]);

	return active;
}

function Toc({ titles }: { titles: string[] }) {
	const active = useActiveSection(titles);
	if (titles.length === 0) return null;

	return (
		<nav
			data-slot="doc-toc"
			className="sticky top-6 hidden w-40 shrink-0 flex-col text-xs xl:flex"
		>
			<p className="mb-2 font-medium text-muted-foreground">on this page</p>
			<ul>
				{titles.map((title) => {
					const id = sectionId(title);
					return (
						<li key={title}>
							<a
								href={`#${id}`}
								data-active={active === id ? '' : undefined}
								className={cn(
									'-ml-px block border-l py-1 pl-3',
									'border-transparent text-muted-foreground',
									'transition-[color,border-color]',
									'hover:text-foreground',
									'data-active:border-foreground data-active:text-foreground',
								)}
							>
								{title}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export type DocSectionProps = {
	title: string;
	/** The prose under the example. Kept as a node so a section can mark up its own words. */
	note?: ReactNode;
	children: ReactNode;
};

/** One heading, one demo, one explanation — the rhythm every page in these docs follows. */
export function DocSection({ title, note, children }: DocSectionProps) {
	return (
		<section id={sectionId(title)} data-slot="doc-section" className="scroll-mt-8 space-y-4">
			<h2 className="text-lg font-medium">{title}</h2>
			{children}
			{note !== undefined && <p className="text-sm text-muted-foreground">{note}</p>}
		</section>
	);
}

export type DocPreviewProps = {
	/** The module behind the demo, `src/pages/…/demos/…` — the dialog loads it; the page never does. */
	path: string;
	children: ReactNode;
};

/** One row of the tree: a file, and underneath it whatever that file imports. */
function SourceRow({
	node,
	selected,
	onSelect,
}: {
	node: SourceFile;
	selected: string;
	onSelect: (path: string) => void;
}) {
	return (
		<li>
			<button
				type="button"
				title={node.path}
				data-selected={node.path === selected ? '' : undefined}
				onClick={() => onSelect(node.path)}
				className={cn(
					'flex h-7 w-full cursor-pointer items-center rounded-md px-2 text-left',
					'font-mono text-xs text-muted-foreground',
					'hover:bg-accent hover:text-accent-foreground',
					'data-selected:bg-selected data-selected:text-foreground',
				)}
			>
				<span className="truncate">{node.name}</span>
			</button>
			{node.children.length > 0 && (
				<ul className="ms-2 space-y-0.5 border-s ps-1">
					{node.children.map((child) => (
						<SourceRow
							key={child.path}
							node={child}
							selected={selected}
							onSelect={onSelect}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

/**
 * The source of an example, and of the files it reaches for: the tree on the left is the demo's own
 * imports, walked outward, and the pane on the right is whichever of them is selected.
 *
 * None of it is in the page until the dialog opens, and none of it outlives the open either — the
 * popup is mounted by Base UI when it is asked for, so the reading starts from the demo each time.
 * The modules are fetched by path, so a docs page carries no source at all.
 */
function SourceDialog({ path, children }: { path: string; children: ReactElement }) {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={children} />
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup className="flex h-[80vh] max-h-[44rem] w-[92vw] max-w-5xl flex-col gap-0 overflow-hidden p-0">
						<SourcePane path={path} />
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

/** The contents of the dialog: mounted with the popup, so every open starts at the demo's own file. */
function SourcePane({ path }: { path: string }) {
	const [tree, setTree] = useState<SourceFile | null>(null);
	const [selected, setSelected] = useState(path);
	const [text, setText] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		readTree(path).then(
			(next) => {
				if (live) setTree(next);
			},
			() => {},
		);
		return () => {
			live = false;
		};
	}, [path]);

	useEffect(() => {
		let live = true;
		readSource(selected).then(
			(source) => {
				if (live) setText(source ?? '');
			},
			() => {},
		);
		return () => {
			live = false;
		};
	}, [selected]);

	const browse = (next: string) => {
		setSelected(next);
		setText(null);
	};

	return (
		<>
			<div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
				<Dialog.Title className="flex min-w-0 items-baseline gap-2 text-sm font-medium">
					source
					<span className="truncate font-mono text-xs font-normal text-muted-foreground">
						{selected}
					</span>
				</Dialog.Title>
				<div className="flex shrink-0 items-center gap-1">
					<Copy value={text ?? ''} />
					<Dialog.Close
						render={
							<Button
								size="icon"
								variant="ghost"
								className="size-7"
								aria-label="close"
							>
								<X />
							</Button>
						}
					/>
				</div>
			</div>
			<div className="flex min-h-0 flex-1">
				<div className="w-52 shrink-0 overflow-y-auto border-e p-2">
					{tree === null ? (
						<Skeleton className="h-7 w-full" />
					) : (
						<ul className="space-y-0.5">
							<SourceRow node={tree} selected={selected} onSelect={browse} />
						</ul>
					)}
				</div>
				<div className="min-w-0 flex-1 overflow-auto p-3">
					{text === null ? (
						<Skeleton className="h-40 w-full" />
					) : (
						<Code
							code={text}
							language={languageOf(selected)}
							header={false}
							variant="ghost"
							showLineNumbers
							wrap
						/>
					)}
				</div>
			</div>
		</>
	);
}

/**
 * A demo and the way to its source: the file that renders sits in the page, the text sits behind a
 * dialog — nothing of the code is in the document until somebody asks to read it.
 */
export function DocPreview({ path, children }: DocPreviewProps) {
	const name = path.slice(path.lastIndexOf('/') + 1);

	return (
		<div data-slot="doc-preview" data-file={name} className="overflow-hidden rounded-lg border">
			<div className="flex min-h-40 flex-wrap items-center justify-center gap-3 p-8">
				{children}
			</div>
			<div className="flex items-center justify-between gap-3 border-t px-3 py-1.5">
				<span className="truncate font-mono text-xs text-muted-foreground">{name}</span>
				<SourceDialog path={path}>
					<Button size="sm" variant="ghost" icon={<Braces />}>
						view code
					</Button>
				</SourceDialog>
			</div>
		</div>
	);
}

export type DocTabItem = { value: string; label: string; content: ReactNode };

/** A pending idle slot, whatever scheduler ended up giving it out. */
type Idle = { cancel: () => void };

/** An idle slot, or the next best thing where the browser has none to give. */
function whenIdle(task: () => void): Idle {
	if (typeof requestIdleCallback === 'function') {
		const handle = requestIdleCallback(task);
		return { cancel: () => cancelIdleCallback(handle) };
	}
	const handle = setTimeout(task, 300);
	return { cancel: () => clearTimeout(handle) };
}

/**
 * A choice of routes to the same place: the command, or the files by hand.
 *
 * One track, not one panel: the routes sit side by side and the track is slid to the open one, so
 * the body arriving and the body leaving travel together, sideways, with the indicator. The box
 * holding them is only ever as tall as the lane on screen and follows it to the next lane's
 * height — which is a number the browser already knows, because the lane was laid out, not
 * measured by hand.
 *
 * A route stays mounted once it is there, and the rest are mounted for the reader before they ask,
 * one per idle slot: that work has to happen somewhere. Done on the click it is the one thing the
 * slide cannot survive; done while the page is idle it costs nobody a frame of anything. The
 * content handed to a lane that is still empty is nothing, so the first render of the page does
 * not pay for a route nobody has opened.
 *
 * `transition={false}` per lane: a box easing to its own content's height inside a track that is
 * measuring that box would be two animations chasing one number.
 */
export function DocTabs({ tabs }: { tabs: DocTabItem[] }) {
	const [value, setValue] = useState(tabs[0]?.value);
	/** The routes that are mounted. Everything after the first gets there by being opened. */
	const [opened, setOpened] = useState(() => new Set([tabs[0]?.value]));

	const open = (next: string) => {
		setValue(next);
		setOpened((previous) => (previous.has(next) ? previous : new Set(previous).add(next)));
	};

	// Keyed by the routes and not the array: a page passing a fresh array each render would
	// otherwise queue the rest again and again.
	const routes = tabs.map((tab) => tab.value).join('\n');

	useEffect(() => {
		const rest = routes === '' ? [] : routes.split('\n').slice(1);
		let pending: Idle | undefined;
		let live = true;

		const take = () => {
			const next = rest.shift();
			if (!live || next === undefined) return;
			setOpened((previous) => (previous.has(next) ? previous : new Set(previous).add(next)));
			pending = whenIdle(take);
		};

		pending = whenIdle(take);
		return () => {
			live = false;
			pending?.cancel();
		};
	}, [routes]);

	return (
		<Tabs.Root
			value={value}
			onValueChange={(next) => open(next)}
			variant="square"
			className="gap-2"
		>
			<Tabs.List className="shadow-none">
				{tabs.map((tab) => (
					<Tabs.Tab key={tab.value} value={tab.value}>
						{tab.label}
					</Tabs.Tab>
				))}
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Panels>
				{tabs.map((tab) => (
					<Tabs.Panel key={tab.value} value={tab.value} transition={false}>
						{opened.has(tab.value) ? (
							<div className="space-y-3">{tab.content}</div>
						) : null}
					</Tabs.Panel>
				))}
			</Tabs.Panels>
		</Tabs.Root>
	);
}

export type PropNode = {
	/** The type as an editor would show it. */
	type: string;
	/** The default, verbatim. Missing means there is none. */
	default?: string;
	/** The sentence that would have made the table too wide: it opens from the name. */
	description?: string;
	required?: boolean;
};

export type PropTableProps = {
	props: Record<string, PropNode>;
};

function PropHint({ name, description }: { name: string; description: string }) {
	return (
		<Tooltip.Root>
			<Tooltip.Trigger
				render={
					<button
						type="button"
						aria-label={`about ${name}`}
						className="inline-flex shrink-0 cursor-help items-center text-muted-foreground transition-colors hover:text-foreground"
					/>
				}
			>
				<Info className="size-[1em]" />
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Positioner>
					<Tooltip.Popup>{description}</Tooltip.Popup>
				</Tooltip.Positioner>
			</Tooltip.Portal>
		</Tooltip.Root>
	);
}

/** Props: what it takes, what it falls back to, and the one sentence that would not fit a cell. */
export function PropTable({ props }: PropTableProps) {
	return (
		<Tooltip.Provider delay={150}>
			<div data-slot="prop-table" className="overflow-x-auto rounded-lg border">
				<table className="w-full border-collapse text-left text-xs">
					<thead>
						<tr className="border-b bg-muted">
							{['prop', 'type', 'default'].map((label) => (
								<th
									key={label}
									scope="col"
									className="px-3 py-2 font-medium text-muted-foreground"
								>
									{label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Object.entries(props).map(([name, node]) => (
							<tr key={name} className="border-b last:border-b-0">
								<td className="px-3 py-2 align-top whitespace-nowrap">
									<span className="inline-flex items-center gap-1.5 font-mono">
										{name}
										{!node.required && '?'}
										{node.description !== undefined && (
											<PropHint name={name} description={node.description} />
										)}
									</span>
								</td>
								<td className="px-3 py-2 align-top font-mono">{node.type}</td>
								<td className="px-3 py-2 align-top font-mono text-muted-foreground">
									{node.default ?? '—'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Tooltip.Provider>
	);
}

export type DocTableProps = {
	/** Column headings, left to right. */
	head: string[];
	/** Zero-based columns set in mono — the ones holding a name or a value. */
	mono?: number[];
	/** One array per row. A cell is a node, so a cell can carry markup. */
	rows: ReactNode[][];
};

/** What a component puts on the DOM: no props here, so no tooltips — one line per hook. */
/* oxlint-disable react/no-array-index-key -- a row has no id of its own; its position is its identity */
export function DocTable({ head, mono, rows }: DocTableProps) {
	return (
		<div data-slot="doc-table" className="overflow-x-auto rounded-lg border">
			<table className="w-full border-collapse text-left text-xs">
				<thead>
					<tr className="border-b bg-muted">
						{head.map((label) => (
							<th
								key={label}
								scope="col"
								className="px-3 py-2 font-medium text-muted-foreground"
							>
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIndex) => (
						<tr key={rowIndex} className="border-b last:border-b-0">
							{row.map((cell, cellIndex) => (
								<td
									key={cellIndex}
									className={cn(
										'px-3 py-2 align-top',
										mono?.includes(cellIndex) && 'font-mono',
									)}
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
