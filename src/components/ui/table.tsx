import { ArrowDown, ArrowUp, ArrowUpDown, ListFilter } from 'lucide-react';
import {
	createContext,
	use,
	useMemo,
	useState,
	type ComponentProps,
	type MouseEvent,
	type ReactNode,
} from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';
import { RadioGroup } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { iconSlot } from '@/lib/control';

/**
 * How a column is sorted, in the words `aria-sort` already uses. `undefined` is a column that
 * cannot be sorted, which is not the same as `none` — one is a fact about the layout, the other is
 * an invitation.
 */
export type TableSort = 'ascending' | 'descending' | 'none';

/**
 * The cycle a sortable column walks, and the same list in `Head.sortDirections`. It ends where
 * `aria-sort` has no word for it: the press after the last direction stops sorting, because a
 * reader who has tried both ways wants the order they were given, not the first one again.
 */
const defaultSortDirections: TableSort[] = ['ascending', 'descending'];

/** One line of a filter panel. `text` is what the search box reads when the label is not a string. */
export type TableFilterOption = {
	value: string;
	label: ReactNode;
	text?: string;
	disabled?: boolean;
};

/** What a custom panel is handed: the draft it is editing, and the four things it can do with it. */
export type TableFilterRenderProps = {
	value: string[];
	setValue: (next: string[]) => void;
	/** Write the draft back through `onChange` and close the panel. */
	apply: () => void;
	/** Drop the draft. Nothing is written until `apply`. */
	reset: () => void;
	close: () => void;
};

export type TableFilterProps = {
	options: TableFilterOption[];
	/** The applied answer. An empty list and `null` both mean the column is not filtered. */
	value?: string[] | null;
	/** Called on apply with the draft, or `null` when the draft is empty. */
	onChange?: (next: string[] | null) => void;
	/** `false` offers one value at a time, drawn as radios. */
	multiple?: boolean;
	/** Puts a search box over the options. */
	searchable?: boolean;
	/** Merged onto the popup, for a wider panel or a taller one. */
	className?: string;
	/** Replaces the panel itself. The draft and the actions are handed over. */
	render?: (props: TableFilterRenderProps) => ReactNode;
};

/** The words the table says on its own. Anything left out falls back to English. */
export type TableLocale = {
	sortAscending?: string;
	sortDescending?: string;
	cancelSort?: string;
	filter?: string;
	filterSearch?: string;
	filterReset?: string;
	filterApply?: string;
	filterEmpty?: string;
	loading?: string;
};

const defaultLocale: Required<TableLocale> = {
	sortAscending: 'Sort ascending',
	sortDescending: 'Sort descending',
	cancelSort: 'Clear sorting',
	filter: 'Filter',
	filterSearch: 'Search options',
	filterReset: 'Reset',
	filterApply: 'Apply',
	filterEmpty: 'No options',
	loading: 'Loading',
};

/**
 * Two settings a part cannot be told individually: the cycle a press walks and the words the table
 * speaks. Both are table-wide by nature — a column with its own cycle would make two headers count
 * differently — so they come from the root and a column may still override the cycle.
 */
const TableContext = createContext<{
	sortDirections: TableSort[];
	locale: Required<TableLocale>;
}>({ sortDirections: defaultSortDirections, locale: defaultLocale });

const textOf = (node: ReactNode) =>
	typeof node === 'string' || typeof node === 'number' ? String(node) : undefined;

/**
 * Frameless by default so records can sit inside a Card or panel. Standalone tables can choose
 * an outlined or filled surface; neither adds a grid between the columns.
 *
 * Two measurements, inherited by every part. `--cell-py` and `--cell-px` are the whole density of
 * the table: a head, a cell and the empty state are all inset by them, so the size variant is the
 * only knob and a part added later is drawn at it without being told to be.
 *
 * The border model is `separate` with no spacing rather than `collapse`, because a collapsed border
 * belongs to the table and scrolls with it — a sticky header drawn that way loses its bottom rule
 * the moment it sticks. So the line under a row is drawn by each of its cells instead.
 */
export const tableVariants = tv({
	base: [
		'min-w-0 w-full overflow-auto text-sm',
		'[&>table:has(>tfoot)>tbody>tr:last-child>*]:border-b-0',
	],
	variants: {
		size: {
			sm: '[--cell-px:--spacing(3)] [--cell-py:--spacing(2)]',
			md: '[--cell-px:--spacing(4)] [--cell-py:--spacing(3)]',
			lg: '[--cell-px:--spacing(5)] [--cell-py:--spacing(4)]',
		},
		variant: {
			borderless: '',
			outlined: [
				'rounded-lg border bg-card text-card-foreground [--table-surface:var(--card)]',
				'[&>table>tbody>tr:last-child>*]:border-b-0',
			],
			filled: [
				'rounded-lg bg-muted [--table-surface:var(--muted)]',
				'[&>table>tbody>tr:last-child>*]:border-b-0',
			],
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'borderless',
	},
});

export type RootProps = Omit<ComponentProps<'table'>, 'className'> &
	VariantProps<typeof tableVariants> & {
		/**
		 * Merged last through `cn()`, on the scrolling frame and not on the `<table>` — the frame is
		 * what a caller sizes, rounds and gives the table's height to. Every other prop is the
		 * table's own, so `aria-label` still lands on the element a screen reader reads.
		 */
		className?: string;
		/** Highlight body rows under the pointer without changing selection or sorting. */
		hoverable?: boolean;
		/**
		 * The directions a press on a sortable column walks before it stops sorting. The step after
		 * the last one always clears the column, so a cycle that cannot be left is not offered.
		 */
		sortDirections?: TableSort[];
		/** The words behind the controls the table draws itself: sort hints, the filter panel. */
		locale?: TableLocale;
		/** Cover the records with a spinner while keeping them, and their column names, in place. */
		loading?: boolean;
		/**
		 * `fixed` gives every column the width it was declared, which is what `ellipsis` needs: an
		 * automatic layout decides widths from the content it is asked to cut off.
		 */
		layout?: 'auto' | 'fixed';
	};

/**
 * A table of records. The frame scrolls, so a table wider than its column is read sideways rather
 * than squeezed; the table inside it keeps the semantics, which is the half of this component the
 * browser already knew how to do.
 */
export function Root({
	size = 'md',
	variant = 'borderless',
	hoverable = true,
	loading = false,
	layout = 'auto',
	sortDirections = defaultSortDirections,
	locale,
	className,
	children,
	...props
}: RootProps) {
	const value = useMemo(
		() => ({ sortDirections, locale: { ...defaultLocale, ...locale } }),
		[sortDirections, locale],
	);

	return (
		<TableContext value={value}>
			<div
				data-slot="table-root"
				data-size={size}
				data-variant={variant}
				data-loading={loading ? '' : undefined}
				aria-busy={loading || undefined}
				className="relative min-w-0 w-full"
			>
				<div
					data-slot="table-container"
					data-size={size}
					data-variant={variant}
					data-hoverable={hoverable}
					className={cn(
						tableVariants({ size, variant }),
						layout === 'fixed' && '[&>table]:table-fixed',
						className,
					)}
				>
					<table
						data-slot="table"
						className="w-full border-separate border-spacing-0 caption-bottom"
						{...props}
					>
						{children}
					</table>
				</div>
				{loading && (
					<div
						data-slot="table-loading"
						role="status"
						className={cn(
							'absolute inset-0 z-20 grid place-items-center',
							'bg-background/70 text-muted-foreground',
							variant !== 'borderless' && 'rounded-lg',
						)}
					>
						<span className="inline-flex items-center gap-2 text-sm">
							<Spinner label={null} />
							{value.locale.loading}
						</span>
					</div>
				)}
			</div>
		</TableContext>
	);
}

export type HeaderProps = ComponentProps<'thead'> & {
	/**
	 * Holds the column names in place while the rows pass under them, which is what a table with a
	 * height needs. Supports one header row; grouped headers need their own sticky offsets.
	 */
	sticky?: boolean;
};

/**
 * The band the column names sit in. It is a wash of the text colour over whatever surface the table
 * is on — faint, because it names the columns and is not a record itself — but it is opaque, which
 * is what a sticky header needs when the rows pass under it.
 */
export function Header({ sticky = false, className, ...props }: HeaderProps) {
	return (
		<thead
			data-slot="table-header"
			data-sticky={sticky ? '' : undefined}
			className={cn(
				'[&>tr>th]:bg-table-head',
				sticky && '[&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-10',
				className,
			)}
			{...props}
		/>
	);
}

export type BodyProps = ComponentProps<'tbody'>;

/** The records. */
export function Body({ className, ...props }: BodyProps) {
	return <tbody data-slot="table-body" className={className} {...props} />;
}

export type FooterProps = ComponentProps<'tfoot'>;

/**
 * A line of totals under the records. It wears the header's band, because it is the same kind of
 * row: one that is not a record. Being the same colour as one would leave a reader counting it.
 */
export function Footer({ className, ...props }: FooterProps) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				'bg-table-head font-medium [&>tr:first-child>*]:border-t [&>tr:last-child>*]:border-b-0',
				className,
			)}
			{...props}
		/>
	);
}

/**
 * Two fills, and they are not the same fill. The pointer leaves a wash of the text colour, gone a
 * frame after it passes; a chosen row leaves a tint of `primary`, which in this theme is also a
 * near-black and so has to be mixed a step stronger to still be there once the pointer has left.
 */
export const tableRowVariants = tv({
	base: [
		'transition-colors duration-(--duration-state)',
		'[[data-slot=table-container][data-hoverable=true]>table>tbody>&]:hover:bg-row-hover',
		'[tbody>&]:data-selected:bg-row-selected',
		'[[data-slot=table-container][data-hoverable=true]>table>tbody>&]:data-selected:hover:bg-row-selected-hover',
		// A row that cannot be acted on is out of the way rather than hidden: the records around it
		// are still true, so it keeps its place and its text, and loses its answers.
		'data-disabled:pointer-events-none data-disabled:opacity-50',
	],
});

export type RowProps = ComponentProps<'tr'>;

/** One record. */
export function Row({ className, ...props }: RowProps) {
	return <tr data-slot="table-row" className={cn(tableRowVariants(), className)} {...props} />;
}

/**
 * What every column is drawn with: the inset, the rule under it, and which edge its text is set
 * from. A header and a cell are the same box — one names the column and one fills it — so both are
 * built from this, and a column set from the end reads as one line from its name to its last figure.
 *
 * Figures are tabular everywhere, not only in a column set from the end, because the digits in a
 * cell are usually being compared with the digits in the cell above it.
 */
export const tableCellVariants = tv({
	base: ['border-b px-(--cell-px) py-(--cell-py) align-middle whitespace-nowrap tabular-nums'],
	variants: {
		align: {
			start: 'text-start',
			center: 'text-center',
			end: 'text-end',
		},
	},
	defaultVariants: {
		align: 'start',
	},
});

/** One line, cut off at the column's width. `--cell-max-w` is how far a column may run. */
const ellipsisCell = 'max-w-[var(--cell-max-w,15rem)] overflow-hidden text-ellipsis';

/**
 * A control in a column title: one 24px square holding one glyph, tinted while the pointer is on it
 * and tinted again, kept, while its column is sorted or filtered. The sort arrow and the filter icon
 * are the same control, so a reader learns one shape and reads both.
 *
 * The tint is painted on the square; the pointer is taken from a wider invisible box, so a header can
 * hold two of these a gap apart without their targets merging.
 */
const headControl = cn(
	'relative inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm',
	'text-muted-foreground transition-colors duration-(--duration-state)',
	'hover:bg-row-hover hover:text-foreground',
	'data-active:bg-row-hover',
	'before:absolute before:-inset-1.5',
);

const filterOptionClass = cn(
	'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none',
	'has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50',
	'hover:bg-row-hover',
);

/**
 * The panel behind a header's filter icon. It edits a draft, because a list of checkboxes that took
 * effect on every press would refetch the table for each one — the reader picks, then says so.
 */
function FilterPanel({
	filter,
	locale,
	label,
	onClose,
}: {
	filter: TableFilterProps;
	locale: Required<TableLocale>;
	label?: string;
	onClose: () => void;
}) {
	const { options, multiple = true, searchable = false, render } = filter;
	const [draft, setDraft] = useState<string[]>(filter.value ?? []);
	const [query, setQuery] = useState('');

	const needle = query.trim().toLowerCase();
	const visible =
		needle.length === 0
			? options
			: options.filter((option) =>
					(option.text ?? textOf(option.label) ?? option.value)
						.toLowerCase()
						.includes(needle),
				);

	const toggle = (value: string, on: boolean) =>
		setDraft((was) =>
			on
				? [...was.filter((one) => one !== value), value]
				: was.filter((one) => one !== value),
		);
	const apply = () => {
		filter.onChange?.(draft.length === 0 ? null : draft);
		onClose();
	};
	const reset = () => setDraft([]);

	if (render !== undefined) {
		return <>{render({ value: draft, setValue: setDraft, apply, reset, close: onClose })}</>;
	}

	const nameOf = (option: TableFilterOption) =>
		option.text ?? textOf(option.label) ?? option.value;

	const optionRow = (option: TableFilterOption) => {
		const name = nameOf(option);
		return (
			<label
				key={option.value}
				className={filterOptionClass}
				data-disabled={option.disabled ? '' : undefined}
			>
				{multiple ? (
					<Checkbox.Root
						aria-label={name}
						checked={draft.includes(option.value)}
						disabled={option.disabled}
						onCheckedChange={(next) => toggle(option.value, next === true)}
					>
						<Checkbox.Indicator />
					</Checkbox.Root>
				) : (
					<RadioGroup.Item aria-label={name} value={option.value}>
						<RadioGroup.Indicator />
					</RadioGroup.Item>
				)}
				<span className="min-w-0 truncate">{option.label}</span>
			</label>
		);
	};

	return (
		<div data-slot="table-filter-panel" className="flex max-h-80 flex-col">
			{searchable && (
				<div className="border-b p-2">
					<Input
						size="sm"
						value={query}
						aria-label={
							label === undefined
								? locale.filterSearch
								: `${locale.filterSearch} ${label}`
						}
						placeholder={locale.filterSearch}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</div>
			)}
			<div className="min-h-0 flex-1 overflow-auto p-1">
				{visible.length === 0 ? (
					<p className="px-2 py-6 text-center text-sm text-muted-foreground">
						{locale.filterEmpty}
					</p>
				) : multiple ? (
					visible.map(optionRow)
				) : (
					<RadioGroup.Root
						className="gap-0"
						value={draft[0] ?? null}
						onValueChange={(next) => setDraft(next == null ? [] : [String(next)])}
					>
						{visible.map(optionRow)}
					</RadioGroup.Root>
				)}
			</div>
			<div className="flex items-center justify-end gap-2 border-t p-2">
				<Button variant="ghost" size="sm" disabled={draft.length === 0} onClick={reset}>
					{locale.filterReset}
				</Button>
				<Button size="sm" onClick={apply}>
					{locale.filterApply}
				</Button>
			</div>
		</div>
	);
}

/**
 * The filter icon in a column's title, and the popup it opens. It is tinted while the column is
 * filtered, which is the only sign of an applied filter once the panel is closed.
 */
function FilterControl({
	filter,
	locale,
	label,
}: {
	filter: TableFilterProps;
	locale: Required<TableLocale>;
	label?: string;
}) {
	const [open, setOpen] = useState(false);
	const active = (filter.value?.length ?? 0) > 0;

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger
				data-slot="table-filter"
				data-active={active ? '' : undefined}
				aria-label={label === undefined ? locale.filter : `${locale.filter} ${label}`}
				className={cn(headControl, 'data-active:text-primary', iconSlot)}
			>
				<ListFilter />
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner sideOffset={6} align="end">
					<Popover.Popup className={cn('w-60 p-0', filter.className)}>
						<FilterPanel
							filter={filter}
							locale={locale}
							label={label}
							onClose={() => setOpen(false)}
						/>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}

export type HeadProps = Omit<ComponentProps<'th'>, 'align'> &
	VariantProps<typeof tableCellVariants> & {
		/** Which way this column is sorted by. Left out, it is a column that cannot be sorted. */
		sort?: TableSort;
		/**
		 * What to do about the arrow being pressed. Given, the name becomes a button and the cell
		 * says with `aria-sort` what the arrow is showing.
		 *
		 * The next state is handed over rather than asked for: the cycle ends in "stop sorting", and
		 * a column that only reported "pressed" would leave every caller to write that step again.
		 * Ordering the rows is still the caller's — a table that sorted what it was handed would be
		 * quietly disagreeing with whoever fetched it.
		 */
		onSort?: (next: TableSort | undefined) => void;
		/** This column's own cycle. The step after the last direction clears the column. */
		sortDirections?: TableSort[];
		/** A filter panel behind an icon beside the title. */
		filter?: TableFilterProps;
		/** Cut the title off at the column's width, and keep the whole of it in `title`. */
		ellipsis?: boolean | { showTitle?: boolean };
	};

/** The direction the arrow points. Unsorted is the two-headed one, quiet, so the column still says it can move. */
function SortArrow({ sort }: { sort: TableSort }) {
	if (sort === 'ascending') return <ArrowUp />;
	if (sort === 'descending') return <ArrowDown />;

	return <ArrowUpDown className="opacity-40 transition-opacity group-hover/sort:opacity-100" />;
}

/** The state a press leads to, including the `undefined` that means "and now not at all". */
function nextSort(directions: TableSort[], current: TableSort): TableSort | undefined {
	const index = directions.indexOf(current);
	return directions[index + 1];
}

/**
 * A column title is quieter than its data; a row title (`scope="row"`) keeps the body's size and
 * colour. A sortable title becomes a button and announces its direction on the enclosing cell.
 */
export function Head({
	align = 'start',
	scope = 'col',
	sort,
	onSort,
	sortDirections,
	filter,
	ellipsis = false,
	title,
	onClick,
	className,
	children,
	...props
}: HeadProps) {
	const table = use(TableContext);
	const rowHeader = scope === 'row' || scope === 'rowgroup';
	const current = sort ?? 'none';
	const next = nextSort(sortDirections ?? table.sortDirections, current);
	const hint =
		next === 'ascending'
			? table.locale.sortAscending
			: next === 'descending'
				? table.locale.sortDescending
				: table.locale.cancelSort;
	const label = textOf(children);
	const showTitle = typeof ellipsis === 'object' ? ellipsis.showTitle !== false : true;
	const filtered = (filter?.value?.length ?? 0) > 0;
	const sorted = sort === 'ascending' || sort === 'descending';

	const sortable = onSort !== undefined;
	// The cell is the pointer's target, as it is in antd and in lobe: a title is easier to hit than
	// a 24px arrow. It is not the keyboard's — the arrow button is, and it carries the same press
	// with a name. A press that lands on a control of its own, or that a caller has already handled,
	// is left alone, so nothing here fires twice.
	const pressCell = (event: MouseEvent<HTMLTableCellElement>) => {
		onClick?.(event);
		if (!sortable || event.defaultPrevented) return;
		if ((event.target as Element).closest('button, a, input, select, textarea')) return;
		onSort(next);
	};

	const sortButton =
		onSort === undefined ? null : (
			<button
				type="button"
				data-slot="table-sort"
				data-active={sorted ? '' : undefined}
				aria-label={label === undefined ? hint : `${hint} ${label}`}
				title={hint}
				onClick={() => onSort(next)}
				className={cn(headControl, 'group/sort data-active:text-foreground', iconSlot)}
			>
				<SortArrow sort={current} />
			</button>
		);

	return (
		<th
			scope={scope}
			data-slot="table-head"
			data-align={align}
			data-sort={sort}
			data-filtered={filtered ? '' : undefined}
			aria-sort={sort ?? (onSort === undefined ? undefined : 'none')}
			title={title ?? (ellipsis && showTitle ? label : undefined)}
			onClick={sortable || onClick !== undefined ? pressCell : undefined}
			className={cn(
				tableCellVariants({ align }),
				ellipsis && ellipsisCell,
				'font-medium transition-colors duration-(--duration-state)',
				!rowHeader &&
					'text-xs text-muted-foreground [thead>tr>&]:hover:bg-table-head-hover',
				'data-[sort=ascending]:text-foreground data-[sort=descending]:text-foreground',
				// The band runs down the column, so it starts here, opaque: a sticky header may not show
				// the records that pass under it.
				'data-[sort=ascending]:bg-table-head-hover data-[sort=descending]:bg-table-head-hover',
				sortable && 'cursor-pointer select-none',
				className,
			)}
			{...props}
		>
			{onSort === undefined && filter === undefined ? (
				children
			) : (
				<span
					data-slot="table-head-controls"
					className="inline-flex max-w-full min-w-0 items-center gap-1.5"
				>
					<span className="min-w-0 truncate">{children}</span>
					{sortButton}
					{filter !== undefined && (
						<FilterControl filter={filter} locale={table.locale} label={label} />
					)}
				</span>
			)}
		</th>
	);
}

export type CellProps = Omit<ComponentProps<'td'>, 'align'> &
	VariantProps<typeof tableCellVariants> & {
		/** Cut the cell off at the column's width, and keep the whole of it in `title`. */
		ellipsis?: boolean | { showTitle?: boolean };
		/**
		 * The direction its column is displayed in, as `Table.Head` was told. A sorted column shades its
		 * cells, so it reads as one band from the header down; `none` shades nothing.
		 */
		sort?: TableSort;
	};

/** One field of one record. */
export function Cell({
	align = 'start',
	ellipsis = false,
	sort,
	title,
	className,
	children,
	...props
}: CellProps) {
	const showTitle = typeof ellipsis === 'object' ? ellipsis.showTitle !== false : true;

	return (
		<td
			data-slot="table-cell"
			data-align={align}
			data-sort={sort}
			data-ellipsis={ellipsis ? '' : undefined}
			title={title ?? (ellipsis && showTitle ? textOf(children) : undefined)}
			className={cn(
				tableCellVariants({ align }),
				ellipsis && ellipsisCell,
				// The band the header starts, carried down the column.
				'data-[sort=ascending]:bg-column-sorted data-[sort=descending]:bg-column-sorted',
				className,
			)}
			{...props}
		>
			{children}
		</td>
	);
}

export type EmptyProps = Omit<ComponentProps<'td'>, 'colSpan'> & {
	/** How many columns the row has to reach across to be the width of the table. */
	columns: number;
	/** A glyph over the sentence. Sized from the text around it, like every other slot. */
	icon?: ReactNode;
};

/**
 * The row a table shows when it has none. It is a row rather than a floating box, so it keeps the
 * columns — a table that emptied itself into a paragraph would take the header away from the reader
 * at the moment they most want to know what was supposed to be there.
 */
export function Empty({ columns, icon, className, children, ...props }: EmptyProps) {
	return (
		<tr data-slot="table-empty">
			<td
				data-slot="table-empty-cell"
				colSpan={columns}
				className={cn(
					'border-b px-(--cell-px) py-12 text-center text-muted-foreground',
					className,
				)}
				{...props}
			>
				<div
					data-slot="table-empty-content"
					className="mx-auto flex max-w-sm flex-col items-center gap-2"
				>
					{icon !== undefined && (
						<span
							data-slot="table-empty-icon"
							className={cn('text-2xl', iconSlot)}
							aria-hidden
						>
							{icon}
						</span>
					)}
					{children}
				</div>
			</td>
		</tr>
	);
}

export type CaptionProps = ComponentProps<'caption'>;

/** What the table is, for a reader who has not been told by the page around it. */
export function Caption({ className, ...props }: CaptionProps) {
	return (
		<caption
			data-slot="table-caption"
			className={cn('px-(--cell-px) py-(--cell-py) text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

/** Records, in columns: the box that scrolls, the names across the top, and the rows under them. */
export const Table = {
	Root,
	Header,
	Body,
	Footer,
	Row,
	Head,
	Cell,
	Caption,
	Empty,
};
