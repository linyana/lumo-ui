import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Folder, FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Collapsible } from '@/components/ui/collapsible';
import { Nav } from '@/components/ui/nav';
import { cn } from '@/lib/utils';
import { fileGlyph } from './glyph';
import { foldersOf, normalPath, treeOf, type CodeTreeNode } from './tree';

/**
 * What a row is drawn with at each size, and the one measure the tree adds to a nav row: one level
 * of nesting, in px.
 *
 * The type is the page's at both sizes: a path is text a reader reads, not code they compare, so the
 * two sizes are a row height rather than a type scale. `Nav.SubList` indents 28px per level, which
 * is right for a sidebar with one level of sub rows and wrong for a path five folders deep in a
 * 240px column. So a folder here is the same recipe `Sub` uses — a Base UI collapsible around a
 * `Nav.Button` with the nav's own caret — and the children are a list whose rows carry their own
 * indent.
 */
const rowsOf = {
	sm: 'h-7 text-sm',
	md: 'h-8 text-sm',
} as const;
const STEP = 8;
const INSET = 8;
/** What the trailing action of a row takes: `Nav.Action` is 20 wide, four from the end. */
const ACTION = 24;
/** What a row that is context rather than the thing is drawn with. */
const QUIET = 'text-muted-foreground';

/**
 * The box a row is scrolled in: the nearest ancestor whose overflow is its own. One that does not
 * happen to overflow right now is still the answer — it is the box that will move when it has to.
 */
function scrollerAround(row: HTMLElement) {
	for (let box = row.parentElement; box !== null; box = box.parentElement) {
		const { overflowY } = getComputedStyle(box);
		if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return box;
	}
	return null;
}

export type CodeTreeProps = Omit<ComponentProps<'div'>, 'children' | 'onSelect'> & {
	/** The files to draw, as full paths (`src/lib/utils.ts`). The folders between them are the tree. */
	paths: string[];
	/** The file on screen. Kept by the caller, because what is being shown is theirs. */
	selected?: string;
	onSelect?: (path: string) => void;
	/** Folders shut on the first frame, by path. Everything else opens. */
	defaultCollapsed?: string[];
	/**
	 * The files the tree is about. The folders leading to them start open and every other folder
	 * starts shut, and a row outside the list is drawn quiet — so a tree of a component and the
	 * files it installs reads as the component first and its dependencies after.
	 */
	primary?: string[];
	/**
	 * A secondary action riding on every file row, from the path to the element that does it — a
	 * copy, in the dialog that shows the files. It is drawn on the row's trailing edge and comes out
	 * on hover, so the tree stays a tree; a folder has none, because there is nothing to act on.
	 */
	action?: (path: string) => ReactNode;
	size?: keyof typeof rowsOf;
};

/**
 * A list of paths, drawn as the navigation it is.
 *
 * No row is drawn here: a file is `Nav.SubButton` and a folder is `Nav.Button`, so the cursor, the
 * hover layer, the active fill, the caret, the type scale and the focus ring are the nav's — the
 * same ones a sidebar uses. What is left is the shape: paths in, folders out, one level of indent,
 * and the glyph each file is drawn with.
 */
export function CodeTree({
	paths,
	selected,
	onSelect,
	defaultCollapsed,
	primary,
	action,
	size = 'sm',
	className,
	...props
}: CodeTreeProps) {
	// A caller's array is a new one on every render; the paths themselves are what the tree is
	// built from, so the work is keyed by the list rather than by the array.
	const key = paths.join('\n');
	const nodes = useMemo(() => (key === '' ? [] : treeOf(key.split('\n'))), [key]);
	// The same is true of `primary`: the list is new on every render, the files are not.
	const primaryKey = primary?.join('\n');
	const about = useMemo(
		() =>
			primaryKey === undefined || primaryKey === ''
				? null
				: new Set(primaryKey.split('\n').map(normalPath)),
		[primaryKey],
	);
	// The folders those files sit in: the ones that open, and the ones that stay at full strength.
	const leading = useMemo(() => (about === null ? null : foldersOf(about)), [about]);
	// Read once and never written: the folds belong to Base UI from here on, so a folder the reader
	// opens stays open while `defaultCollapsed` says otherwise.
	const [shut] = useState(() => new Set((defaultCollapsed ?? []).map(normalPath)));
	const current = selected === undefined ? undefined : normalPath(selected);
	const tree = useRef<HTMLDivElement>(null);

	// A selection that arrives from outside — the dialog's own file, an arrow key, a link — is
	// brought into view: a selection nobody can see is not a selection. The first one is not: it is
	// the caller's own, and the frame it lands in is the caller's to arrange, so a tree mounted below
	// the fold of a long page does not pull that page down to itself as it appears. Only the box the
	// tree is scrolled in moves — `scrollIntoView` would take every ancestor with it.
	const shown = useRef(current);
	useEffect(() => {
		if (current === undefined || shown.current === current) return;
		shown.current = current;

		const row = tree.current?.querySelector<HTMLElement>(
			'[data-slot="nav-sub-button"][data-active]',
		);
		if (row === null || row === undefined) return;
		const box = scrollerAround(row);
		if (box === null) return;

		// `nearest`, as `scrollIntoView` would have it: only move when the row is outside the box, and
		// then only as far as it takes to bring it back in.
		const rowRect = row.getBoundingClientRect();
		const top = rowRect.top - box.getBoundingClientRect().top;
		const bottom = top + rowRect.height;
		if (top < 0) box.scrollTop += top;
		else if (bottom > box.clientHeight) box.scrollTop += bottom - box.clientHeight;
	}, [current]);

	return (
		<div
			ref={tree}
			data-slot="code-tree"
			data-size={size}
			className={cn('w-full min-w-0', className)}
			{...props}
		>
			<Nav.List className="gap-px">
				{nodes.map((node) => (
					<Node
						key={node.path}
						node={node}
						depth={0}
						size={size}
						leading={leading}
						about={about}
						shut={shut}
						current={current}
						action={action}
						onSelect={onSelect}
					/>
				))}
			</Nav.List>
		</div>
	);
}

type NodeProps = {
	node: CodeTreeNode;
	depth: number;
	size: keyof typeof rowsOf;
	shut: ReadonlySet<string>;
	/** The folders that lead to a primary file; null when the tree was given no `primary`. */
	leading: ReadonlySet<string> | null;
	/** The files the tree is about; null when it was given no `primary`. */
	about: ReadonlySet<string> | null;
	current?: string;
	action?: (path: string) => ReactNode;
	onSelect?: (path: string) => void;
};

function Node({ node, depth, size, shut, leading, about, current, action, onSelect }: NodeProps) {
	// Inline because it is a number the tree computed, not a step in a scale: the row is a grid of
	// one column per level, and no class name can say which level this is.
	const indent = { paddingInlineStart: INSET + depth * STEP };

	if (node.kind === 'file') {
		const active = node.path === current;
		// Quiet is for the context around the component, and the file being read is never context.
		const quiet = about !== null && !about.has(node.path) && !active;

		return (
			<Nav.SubItem>
				<Nav.SubButton
					icon={fileGlyph(node.name)}
					isActive={active}
					aria-current={active ? 'true' : undefined}
					data-quiet={quiet || undefined}
					className={cn(
						rowsOf[size],
						// What `Nav.Action` measures itself against, and the room it takes on the row.
						action !== undefined && 'peer/nav-button',
						quiet && QUIET,
					)}
					style={
						action === undefined
							? indent
							: { ...indent, paddingInlineEnd: INSET + ACTION }
					}
					onClick={onSelect === undefined ? undefined : () => onSelect(node.path)}
				>
					{node.name}
				</Nav.SubButton>
				{action?.(node.path)}
			</Nav.SubItem>
		);
	}

	// A folder off the way to a primary file is the tree's context, and starts as a reader leaves a
	// dependency: shut and quiet.
	const quiet = leading !== null && !leading.has(node.path);

	return (
		<Nav.SubItem>
			<BaseCollapsible.Root defaultOpen={!shut.has(node.path) && !quiet}>
				{/* The same two parts `Nav.Sub` composes, in a different order: the caret leads the row
				    instead of trailing it, because in a tree the caret is what marks the level — a row
				    that ends in one reads as a sidebar's, not as a file's. */}
				<BaseCollapsible.Trigger
					render={
						<Nav.Button
							icon={
								<>
									<Collapsible.Icon />
									<FolderGlyph />
								</>
							}
							label={node.name}
							data-quiet={quiet || undefined}
							className={cn('group', rowsOf[size], quiet && QUIET)}
							style={indent}
						/>
					}
				/>
				<Collapsible.Panel>
					<Nav.List className="gap-px">
						{node.children.map((child) => (
							<Node
								key={child.path}
								node={child}
								depth={depth + 1}
								size={size}
								shut={shut}
								leading={leading}
								about={about}
								current={current}
								action={action}
								onSelect={onSelect}
							/>
						))}
					</Nav.List>
				</Collapsible.Panel>
			</BaseCollapsible.Root>
		</Nav.SubItem>
	);
}

/**
 * The folder, open or shut. Both glyphs are here and the open state shows one: Base UI already puts
 * `data-panel-open` on the trigger, so this is read in CSS rather than in a second piece of state.
 */
function FolderGlyph() {
	return (
		<>
			<Folder aria-hidden="true" className="group-data-panel-open:hidden" />
			<FolderOpen aria-hidden="true" className="hidden group-data-panel-open:block" />
		</>
	);
}
