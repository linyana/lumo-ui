import { Code } from '@/components/ui/code';
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
import Embedded from './demos/embedded';
import Expansion from './demos/expansion';
import Filter from './demos/filter';
import Fixed from './demos/fixed';
import Responsive from './demos/responsive';
import Scroll from './demos/scroll';
import Selection from './demos/selection';
import Sort from './demos/sort';
import States from './demos/states';
import Structure from './demos/structure';
import Surfaces from './demos/surfaces';
import Tree from './demos/tree';

const files = ['src/components/ui/table.tsx'];

const rootProps: Record<string, PropNode> = {
	variant: {
		type: '"borderless" | "outlined" | "filled"',
		default: '"borderless"',
		description:
			'Transparent records, a card-coloured frame, or a muted surface. Outlined and filled have rounded corners; neither adds a vertical cell grid.',
	},
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description:
			'Cell spacing, not text size. Every density uses text-sm; override the font size with className independently.',
	},
	sortDirections: {
		type: 'TableSort[]',
		default: "['ascending', 'descending']",
		description:
			'The cycle a press on a sortable column walks. The press after the last direction always clears the column, so a two-way cycle is ascending, descending, unsorted.',
	},
	locale: {
		type: 'TableLocale',
		description:
			'Wording of the controls the table draws itself: the sort hints, the filter panel’s search, reset, apply and empty texts, and the words the selection column and the branch toggle are named with. Omitted fields stay English.',
	},
	loading: {
		type: 'boolean',
		default: 'false',
		description:
			'Covers the records with a spinner while keeping them and their column names in place, and marks the table aria-busy. Rows are not unmounted, so the scroll position survives.',
	},
	layout: {
		type: '"auto" | "fixed"',
		default: '"auto"',
		description:
			'Fixed gives every column the width it was declared, which is what ellipsis needs; an automatic layout sizes columns from the content it is asked to cut off.',
	},
	scroll: {
		type: '{ x?: number | string; y?: number | string }',
		description:
			'The two axes of the frame. x is a floor under the table’s width, so the frame scrolls sideways instead of squeezing the columns; y is a ceiling on the frame’s height, so the records scroll under the header. Both take a pixel count or any CSS length.',
	},
	hoverable: {
		type: 'boolean',
		default: 'true',
		description:
			'Highlight body rows under the pointer. False keeps selection visible and leaves sorting controls interactive. Header and footer rows never receive the body hover.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn() on the scrolling container. Give it a height, change its surface, or override its density and font size here.',
	},
	'...props': {
		type: 'HTMLTableElement props',
		description:
			'All remaining props, including style, ref, aria-label, aria-busy and id, land on the native table, not the scrolling container.',
	},
};

const headerProps: Record<string, PropNode> = {
	sticky: {
		type: 'boolean',
		default: 'false',
		description:
			'Hold the column names at the top of the frame while the records move under them. Every row of the header holds, so a grouped header stacks: each row is measured and starts under the one above it. The frame needs a ceiling — scroll y, or a max-height class. Sticking to the page around the frame is not included.',
	},
};

const headProps: Record<string, PropNode> = {
	align: {
		type: '"start" | "center" | "end"',
		default: '"start"',
		description: 'The logical edge the column is set from. Table.Cell takes the same prop.',
	},
	scope: {
		type: '"col" | "colgroup" | "row" | "rowgroup"',
		default: '"col"',
		description:
			'Native header scope. Row and rowgroup headers keep body text sizing and colour instead of the column-title treatment.',
	},
	sort: {
		type: '"ascending" | "descending" | "none"',
		description:
			'The displayed order and aria-sort value. Omit it for a column that cannot be sorted; none means sortable but currently unsorted.',
	},
	onSort: {
		type: '(next: TableSort | undefined) => void',
		description:
			'Makes the title a button and hands over the state the press leads to, including undefined for “stop sorting”. The caller owns the ordering; this primitive does not reorder records.',
	},
	sortDirections: {
		type: 'TableSort[]',
		description:
			'This column’s own cycle, overriding the table’s. One direction makes the first press sort and the second one clear.',
	},
	filter: {
		type: 'TableFilterProps',
		description:
			'An icon beside the title and the panel behind it: options, applied value, onChange, multiple (false draws radios), searchable, a popup className, or render to replace the panel. The panel edits a draft and writes it on Apply.',
	},
	fixed: {
		type: '"start" | "end"',
		description:
			'Pin the column to an edge of the frame so it stays readable while the rest scrolls under it. The offset is measured from the widths of the columns beside it, so nothing has to be declared; give the same edge to every Table.Cell of the column.',
	},
	responsive: {
		type: '("sm" | "md" | "lg" | "xl" | "2xl")[]',
		description:
			'Show the column from the smallest breakpoint named, up. An empty list is a column that is never shown. A column is hidden by CSS, so the same list belongs on its Table.Cells, and a grouped header keeps its colSpan.',
	},
	ellipsis: {
		type: 'boolean | { showTitle?: boolean }',
		description:
			'Cut the title off at the column’s width and keep the whole of it in the native title. showTitle: false drops the tooltip.',
	},
};

const cellProps: Record<string, PropNode> = {
	align: {
		type: '"start" | "center" | "end"',
		default: '"start"',
		description: 'The logical edge the cell is set from; Table.Head takes the same prop.',
	},
	ellipsis: {
		type: 'boolean | { showTitle?: boolean }',
		description:
			'One line, cut off at the column’s width, with the whole value in the native title. Cap the width with --cell-max-w (default 15rem), or declare it with layout="fixed".',
	},
	sort: {
		type: '"ascending" | "descending" | "none"',
		description:
			'The direction its column is displayed in, as Table.Head was told. A sorted column shades its cells, so a sort reads as one band from the header down; none shades nothing.',
	},
	fixed: {
		type: '"start" | "end"',
		description:
			'Pin the cell to an edge of the frame, exactly as its Table.Head does. The two only have to agree on the edge: the offset, the opaque fill and the shadow come from the measurement.',
	},
	responsive: {
		type: '("sm" | "md" | "lg" | "xl" | "2xl")[]',
		description:
			'Show the cell from the smallest breakpoint named, up — the same list as its Table.Head. Hiding a column is CSS only: a native colSpan cannot follow it.',
	},
};

const emptyProps: Record<string, PropNode> = {
	columns: {
		type: 'number',
		required: true,
		description: 'The number of columns to span, including selection or action columns.',
	},
	icon: {
		type: 'ReactNode',
		description: 'An optional rendered glyph above the centred message.',
	},
};

const selectionHeadProps: Record<string, PropNode> = {
	selection: {
		type: 'TableSelection',
		required: true,
		description:
			'The chosen rows and the way back: keys (the rows in view, which is all the header may act on), value (the chosen keys), onChange (the whole list), type (“checkbox” or “radio”) and menu (all, invert, none). Hand the same object to every SelectionCell.',
	},
	fixed: {
		type: '"start" | "end"',
		description: 'Pin the column, exactly as Table.Head does.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the column is w-10 unless this changes it.',
	},
};

const selectionCellProps: Record<string, PropNode> = {
	selection: {
		type: 'TableSelection',
		required: true,
		description: 'The same object the header was given, so the two can never disagree.',
	},
	value: {
		type: 'string',
		required: true,
		description: 'The key of the record this box belongs to.',
	},
	label: {
		type: 'string',
		description:
			'What a screen reader hears instead of the key: the record’s own name. Defaults to the key.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'A record that cannot be chosen.',
	},
	fixed: {
		type: '"start" | "end"',
		description: 'Pin the column, exactly as Table.Cell does.',
	},
};

const branchProps: Record<string, PropNode> = {
	children: {
		type: 'ReactNode',
		required: true,
		description: 'The record’s own name, at the end of the indent.',
	},
	hasChildren: {
		type: 'boolean',
		default: 'true',
		description:
			'Rows sit under this one, so the toggle is drawn. False keeps the space and drops the glyph, which is what holds a tree’s names to one line.',
	},
	open: {
		type: 'boolean',
		default: 'false',
		description: 'Whether those rows are showing; announced with aria-expanded.',
	},
	onOpenChange: {
		type: '(open: boolean) => void',
		description:
			'Called with the state the press leads to. The caller owns which rows are open.',
	},
	label: {
		type: 'string',
		description:
			'What the toggle is called, after the word for the direction it leads. Defaults to the text of children when that is a string.',
	},
};

const expandedRowProps: Record<string, PropNode> = {
	columns: {
		type: 'number',
		required: true,
		description: 'How many columns the panel reaches across: the whole row.',
	},
	depth: {
		type: 'number',
		default: '1',
		description:
			'How deep the record above it sits, so the panel opens under the name it belongs to.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn() on the cell that holds the panel.',
	},
};

const partRows = [
	[
		'Table.Root',
		'scrolling container + table',
		'The container owns density and surface; all remaining native props belong to the table.',
	],
	['Table.Header', 'thead', 'An opaque column-title band. sticky holds every row of the header.'],
	['Table.Body', 'tbody', 'Records, including native row headers and merged cells.'],
	[
		'Table.Footer',
		'tfoot',
		'A summary band, not a toolbar or an automatically calculated total.',
	],
	[
		'Table.Row',
		'tr',
		'Body hover, selected and disabled styling; depth is what a tree sits on, and neither clicks nor selects anything.',
	],
	[
		'Table.Head',
		'th',
		'Column titles by default; scope="row" identifies a record in the body. sort + onSort make it a sort control, filter adds a panel behind an icon, fixed pins the column to an edge, responsive shows it from a breakpoint up.',
	],
	[
		'Table.Cell',
		'td',
		'Logical alignment, tabular figures and nowrap by default; ellipsis cuts the value to one line. Native span props are passed through.',
	],
	['Table.Empty', 'tr + td', 'A centred message spanning columns, so the header stays visible.'],
	[
		'Table.SelectionHead',
		'th',
		'The column of boxes: all, some or none of the keys the header was given, with an optional menu that takes all, none or the opposite.',
	],
	[
		'Table.SelectionCell',
		'td',
		'One box for one record, belonging to the set the header holds. A radio column is the same part with type: “radio”.',
	],
	[
		'Table.Branch',
		'span + button',
		'A record’s name, inset by its row’s depth, with the toggle that opens what is filed under it.',
	],
	[
		'Table.ExpandedRow',
		'tr + td',
		'The panel a record opens into: a row spanning every column, so the table keeps its header and its widths.',
	],
	[
		'Table.Caption',
		'caption',
		'A native description below the records, inside the scrolling container.',
	],
];

const hookRows = [
	[
		'data-slot="table-container"',
		'scrolling frame',
		'className belongs here; the native table carries data-slot="table", and the frame sits in a data-slot="table-root" box so the loading layer can cover it without scrolling.',
	],
	[
		'--table-surface',
		'host background',
		'Opaque base for the header, the footer and every pinned column. Falls back to background; outlined uses card and filled uses muted. Set it explicitly when a borderless table sits on another surface.',
	],
	[
		'--table-head-top',
		'sticky header rows',
		'The offset each header row holds at, measured from the rows above it, so a grouped header stacks without anyone adding up heights.',
	],
	[
		'data-fixed · --table-fixed-offset',
		'pinned columns',
		'Set by fixed on a title or a cell. The offset is measured from the widths of the columns before it and written as a custom property, so no column declares how far it should stick.',
	],
	[
		'data-fixed-edge · data-scrolled-start · data-scrolled-end',
		'edges of a scrolling frame',
		'The last pinned column of a run is marked as the one that casts the shadow, and the frame says which edges still have content behind them, so a shadow appears only once something has passed under it.',
	],
	[
		'--cell-px · --cell-py',
		'cell spacing',
		'Set by size on the container, inherited by heads, cells and captions.',
	],
	[
		'bg-table-head · bg-table-head-hover',
		'header bands',
		'Opaque washes mixed over --table-surface, so a sticky header hides records passing underneath.',
	],
	[
		'bg-row-hover · bg-row-selected · bg-row-selected-hover',
		'body states',
		'Transparent washes that work on each surface, including row-header cells.',
	],
	[
		'data-variant · data-size · data-hoverable',
		'container attributes',
		'The chosen surface, density and body-hover setting.',
	],
	[
		'data-align · data-sort · data-filtered · data-ellipsis',
		'cell attributes',
		'Logical alignment, the displayed sort direction (on a header and on the cells of its column), an applied filter on the column, and a value cut to one line.',
	],
	[
		'bg-table-head-hover · bg-column-sorted',
		'sorted column',
		'The band a sort paints. The header cell takes the opaque step, so a sticky one still hides the records under it; the body cells take a translucent wash, so a hovered or chosen row still reads inside the column.',
	],
	[
		'--cell-max-w',
		'ellipsis width',
		'How far a column with ellipsis may run before it is cut. Defaults to 15rem.',
	],
	[
		'--table-depth · data-depth',
		'the level a row sits at',
		'Written by depth on Table.Row: Branch insets its name by it, and ExpandedRow opens under it. One number, read by two parts and by nothing else.',
	],
	[
		'data-selected · data-disabled',
		'row attributes',
		'Set by the caller. They style a row; they do not implement selection or disable nested controls semantically.',
	],
	[
		'aria-sort',
		'header semantics',
		'Ascending, descending or none on a sortable header; absent on an ordinary column.',
	],
];

const usageImport = "import { Table } from '@/components/ui/table';";
const usageExample = `<Table.Root variant="outlined" aria-label="recent runs">
	<Table.Header>
		<Table.Row>
			<Table.Head>job</Table.Head>
			<Table.Head align="end">duration</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row>
			<Table.Head scope="row">unit</Table.Head>
			<Table.Cell align="end">42s</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>`;

export function TablePage() {
	return (
		<DocPage title="table" description="records in columns, with a surface when they need one">
			<DocPreview path="src/pages/Table/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note="One file with native table semantics. Sorting, filtering, the selection column and the branch toggle are drawn here from the library's own popover, menu, checkbox, radio group, input and button, which the install brings with it; the records, their order and which of them are chosen stay the caller's."
			>
				<DocInstall
					name="table"
					files={files}
					reaches={['src/lib/utils.ts', 'src/lib/control.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="Compose native sections and cells. The table remains frameless by default; choose a surface when it stands on its own."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="surfaces"
				note={
					<>
						<Mono>borderless</Mono> blends into its host; <Mono>outlined</Mono> draws a
						card-coloured frame; <Mono>filled</Mono> uses a muted surface without a
						frame. These static records set <Mono>{'hoverable={false}'}</Mono>.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/surfaces.tsx">
					<Surfaces />
				</DocPreview>
			</DocSection>

			<DocSection
				title="scrolling and a sticky header"
				note={
					<>
						<Mono>scroll</Mono> gives the frame its two axes: <Mono>x</Mono> is a floor
						under the table’s width, so the columns keep the widths they were declared
						and the frame scrolls instead of squeezing them, and <Mono>y</Mono> is a
						ceiling on the frame’s height. A <Mono>sticky</Mono> header then holds at
						its top — every row of a grouped one holds too, each measured under the row
						above it. Cells do not wrap by default; use <Mono>whitespace-normal</Mono>{' '}
						for notes, and constrain an inner element for truncation. The branch tooltip
						also opens from keyboard focus. A header that sticks to the page around the
						frame is not included.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/scroll.tsx">
					<Scroll />
				</DocPreview>
			</DocSection>

			<DocSection
				title="pinned columns"
				note={
					<>
						<Mono>fixed</Mono> pins a column to an edge of the frame, so the record
						keeps its name while the rest of it scrolls sideways. Both edges are
						measured: the offset comes from the widths of the columns beside it, which
						is why a title and its cells only have to agree on the edge and never on a
						distance. A pinned cell is filled opaquely — nothing may be read through a
						column standing in front of the others — so a hovered or chosen row is laid
						on that fill as a layer instead of replacing it. The shadow belongs to the
						last pinned column of a run and appears only once something has passed under
						it, so the frame is what tells it which way there is more to read. Widths,
						not content, are what a pinned column is measured against: declare them,
						with <Mono>layout=&quot;fixed&quot;</Mono> and a<Mono>colgroup</Mono> or a
						width class on each title.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/fixed.tsx">
					<Fixed />
				</DocPreview>
			</DocSection>

			<DocSection
				title="responsive columns"
				note={
					<>
						<Mono>responsive</Mono> names the smallest breakpoint a column is shown
						from, and the column is hidden by CSS below it — one class, so nothing
						re-renders when the window moves. Give the same list to the column’s{' '}
						<Mono>Table.Head</Mono> and to each of its <Mono>Table.Cell</Mono>s. A
						native <Mono>colSpan</Mono> cannot follow a hidden column, so leave a
						grouped header out of it, and keep the rule on the table rather than inside
						a container query that would disagree with it.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/responsive.tsx">
					<Responsive />
				</DocPreview>
			</DocSection>

			<DocSection
				title="native structure"
				note={
					<>
						Use <Mono>scope="colgroup"</Mono> with <Mono>colSpan</Mono> for grouped
						headings and <Mono>scope="row"</Mono> to name a record. Native{' '}
						<Mono>rowSpan</Mono> merges cells; omit the covered cell in later rows. The
						footer is a summary you calculate, and the caption describes the table. This
						grouped header is left in place; the scrolling demo shows one that holds.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/structure.tsx">
					<Structure />
				</DocPreview>
			</DocSection>

			<DocSection
				title="inside a card"
				note={
					<>
						Keep the table borderless when its host already draws a frame. Set{' '}
						<Mono>--table-surface: var(--card)</Mono> so the opaque header matches that
						host in both themes. Remove the content inset and the final row rule only
						where the card closes the table; no global Card styles need to change.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/embedded.tsx">
					<Embedded />
				</DocPreview>
			</DocSection>

			<DocSection
				title="sorting"
				note={
					<>
						A press anywhere on a sortable column sorts it, and the arrow beside the
						title is the same 24px icon button as the funnel next to it — tinted under
						the pointer, and tinted again for as long as the column is sorted. The cell
						is the pointer’s target, not the keyboard’s: the arrow button carries the
						same press, named, with a <Mono>title</Mono> that says what the next one
						will do. The cell announces <Mono>aria-sort</Mono>, and <Mono>onSort</Mono>{' '}
						is handed the state the press leads to. A sorted column shades itself as one
						band, the header cell stronger than the body, so the sort starts at the
						column’s name and survives a sticky header — which is why the same{' '}
						<Mono>sort</Mono> belongs on that column’s <Mono>Table.Cell</Mono>s too. The
						default cycle ends in <Mono>undefined</Mono>, so the third press returns the
						records to the order they arrived in; <Mono>sortDirections</Mono> shortens
						the cycle per table or per column. The caller still owns the sort state and
						record order, whether calculated locally or fetched.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/sort.tsx">
					<Sort />
				</DocPreview>
			</DocSection>

			<DocSection
				title="filtering"
				note={
					<>
						A <Mono>filter</Mono> on a column draws a funnel beside the title and opens
						a panel of checkboxes — or radios, with <Mono>multiple={'{false}'}</Mono>.
						The panel edits a draft: nothing is filtered until Apply, Reset only empties
						the draft, and closing the popup discards it, so a reader can look and walk
						away. <Mono>searchable</Mono> adds a search box, and an icon keeps a tint
						while its column is sorted or filtered, so an applied filter is still
						visible after the popup has closed. Pass a <Mono>render</Mono> function for
						a panel of your own. Filtering the records is still the caller’s:{' '}
						<Mono>onChange</Mono> hands over the chosen values, or <Mono>null</Mono>.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/filter.tsx">
					<Filter />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a chosen row"
				note={
					<>
						<Mono>selection</Mono> is one object handed to the header and to every box:
						the keys the column is responsible for, the keys that are chosen, and the
						way back. The header acts on exactly those keys and never on rows it cannot
						see, so a fetched page and one shared selected set live together — the page
						can change under a chosen set without the header claiming anything. The box
						that is neither all nor none is drawn as indeterminate; the menu beside it
						takes all, none, or the opposite. The caller still owns{' '}
						<Mono>data-selected</Mono> on the row, because a row is not told what the
						boxes beside it are holding.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/selection.tsx">
					<Selection />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a tree of records"
				note={
					<>
						A record carries its depth on its row, and <Mono>Table.Branch</Mono> insets
						the name by it — one level, one row at a time, with no width to calculate.
						The toggle turns rather than filling: an open row says it is open with the
						way the glyph points, not with a tint that would read as a chosen row. A row
						with nothing under it keeps the space and drops the glyph, so the names stay
						on one line. Which rows are open is the caller’s: a set of keys, the same
						shape a selection has.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/tree.tsx">
					<Tree />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a record that opens"
				note={
					<>
						<Mono>Table.ExpandedRow</Mono> is a row, not a box floating under one: the
						table keeps its columns, the header stays where a reader was reading, and
						the panel is inset by the depth its record was given. Render it under the
						record it belongs to, where <Mono>Table.Body</Mono> would otherwise have
						gone on with the next one.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/expansion.tsx">
					<Expansion />
				</DocPreview>
			</DocSection>

			<DocSection
				title="nothing, and not yet"
				note="An empty table keeps its header and centres a message across every column. loading covers the records with a spinner and marks the table aria-busy without unmounting them, so the height and the scroll position survive; Skeleton cells are the alternative when placeholder rows say more than a spinner."
			>
				<DocPreview path="src/pages/Table/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="A presentation primitive, not a data engine: ordering the records, applying a filter, pagination, fetching, editing and selection state belong to the caller. All parts accept their native element props."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Root</Mono>
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Header</Mono>
						</p>
						<PropTable props={headerProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Head</Mono>
						</p>
						<PropTable props={headProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Cell</Mono>
						</p>
						<PropTable props={cellProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Empty</Mono>
						</p>
						<PropTable props={emptyProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.SelectionHead</Mono>
						</p>
						<PropTable props={selectionHeadProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.SelectionCell</Mono>
						</p>
						<PropTable props={selectionCellProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Branch</Mono>
						</p>
						<PropTable props={branchProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.ExpandedRow</Mono>
						</p>
						<PropTable props={expandedRowProps} />
					</div>
					<DocTable head={['part', 'element', 'notes']} mono={[0, 1]} rows={partRows} />
				</div>
			</DocSection>

			<DocSection
				title="styling hooks"
				note="The frame takes className; style and ref still belong to the native table. Use container classes for surface overrides and scrolling constraints. Table variants and cell variants are exported for reuse."
			>
				<DocTable head={['hook', 'role', 'notes']} mono={[0]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
