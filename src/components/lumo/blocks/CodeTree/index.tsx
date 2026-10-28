import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Folder, FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Collapsible } from '@/components/lumo/ui/Collapsible';
import { Menu } from '@/components/lumo/ui/Menu';
import { cn } from '@/lib/cn';
import { fileGlyph } from './glyph';
import { foldersOf, normalPath, treeOf, type CodeTreeNode } from './tree';

/**
 * What a row is drawn with at each size, and the one measure the tree adds to a menu row: one level
 * of nesting, in px.
 *
 * The type is the page's at both sizes: a path is text a reader reads, not code they compare, so the
 * two sizes are a row height rather than a type scale. `Menu.SubList` indents 28px per level, which
 * is right for a sidebar with one level of sub rows and wrong for a path five folders deep in a
 * 240px column. So a folder here is the same recipe `Sub` uses — a Base UI collapsible around a
 * `Menu.Button` with the menu's own caret — and the children are a list whose rows carry their own
 * indent.
 */
const rowsOf = {
	sm: 'h-7 text-sm',
	md: 'h-8 text-sm',
} as const;
const STEP = 8;
const INSET = 8;
/** What the trailing action of a row takes: `Menu.Action` is 20 wide, four from the end. */
const ACTION = 24;
/** What a row that is context rather than the thing is drawn with. */
const QUIET = 'text-muted-foreground';

export type CodeTreeProps = Omit<ComponentProps<'div'>, 'children' | 'onSelect'> & {
	/** The files to draw, as full paths (`src/lib/cn.ts`). The folders between them are the tree. */
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
 * No row is drawn here: a file is `Menu.SubButton` and a folder is `Menu.Button`, so the cursor, the
 * hover layer, the active fill, the caret, the type scale and the focus ring are the menu's — the
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
	// brought into view: a selection nobody can see is not a selection.
	useEffect(() => {
		if (current === undefined) return;
		const row = tree.current?.querySelector<HTMLElement>(
			'[data-slot="menu-sub-button"][data-active]',
		);
		row?.scrollIntoView({ block: 'nearest' });
	}, [current]);

	return (
		<div
			ref={tree}
			data-slot="code-tree"
			data-size={size}
			className={cn('w-full min-w-0', className)}
			{...props}
		>
			<Menu.List className="gap-px">
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
			</Menu.List>
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
			<Menu.SubItem>
				<Menu.SubButton
					icon={fileGlyph(node.name)}
					isActive={active}
					aria-current={active ? 'true' : undefined}
					data-quiet={quiet || undefined}
					className={cn(
						rowsOf[size],
						// What `Menu.Action` measures itself against, and the room it takes on the row.
						action !== undefined && 'peer/menu-button',
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
				</Menu.SubButton>
				{action?.(node.path)}
			</Menu.SubItem>
		);
	}

	// A folder off the way to a primary file is the tree's context, and starts as a reader leaves a
	// dependency: shut and quiet.
	const quiet = leading !== null && !leading.has(node.path);

	return (
		<Menu.SubItem>
			<BaseCollapsible.Root defaultOpen={!shut.has(node.path) && !quiet}>
				{/* The same two parts `Menu.Sub` composes, in a different order: the caret leads the row
				    instead of trailing it, because in a tree the caret is what marks the level — a row
				    that ends in one reads as a sidebar's, not as a file's. */}
				<BaseCollapsible.Trigger
					render={
						<Menu.Button
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
					<Menu.List className="gap-px">
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
					</Menu.List>
				</Collapsible.Panel>
			</BaseCollapsible.Root>
		</Menu.SubItem>
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
