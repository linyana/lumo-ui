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
		type: '"sm" | "md"',
		default: '"md"',
		description:
			'Cell spacing, not text size. Both densities use text-sm; override the font size with className independently.',
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
		type: '() => void',
		description:
			'Makes the title a button. The caller owns the ordering and sort cycle; this primitive does not reorder records.',
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
	['Table.Footer', 'tfoot', 'A summary band, not a toolbar or an automatically calculated total.'],
	['Table.Row', 'tr', 'Body hover, selected and disabled styling; no click or selection logic.'],
	['Table.Head', 'th', 'Column titles by default; scope="row" identifies a record in the body.'],
	[
		'Table.Cell',
		'td',
		'Logical alignment, tabular figures and nowrap by default. Native span props are passed through.',
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
		'className belongs here; the native table carries data-slot="table".',
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
	['data-align · data-sort', 'cell attributes', 'Logical alignment and the displayed sort direction.'],
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
				note="One file with native table semantics. Base UI is not needed for the table itself; controls inside it keep their own behaviour."
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
						an inner element for truncation. The branch tooltip also opens from
						keyboard focus. Multi-row sticky headers, offsets and fixed columns are not
						included.
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
						<Mono>rowSpan</Mono> merges cells; omit the covered cell in later rows.
						The footer is a summary you calculate, and the caption describes the table.
						This grouped header is deliberately not sticky.
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
				note="The header displays direction, announces aria-sort and calls onSort. The caller owns the sort state and record order, whether calculated locally or fetched from a server."
			>
				<DocPreview path="src/pages/Table/demos/sort.tsx">
					<Sort />
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
				note="An empty table keeps its header and centres a message across every column. Loading uses Skeleton cells and aria-busy on the table; there is no loading prop or automatic placeholder layout."
			>
				<DocPreview path="src/pages/Table/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="A presentation primitive, not a data engine: filtering, pagination, fetching, editing and selection state belong to the caller. All parts accept their native element props."
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
