import { Code } from '@/components/lumo/ui/Code';
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
import Selection from './demos/selection';
import Sort from './demos/sort';
import States from './demos/states';

const files = ['src/components/lumo/ui/Table.tsx'];

const rootProps: Record<string, PropNode> = {
	size: {
		type: '"sm" | "md"',
		default: '"md"',
		description:
			'How much room a row takes. Every part is inset by the same two variables, so this is the only density knob there is.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(), on the scrolling frame — the element a caller gives a height to. Every other prop is the table’s own.',
	},
	'...props': {
		type: 'HTMLTableElement props',
		description:
			'`aria-label`, `aria-describedby`, `id` and the rest land on the `<table>`, which is the element a screen reader reads.',
	},
};

const headProps: Record<string, PropNode> = {
	align: {
		type: '"start" | "center" | "end"',
		default: '"start"',
		description: 'Which edge the column is set from.',
	},
	sort: {
		type: '"ascending" | "descending" | "none"',
		description:
			'Where the column sits in the order, in the words `aria-sort` already uses. Left out, the column cannot be sorted at all — which is not the same as being sortable and unsorted.',
	},
	onSort: {
		type: '() => void',
		description:
			'Given, the name becomes a button and the cell announces its own direction. Pressing it does not reorder anything: order is a fact about the data, and it is the caller’s to change.',
	},
};

const partRows = [
	[
		'Table.Root',
		'the table and the box that scrolls',
		'a div that scrolls, with the `<table>` inside it. It draws nothing itself: the frame, the radius and the surface are the caller’s. The div takes `className`; the table takes the rest.',
	],
	[
		'Table.Header',
		'the column names',
		'a `<thead>` in a band of its own; `sticky` keeps it in place.',
	],
	[
		'Table.Body',
		'the records',
		'a `<tbody>`. Every row keeps its rule, because nothing else closes the table — a caller that draws a box around one drops the last row’s line instead.',
	],
	[
		'Table.Footer',
		'a line of totals',
		'a `<tfoot>` wearing the header’s band — one of the rows that is not a record.',
	],
	[
		'Table.Row',
		'one record',
		'a `<tr>`. The pointer leaves a wash; `data-selected` leaves a longer one.',
	],
	[
		'Table.Head',
		'a column name',
		'a `<th scope="col">`, one step smaller than the data. The band under the pointer deepens. Sorted, the name steps up to full strength.',
	],
	[
		'Table.Cell',
		'one field',
		'a `<td>`, drawn with the same inset and rule as a head. Text does not wrap by default: a column that should fold says `whitespace-normal`.',
	],
	[
		'Table.Empty',
		'no rows',
		'a row spanning `columns`, so the header stays over it — a table that emptied into a paragraph would take away the only thing that says what was supposed to be here.',
	],
	['Table.Caption', 'what the table is', 'a `<caption>` under it.'],
];

const hookRows = [
	[
		'data-slot="table-container"',
		'the box',
		'the div that scrolls; the `<table>` inside it carries `data-slot="table"`.',
	],
	[
		'--cell-px · --cell-py',
		'the inset',
		'set on the frame and read by every head, cell, caption and empty state, so no part can drift out of the table’s rhythm.',
	],
	[
		'bg-table-head',
		'the band',
		'a wash of the text colour over whatever the table sits on — faint, because it names the columns and is not a record. It is opaque, which is what a sticky header needs; `bg-table-head-hover` is the same wash a step deeper, for the column under the pointer.',
	],
	[
		'bg-row-hover',
		'the row states',
		'washes in the theme rather than colours of their own, so a row hover works on the page and inside a card. `bg-row-selected` marks the chosen row, and `bg-row-selected-hover` is that mark under a pointer.',
	],
	[
		'border-separate',
		'the border model',
		'with `border-spacing-0`: not `collapse`, because a collapsed border belongs to the table and scrolls with it — a sticky header drawn that way loses its bottom rule the moment it sticks.',
	],
	[
		'data-size · data-align',
		'the attributes',
		'on the frame and on the cell; a head that can be ordered adds `data-sort`.',
	],
	[
		'aria-sort',
		'what is heard',
		'`ascending`, `descending`, or `none` on a sortable column that is not sorted. Columns that cannot be sorted carry nothing at all.',
	],
	[
		'data-selected · data-disabled',
		'on a row',
		'the caller’s, and the only two the row answers.',
	],
];

const usageImport = "import { Table } from '@/components/lumo/ui/Table';";
const usageExample = `<Table.Root aria-label="recent runs">
	<Table.Header>
		<Table.Row>
			<Table.Head>job</Table.Head>
			<Table.Head align="end">duration</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row>
			<Table.Cell>unit</Table.Cell>
			<Table.Cell align="end">42s</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>`;

export function TablePage() {
	return (
		<DocPage title="table" description="records, in columns, in a box that names them">
			<DocPreview path="src/pages/Table/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, <Mono>tailwind-variants</Mono> and the washes the theme already
						carries. there is no Base UI part here: a table is the one thing the browser
						already knows how to be, so what is added is the band, the row states and
						the arrow that says which way a column runs.
					</>
				}
			>
				<DocInstall
					name="table"
					packages={['tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts', 'src/lib/control.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the table scrolls, so one wider than the column it sits in is read sideways
						rather than squeezed — and it draws nothing around itself: no frame, no
						fill, no radius. the box is the caller’s, which is what lets the same table
						sit on a page and inside a card without saying it twice.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="the header does not sort"
				note={
					<>
						it says which way the column runs and it calls back when the arrow is
						pressed, and that is all: order is a fact about the data, so a table that
						reordered what it was handed would be quietly disagreeing with whoever
						fetched it. the one column that is sorted steps up to full strength, so the
						order can be found without reading every arrow.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/sort.tsx">
					<Sort />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a chosen row"
				note={
					<>
						two fills, and they are not the same one. the pointer leaves a wash of the
						text colour, gone a frame after it passes; a chosen row leaves a tint of{' '}
						<Mono>primary</Mono> that stays. this theme’s primary is also a near-black,
						so that tint is mixed a step stronger than the wash — otherwise a row would
						look chosen only while the pointer happened to be on it.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/selection.tsx">
					<Selection />
				</DocPreview>
			</DocSection>

			<DocSection
				title="nothing, and not yet"
				note={
					<>
						an empty table keeps its columns: <Mono>Table.Empty</Mono> is a row rather
						than a box, so the header stays over it. rows on their way are{' '}
						<Mono>Skeleton</Mono> given the height of the text that will replace them —
						there is no loading state in the component, because a placeholder is only
						ever a promise about a size.
					</>
				}
			>
				<DocPreview path="src/pages/Table/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the box takes the surface and the density; every other part takes a class name and the element's own props."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Root</Mono> — the box
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Table.Head</Mono> — a column name, and the arrow that moves it
						</p>
						<PropTable props={headProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable
							head={['part', 'what it is', 'notes']}
							mono={[0]}
							rows={partRows}
						/>
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="four attributes and five variables: everything a project needs to restyle a table without copying it."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
