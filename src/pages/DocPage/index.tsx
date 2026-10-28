import {
	ArrowLeft,
	ArrowRight,
	Check,
	CodeXml as CodeGlyph,
	Copy as CopyIcon,
	Download,
	Info,
	X,
} from 'lucide-react';
import {
	Children,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type ReactElement,
	type ReactNode,
} from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/lumo/ui/Button';
import { Code, Copy } from '@/components/lumo/ui/Code';
import { CodeTree } from '@/components/lumo/blocks/CodeTree';
import { Dialog } from '@/components/lumo/ui/Dialog';
import { Menu } from '@/components/lumo/ui/Menu';
import { Skeleton } from '@/components/lumo/ui/Skeleton';
import { Steps } from '@/components/lumo/ui/Steps';
import { Tabs } from '@/components/lumo/ui/Tabs';
import { Tooltip } from '@/components/lumo/ui/Tooltip';
import { cn } from '@/lib/cn';
import { highlight } from '@/lib/shiki';
import { filesOf, installFiles, itemOf, languageOf, readSource } from './sources';
import { zipOf } from './zip';

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
			// A link, not a button: the row navigates, and an anchor keeps the middle-click, the
			// context menu and the status bar the browser gives every link.
			nativeButton={false}
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

/** The theme, which no registry item carries: the manual names it the way it names a copied file. */
const TOKENS = 'src/styles/lumo-tokens.css';

/**
 * The files one step copies, named where they go. A step is a sentence and a list of destinations;
 * the text of every one of them is behind the single dialog at the end of the manual, so the page
 * carries no source and the reader has one place to read from.
 */
function ManualFiles({ paths }: { paths: string[] }) {
	return (
		<ul data-slot="doc-manual-files" className="font-mono text-xs text-muted-foreground">
			{paths.map((path) => (
				<li key={path}>{path}</li>
			))}
		</ul>
	);
}

/**
 * The copy riding on a file's row in the dialog: one click takes that file, without selecting it
 * first — which is what makes reading the manual file by file a route of its own.
 */
function CopyFile({ path }: { path: string }) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1600);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<Menu.Action
			type="button"
			showOnHover
			aria-label={copied ? `copied ${path}` : `copy ${path}`}
			onClick={() => {
				readSource(path).then(
					(text) =>
						navigator.clipboard.writeText(text ?? '').then(
							() => setCopied(true),
							() => {},
						),
					() => {},
				);
			}}
		>
			{copied ? <Check /> : <CopyIcon />}
		</Menu.Action>
	);
}

/** The row copy as the tree's slot takes it: a function from the file's path to the action. */
function rowCopy(path: string) {
	return <CopyFile path={path} />;
}

/**
 * The manual as one file: every path, with its text, stored rather than compressed — they are text
 * and there are few. What the archive carries is where they live, so unzipping it at the project's
 * root puts each one exactly where its imports expect it.
 */
function DownloadFiles({ name, paths }: { name: string; paths: string[] }) {
	const [building, setBuilding] = useState(false);

	const take = async () => {
		setBuilding(true);
		try {
			const files = await Promise.all(
				paths.map(async (path) => ({ path, text: (await readSource(path)) ?? '' })),
			);
			const url = URL.createObjectURL(zipOf(files));
			const link = document.createElement('a');
			link.href = url;
			link.download = name;
			document.body.append(link);
			link.click();
			link.remove();
			// Revoked well after the browser has taken the bytes: a blob released while the download
			// is still reading it is a download that stops halfway.
			setTimeout(() => URL.revokeObjectURL(url), 10_000);
		} finally {
			setBuilding(false);
		}
	};

	return (
		<Button
			variant="secondary"
			icon={<Download />}
			loading={building}
			onClick={() => {
				take().catch(() => {});
			}}
		>
			download all
		</Button>
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
	/** The sentence over the copy step, for a chain longer than the list can say. */
	copyNote?: ReactNode;
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
	copyNote,
	tokens = true,
}: DocInstallProps) {
	const own = files.map(fileName);
	const reached = reaches.map(reachName);
	const steps = [packages.length > 0, true].filter(Boolean).length;
	const counted = ['no', 'one', 'two'][steps] ?? 'a few';
	// The dialog opens on the first file the command copies, and is about everything the reader
	// would copy by hand: the reached files and the tokens are named by the manual, not by the
	// manifest, so they are handed over rather than looked up.
	const lead = files[0];
	const about = tokens ? [...reaches, TOKENS] : reaches;
	// What the step lists and the archive holds: the item, what it installs, and the tokens no
	// manifest names — the tokens last, because they are the one file a project may already have.
	const copy = [...installFiles(name, reaches), ...(tokens ? [TOKENS] : [])];

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
							<Steps.Title>copy the code</Steps.Title>
							<Steps.Description>
								{copyNote ?? (
									<>
										the component
										{reached.length > 0 && (
											<>, plus the {list(reached)} it reaches for</>
										)}
										. its imports already read <Mono>@/…</Mono>, so each file
										goes where they point.
									</>
								)}
								{tokens && (
									<>
										{' '}
										skip <Mono>lumo-tokens.css</Mono> if the project already
										defines <Mono>--primary</Mono>, <Mono>--radius</Mono> and
										the rest.
									</>
								)}
							</Steps.Description>
							<div className="space-y-2">
								<ManualFiles paths={copy} />
								<div className="flex items-center gap-2">
									{lead !== undefined && (
										<SourceDialog path={lead} name={name} about={about}>
											<Button
												variant="outline"
												icon={<CodeGlyph />}
												className="flex-1 justify-start"
											>
												browse the files
											</Button>
										</SourceDialog>
									)}
									<DownloadFiles name={`lumo-ui-${name}.zip`} paths={copy} />
								</div>
							</div>
						</Steps.Item>
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

/**
 * The source of an example, and of the files the component it demonstrates installs: the tree on the
 * left is that registry item, drawn in the shape of the repository, and the pane on the right is
 * whichever file is selected. The demo and the component itself lead the tree, because that is what
 * was clicked, and so does anything the caller names beside them; the dependencies the registry
 * installs around them start shut and quiet.
 *
 * The manifest is in the bundle, so the tree is there on the first frame; only the file's text is
 * fetched, and only for the one file on screen. Nothing outlives the open — the popup is mounted by
 * Base UI when it is asked for.
 */
function SourceDialog({
	path,
	name,
	about,
	children,
}: {
	path: string;
	/** The registry item the dialog draws around `path`; without one it draws `path` alone. */
	name?: string;
	/** Files the caller names beside the item's own — a manual's reached files, the tokens. */
	about?: string[];
	children: ReactElement;
}) {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={children} />
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup className="flex h-[80vh] max-h-[44rem] w-[92vw] max-w-5xl flex-col gap-0 overflow-hidden p-0">
						<SourcePane path={path} name={name} about={about} />
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

/** The contents of the dialog: mounted with the popup, so every open starts at the file that was clicked. */
function SourcePane({ path, name, about }: { path: string; name?: string; about?: string[] }) {
	// A caller's array is a new one on every render; the paths are what the tree is built from.
	const aboutKey = about?.join('\n') ?? '';
	const named = useMemo(() => (aboutKey === '' ? [] : aboutKey.split('\n')), [aboutKey]);
	const { own } = useMemo(() => filesOf(name), [name]);
	// What the tree is about: the clicked file, the component it belongs to, and whatever the caller
	// named beside them. Everything the registry installs around that is the context, and the tree
	// starts it shut and quiet.
	const primary = useMemo(() => [path, ...own, ...named], [path, own, named]);
	const files = useMemo(
		() => [...new Set([path, ...installFiles(name, named)])],
		[path, name, named],
	);
	const [selected, setSelected] = useState(path);
	// What the pane is SHOWING, which trails the selection by one read. Keeping the file that is
	// already there until the next one is ready is what stops the pane blanking between two clicks.
	const [shown, setShown] = useState<{ path: string; text: string } | null>(null);
	// What has been read, by path: a file read before — and every file the reader has met — is on
	// screen in the frame it is asked for.
	const read = useRef(new Map<string, string>());

	useEffect(() => {
		let live = true;

		const show = async () => {
			let text = read.current.get(selected);
			if (text === undefined) {
				text = (await readSource(selected)) ?? '';
				read.current.set(selected, text);
			}

			// The colour is settled BEFORE the swap, not after it: `Code` reads its lines out of the
			// same cache, so the file arrives painted instead of arriving plain and then colouring
			// in — which is the second half of the flash this pane used to have.
			await highlight(text, languageOf(selected)).catch(() => {});

			if (live) setShown({ path: selected, text });
		};

		show().catch(() => {});
		return () => {
			live = false;
		};
	}, [selected]);

	return (
		<>
			<div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
				<Dialog.Title className="flex min-w-0 items-baseline gap-2 text-sm font-medium">
					source
					<span className="truncate font-mono text-xs font-normal text-muted-foreground">
						{shown?.path ?? selected}
					</span>
				</Dialog.Title>
				<div className="flex shrink-0 items-center gap-1">
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
				<div className="w-60 shrink-0 overflow-y-auto border-e p-2">
					<CodeTree
						paths={files}
						primary={primary}
						selected={selected}
						onSelect={setSelected}
						action={rowCopy}
					/>
				</div>
				{/* Keyed by the file, so a new one starts at its own top rather than wherever the last
				    one was scrolled to. */}
				<div
					key={shown?.path ?? selected}
					className="min-w-0 flex-1 overflow-auto px-3 pb-3 [scrollbar-gutter:stable]"
				>
					{/* The way to take the file sits in the file's own corner, where the code starts, and
					    stays there while it is scrolled — a copy of what is on screen, not of a header's
					    idea of it. */}
					<div
						data-slot="source-copy"
						className="sticky top-0 z-10 flex justify-end py-1"
					>
						<Copy value={shown?.text ?? ''} />
					</div>
					{shown === null ? (
						<Skeleton className="h-40 w-full" />
					) : (
						<Code
							code={shown.text}
							language={languageOf(shown.path)}
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
			{/* The way in is the whole row, not a word at one end of it: a file name beside it made the
			    name look like the thing to click. */}
			<div data-slot="doc-preview-footer" className="border-t p-1">
				<SourceDialog path={path} name={itemOf(path)}>
					<ViewCode />
				</SourceDialog>
			</div>
		</div>
	);
}

/**
 * The label and the braces that open it: the glyph holds no room until the row is hovered or focused,
 * then rises into it out of the line below, and the centred pair slides right to make space. The
 * glyph goes through the `icon` slot rather than through `children`, because `children` is wrapped for
 * the loading spinner and the two would end up on two lines. The width is what moves the label, so
 * the icon and the word stay one block rather than two.
 *
 * It takes and forwards the button's props because `Dialog.Trigger` renders it: the click, the
 * `aria-haspopup` and the ref that anchors the popup are handed to whatever `render` names, and a
 * component that swallowed them would be a row that looks like a trigger and is not one.
 */
function ViewCode({ className, ...props }: ComponentProps<typeof Button>) {
	return (
		<Button
			size="sm"
			variant="ghost"
			{...props}
			className={cn(
				'group/code w-full gap-0 text-muted-foreground hover:text-foreground',
				className,
			)}
			icon={
				<span
					aria-hidden="true"
					className={cn(
						'flex h-[1em] w-0 shrink-0 items-center overflow-hidden',
						'transition-[width] ease-[var(--ease-spring)] duration-[var(--duration-state)]',
						'group-hover/code:w-5 group-focus-visible/code:w-5',
					)}
				>
					<CodeGlyph
						className={cn(
							'translate-y-full opacity-0',
							'transition-[translate,opacity] ease-[var(--ease-spring)] duration-[var(--duration-state)]',
							'group-hover/code:translate-y-0 group-hover/code:opacity-100',
							'group-focus-visible/code:translate-y-0 group-focus-visible/code:opacity-100',
						)}
					/>
				</span>
			}
		>
			view code
		</Button>
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
