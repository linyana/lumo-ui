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
import Filter from './demos/filter';
import Scroll from './demos/scroll';
import Selection from './demos/selection';
import Sort from './demos/sort';
import States from './demos/states';
import Structure from './demos/structure';
import Surfaces from './demos/surfaces';

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
			'Wording of the controls the table draws itself: the sort hints, and the filter panel’s search, reset, apply and empty texts. Omitted fields stay English.',
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
			'Keep a single header row at the top of the scrolling container. Give Table.Root a height or max-height. Grouped sticky headers, offsets and page-level sticking are not provided.',
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

const partRows = [
	[
		'Table.Root',
		'scrolling container + table',
		'The container owns density and surface; all remaining native props belong to the table.',
	],
	['Table.Header', 'thead', 'An opaque column-title band. sticky supports one header row.'],
	['Table.Body', 'tbody', 'Records, including native row headers and merged cells.'],
	[
		'Table.Footer',
		'tfoot',
		'A summary band, not a toolbar or an automatically calculated total.',
	],
	['Table.Row', 'tr', 'Body hover, selected and disabled styling; no click or selection logic.'],
	[
		'Table.Head',
		'th',
		'Column titles by default; scope="row" identifies a record in the body. sort + onSort make it a sort control, filter adds a panel behind an icon.',
	],
	[
		'Table.Cell',
		'td',
		'Logical alignment, tabular figures and nowrap by default; ellipsis cuts the value to one line. Native span props are passed through.',
	],
	['Table.Empty', 'tr + td', 'A centred message spanning columns, so the header stays visible.'],
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
		'Opaque base for the header and footer. Falls back to background; outlined uses card and filled uses muted. Set it explicitly when a borderless table sits on another surface.',
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
				note="One file with native table semantics. Sorting and filtering are drawn here from the library's own popover, checkbox, radio group, input and button, which the install brings with it; the records and their order stay the caller's."
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
						Give the container a <Mono>max-height</Mono> to scroll vertically. A single
						header row can stay at its top while the body moves underneath. Cells do not
						wrap by default; use <Mono>whitespace-normal</Mono> for notes, and constrain
						an inner element for truncation. The branch tooltip also opens from keyboard
						focus. Multi-row sticky headers, offsets and fixed columns are not included.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/scroll.tsx">
					<Scroll />
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
						grouped header is deliberately not sticky.
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
				note="Checkboxes own their behaviour; the caller owns the selected keys and sets data-selected on each row. The selected tint stays visible after the pointer leaves and deepens on hover."
			>
				<DocPreview path="src/pages/Table/demos/selection.tsx">
					<Selection />
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
