import { ArrowLeft, ArrowRight, Check, Copy as CopyIcon, Info } from 'lucide-react';
import {
	Children,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/lumo/ui/Button';
import { Code, Copy } from '@/components/lumo/ui/Code';
import { Tabs } from '@/components/lumo/ui/Tabs';
import { Tooltip } from '@/components/lumo/ui/Tooltip';
import { cn } from '@/lib/cn';

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
	children: ReactNode;
};

/**
 * The shell a doc page draws inside `Layout.Content`: the page's own title, the column, and the
 * section list beside it. It keeps no chrome of its own — the title scrolls with the page.
 */
export function DocPage({ title, description, children }: DocPageProps) {
	return (
		<div
			data-slot="doc-page"
			className="mx-auto flex w-full max-w-3xl items-start gap-12 p-8 xl:max-w-5xl"
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
	/** The file name the source is shown under. */
	name: string;
	/** That file's own text, read with `?raw` — one copy, so the demo and its code cannot drift. */
	source: string;
	children: ReactNode;
};

const COLLAPSED = 160;

/**
 * A demo with its own source folded underneath, short code left open: what you read is the file
 * that renders, not a retelling of it.
 */
export function DocPreview({ name, source, children }: DocPreviewProps) {
	const [expanded, setExpanded] = useState(false);
	const [fits, setFits] = useState(true);
	const body = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = body.current;
		if (element === null) return;
		const measure = () => setFits(element.scrollHeight <= COLLAPSED + 24);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	const open = expanded || fits;

	return (
		<div data-slot="doc-preview" data-file={name} className="overflow-hidden rounded-lg border">
			<div className="flex min-h-40 flex-wrap items-center justify-center gap-3 p-8">
				{children}
			</div>
			<div className="relative border-t">
				<div
					ref={body}
					className={open ? 'max-h-150 overflow-y-auto' : 'max-h-40 overflow-hidden'}
				>
					<Code code={source} language="tsx" header={false} variant="filled" />
				</div>
				<Copy value={source} className="absolute top-2 right-2" />
				{!open && (
					<div className="absolute inset-x-0 bottom-0 flex h-24 items-center justify-center bg-linear-to-b from-transparent to-muted">
						<Button size="sm" variant="outline" onClick={() => setExpanded(true)}>
							view code
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export type DocTabItem = { value: string; label: string; content: ReactNode };

/**
 * A choice of routes to the same place: the command, or the files by hand.
 *
 * One panel, not one per route: the bodies differ in length, and a panel of its own would leave
 * the page jumping between them. The swap eases the height and travels with the tabs.
 */
export function DocTabs({ tabs }: { tabs: DocTabItem[] }) {
	const [value, setValue] = useState(tabs[0]?.value);
	const active = tabs.find((tab) => tab.value === value) ?? tabs[0];

	return (
		<Tabs.Root
			value={value}
			onValueChange={(next) => setValue(next)}
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
			<Tabs.Panel value={value}>
				<div className="space-y-3">{active?.content}</div>
			</Tabs.Panel>
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
