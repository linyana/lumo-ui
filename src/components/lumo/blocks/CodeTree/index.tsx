import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Folder, FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { Collapsible } from '@/components/lumo/ui/Collapsible';
import { Menu } from '@/components/lumo/ui/Menu';
import { cn } from '@/lib/cn';
import { fileGlyph } from './glyph';
import { normalPath, treeOf, type CodeTreeNode } from './tree';

/**
 * What a row is drawn with at each size, and the one measure the tree adds to a menu row: one level
 * of nesting, in px.
 *
 * `Menu.SubList` indents 28px per level, which is right for a sidebar with one level of sub rows and
 * wrong for a path five folders deep in a 240px column. So a folder here is the same recipe `Sub`
 * uses — a Base UI collapsible around a `Menu.Button` with the menu's own caret — and the children
 * are a list whose rows carry their own indent.
 */
const rowsOf = {
	sm: 'h-7 text-xs font-mono',
	md: 'h-8 text-sm font-mono',
} as const;
const STEP = 12;
const INSET = 8;

export type CodeTreeProps = Omit<ComponentProps<'div'>, 'children' | 'onSelect'> & {
	/** The files to draw, as full paths (`src/lib/cn.ts`). The folders between them are the tree. */
	paths: string[];
	/** The file on screen. Kept by the caller, because what is being shown is theirs. */
	selected?: string;
	onSelect?: (path: string) => void;
	/** Folders shut on the first frame, by path. Everything else opens. */
	defaultCollapsed?: string[];
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
	size = 'sm',
	className,
	...props
}: CodeTreeProps) {
	// A caller's array is a new one on every render; the paths themselves are what the tree is
	// built from, so the work is keyed by the list rather than by the array.
	const key = paths.join('\n');
	const nodes = useMemo(() => (key === '' ? [] : treeOf(key.split('\n'))), [key]);
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
						shut={shut}
						current={current}
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
	current?: string;
	onSelect?: (path: string) => void;
};

function Node({ node, depth, size, shut, current, onSelect }: NodeProps) {
	// Inline because it is a number the tree computed, not a step in a scale: the row is a grid of
	// one column per level, and no class name can say which level this is.
	const indent = { paddingInlineStart: INSET + depth * STEP };

	if (node.kind === 'file') {
		const active = node.path === current;

		return (
			<Menu.SubItem>
				<Menu.SubButton
					icon={fileGlyph(node.name)}
					isActive={active}
					aria-current={active ? 'true' : undefined}
					className={rowsOf[size]}
					style={indent}
					onClick={onSelect === undefined ? undefined : () => onSelect(node.path)}
				>
					{node.name}
				</Menu.SubButton>
			</Menu.SubItem>
		);
	}

	return (
		<Menu.SubItem>
			<BaseCollapsible.Root defaultOpen={!shut.has(node.path)}>
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
							className={cn('group', rowsOf[size])}
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
								current={current}
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
