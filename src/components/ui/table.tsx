import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';
import { iconSlot } from '@/lib/control';

/**
 * How a column is sorted, in the words `aria-sort` already uses. `undefined` is a column that
 * cannot be sorted, which is not the same as `none` — one is a fact about the layout, the other is
 * an invitation.
 */
export type TableSort = 'ascending' | 'descending' | 'none';

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
	className,
	children,
	...props
}: RootProps) {
	return (
		<div
			data-slot="table-container"
			data-size={size}
			data-variant={variant}
			data-hoverable={hoverable}
			className={cn(tableVariants({ size, variant }), className)}
		>
			<table
				data-slot="table"
				className="w-full border-separate border-spacing-0 caption-bottom"
				{...props}
			>
				{children}
			</table>
		</div>
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

export type HeadProps = Omit<ComponentProps<'th'>, 'align'> &
	VariantProps<typeof tableCellVariants> & {
		/** Which way this column is sorted by. Left out, it is a column that cannot be sorted. */
		sort?: TableSort;
		/**
		 * What to do about the arrow being pressed. Given, the name becomes a button and the cell
		 * says with `aria-sort` what the arrow is showing.
		 *
		 * Sorting the rows is the caller's: order is a fact about the data, and a table that sorted
		 * what it was handed would be quietly disagreeing with whoever fetched it.
		 */
		onSort?: () => void;
	};

/** The direction the arrow points. Unsorted is a pair of arrows, quiet, so the column still says it can move. */
function SortArrow({ sort }: { sort: TableSort }) {
	if (sort === 'ascending') return <ChevronUp />;
	if (sort === 'descending') return <ChevronDown />;

	return (
		<ChevronsUpDown className="opacity-40 transition-opacity group-hover/sort:opacity-100" />
	);
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
	className,
	children,
	...props
}: HeadProps) {
	const rowHeader = scope === 'row' || scope === 'rowgroup';
	return (
		<th
			scope={scope}
			data-slot="table-head"
			data-align={align}
			data-sort={sort}
			aria-sort={sort ?? (onSort === undefined ? undefined : 'none')}
			className={cn(
				tableCellVariants({ align }),
				'font-medium transition-colors duration-(--duration-state)',
				!rowHeader && 'text-xs text-muted-foreground [thead>tr>&]:hover:bg-table-head-hover',
				'data-[sort=ascending]:text-foreground data-[sort=descending]:text-foreground',
				className,
			)}
			{...props}
		>
			{onSort === undefined ? (
				children
			) : (
				<button
					type="button"
					data-slot="table-sort"
					onClick={onSort}
					className={cn(
						'group/sort relative inline-flex items-center gap-1 rounded-sm',
						'after:absolute after:-inset-x-2 after:-inset-y-1.5',
						'hover:text-foreground',
						iconSlot,
					)}
				>
					{children}
					<SortArrow sort={sort ?? 'none'} />
				</button>
			)}
		</th>
	);
}

export type CellProps = Omit<ComponentProps<'td'>, 'align'> &
	VariantProps<typeof tableCellVariants>;

/** One field of one record. */
export function Cell({ align = 'start', className, ...props }: CellProps) {
	return (
		<td
			data-slot="table-cell"
			data-align={align}
			className={cn(tableCellVariants({ align }), className)}
			{...props}
		/>
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
