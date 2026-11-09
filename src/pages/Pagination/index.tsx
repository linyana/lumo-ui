import {
	DocInstall,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	DocUsage,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Basic from './demos/basic';
import Compact from './demos/compact';
import WithTable from './demos/with-table';

const files = ['src/components/ui/pagination.tsx'];

const rootProps: Record<string, PropNode> = {
	page: {
		type: 'number',
		required: true,
		description:
			'The page in view, counted from one. A number outside the range is clamped rather than corrected in the caller, so a URL that says 40 of 12 shows the last page instead of nothing.',
	},
	pageCount: {
		type: 'number',
		description: 'How many pages there are, when the caller already knows it.',
	},
	total: {
		type: 'number',
		description:
			'How many records there are. With pageSize it is what the page count and the range are computed from; give either this or pageCount.',
	},
	pageSize: {
		type: 'number',
		description:
			'How many records one page holds. Twenty is the usual answer; it is not assumed.',
	},
	onPageChange: {
		type: '(page: number) => void',
		description:
			'Called with the page a reader asked for — a number pressed, an arrow pressed, or nothing when the press leads nowhere. Nothing changes until this is called.',
	},
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description:
			'The tier of the boxes: 32, 36 or 40 pixels, the same three a Button takes, so a pagination in a footer lines up with the controls beside it.',
	},
	locale: {
		type: 'PaginationLocale',
		description:
			'The words the control says on its own: the two arrows, the name of a page, and the “of” in the range. Omitted fields stay English.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn() on the nav. The row is a flex box with a small gap; justify-between is what puts the range at one end and the numbers at the other.',
	},
	'...props': {
		type: 'nav props',
		description:
			'Everything else lands on the nav, including aria-label, which defaults to “pagination”.',
	},
};

const pagesProps: Record<string, PropNode> = {
	siblings: {
		type: 'number',
		default: '1',
		description:
			'How many pages show on each side of the one in view. The first and last pages are always shown, and whatever is left between them collapses into one gap.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn() on the row that holds the numbers.',
	},
};

const itemProps: Record<string, PropNode> = {
	value: {
		type: 'number',
		description:
			'Page.Page only: the page this box stands for. Pages draws one per number; give your own to compose a window of your own.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn() on the box.',
	},
	'...props': {
		type: 'button props',
		description:
			'Land on the button, after the press this part writes: a disabled arrow is disabled here, not by the caller.',
	},
};

const rangeProps: Record<string, PropNode> = {
	className: {
		type: 'string',
		description: 'Merged last through cn() on the span.',
	},
};

const usageImport = "import { Pagination } from '@/components/ui/pagination';";
const usageExample = `<Pagination.Root page={page} total={240} pageSize={20} onPageChange={setPage}>
	<Pagination.Prev />
	<Pagination.Pages />
	<Pagination.Next />
</Pagination.Root>`;

const partRows = [
	[
		'Pagination.Root',
		'nav',
		'holds the page, the size and the total, and hands every part the same answer. A navigation landmark with a name, so a screen reader can list it.',
	],
	['Pagination.Prev', 'button', 'one page back; disabled on the first page.'],
	['Pagination.Next', 'button', 'one page on; disabled on the last.'],
	[
		'Pagination.Pages',
		'the numbers',
		'the window: first and last, the page in view with its siblings, and one gap for everything between.',
	],
	[
		'Pagination.Page',
		'button',
		'one number, announced as “page 3” and marked aria-current. Draws its own window when Pages is not what you want.',
	],
	[
		'Pagination.Ellipsis',
		'span',
		'a gap between two numbers: decoration, aria-hidden, not a control.',
	],
	[
		'Pagination.Range',
		'span',
		'what the page holds out of everything — 41–60 of 240, or 3 / 12 when only the count is known.',
	],
];

const hookRows = [
	[
		'data-slot="pagination" · "-prev" · "-next" · "-pages" · "-page" · "-ellipsis" · "-range"',
		'the seven parts',
		'one element each.',
	],
	[
		'data-size',
		'the tier',
		'written on every part from the root, so one attribute says what the whole control is drawn at.',
	],
	[
		'data-active · aria-current="page"',
		'the page in view',
		'the tint the pointer leaves behind, kept, and the one state a reader can hear.',
	],
	[
		'data-disabled',
		'an arrow with nowhere to go',
		'set by the part that knows — the first and last page — and mirrored by the native disabled.',
	],
	[
		'--state-layer-hover-opacity · --state-layer-selected-hover-opacity',
		'the tint',
		'the same two the rest of the library presses with, so a page number and a button feel alike.',
	],
];

export function PaginationPage() {
	return (
		<DocPage
			title="pagination"
			description="which page of the records you are on, and the way on"
		>
			<DocPreview path="src/pages/Pagination/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and there is no Base UI primitive underneath: the window, the
						range and the two ends are arithmetic this component does itself. The page
						is not its state — <Mono>page</Mono> comes in and <Mono>onPageChange</Mono>{' '}
						goes out — which is what lets the same control read from a URL, a store or a
						fetch.
					</>
				}
			>
				<DocInstall
					name="pagination"
					files={files}
					reaches={['src/lib/utils.ts', 'src/lib/control.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the roots and the parts are handed one number: give <Mono>total</Mono> and{' '}
						<Mono>pageSize</Mono> and everything else — the page count, the window, the
						range — is computed from them.
					</>
				}
			>
				<DocUsage snippets={[usageImport, usageExample]} />
			</DocSection>

			<DocSection
				title="when the numbers do not fit"
				note={
					<>
						a narrow footer shows the range instead of the window, and the same control
						comes on the three tiers a Button does. <Mono>Range</Mono> says{' '}
						<Mono>9 / 12</Mono> when only the page count is known — enough to know where
						you are, without pretending to know how many records that is.
					</>
				}
			>
				<DocPreview path="src/pages/Pagination/demos/compact.tsx">
					<Compact />
				</DocPreview>
			</DocSection>

			<DocSection
				title="beside a table"
				note={
					<>
						pagination belongs to the caller of the table too: slice the records, hand
						the count in, and put the control in the footer row, where it reads as part
						of the table and not as a second component under it.
					</>
				}
			>
				<DocPreview path="src/pages/Pagination/demos/with-table.tsx">
					<WithTable />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a window, not a list"
				note={
					<>
						<Mono>Pages</Mono> shows the first and last pages and the page in view with{' '}
						<Mono>siblings</Mono> on each side; everything between is one gap, however
						many pages it hides. A control that listed all forty pages would be a list
						of pages rather than a way through them — and a gap that grew with the data
						would move every number each time a record was added.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					<Mono>Page</Mono> is exported for the cases the window does not cover: a first /
					last pair, a jump to the end, or a page list with your own labelling.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes the numbers; the parts take a class name. every part reads the page from the root, so none of them can be told a page of its own."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Pagination.Root</Mono>
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Pagination.Pages</Mono>
						</p>
						<PropTable props={pagesProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Pagination.Page</Mono> · <Mono>Pagination.Prev</Mono> ·{' '}
							<Mono>Pagination.Next</Mono>
						</p>
						<PropTable props={itemProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Pagination.Range</Mono>
						</p>
						<PropTable props={rangeProps} />
					</div>
					<DocTable head={['part', 'element', 'notes']} mono={[0, 1]} rows={partRows} />
				</div>
			</DocSection>

			<DocSection
				title="styling hooks"
				note="the nav takes className; every part takes one too. The variants object is exported for a control that has to match this one."
			>
				<DocTable head={['hook', 'role', 'notes']} mono={[0]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
