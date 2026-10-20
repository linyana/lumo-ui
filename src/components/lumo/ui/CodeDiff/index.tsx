/* oxlint-disable react/no-array-index-key -- diff rows are a fixed sequence: a row's identity is its position */
import { Fragment, useMemo, type ComponentProps } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { Copy } from '@/components/lumo/ui/Code/Copy';
import { Header } from '@/components/lumo/ui/Code/Header';
import { Tokens } from '@/components/lumo/ui/Code/Tokens';
import { codeVariants } from '@/components/lumo/ui/Code';
import { useCodeLines } from '@/components/lumo/ui/Code/useCodeLines';
import { diffContent, type DiffKind, type DiffLine } from '@/components/lumo/ui/CodeDiff/diff';
import type { CodeLine } from '@/lib/shiki';
import { cn } from '@/lib/cn';

const tone = (kind: DiffKind | undefined) =>
	kind === 'add' ? 'bg-success/10' : kind === 'delete' ? 'bg-destructive/10' : undefined;

const edge = (kind: DiffKind | undefined) =>
	kind === 'add'
		? 'border-success'
		: kind === 'delete'
			? 'border-destructive'
			: 'border-transparent';

type GutterProps = {
	line?: DiffLine;
	/** Which file's numbering this column shows — the same line carries both. */
	side: 'old' | 'new';
};

/** The number column of one side, with the stripe that marks a change on that side. */
function Gutter({ line, side }: GutterProps) {
	const kind = line?.kind;
	const number = side === 'old' ? line?.old : line?.new;

	return (
		<span
			data-slot="code-diff-gutter"
			className={cn(
				'border-l-2 pr-2 pl-3 text-right tabular-nums select-none',
				'text-muted-foreground',
				edge(kind),
				line === undefined ? 'bg-muted/50' : tone(kind),
			)}
		>
			{number === undefined ? '\u200B' : number + 1}
		</span>
	);
}

type ContentProps = {
	line?: DiffLine;
	tokens: CodeLine;
	/** Draws the change sign in its own column, for the stacked view. */
	sign?: boolean;
};

/** One side of a row: the text, plus the sign column when the view stacks the two files. */
function Content({ line, tokens, sign = false }: ContentProps) {
	// A side this line does not exist on keeps the column's shape with a filled, empty cell.
	const background = line === undefined ? 'bg-muted/50' : tone(line.kind);

	return (
		<>
			{sign && (
				<span
					data-slot="code-diff-sign"
					className={cn('w-4 text-center select-none', background)}
				>
					{line?.kind === 'add' ? '+' : line?.kind === 'delete' ? '−' : ''}
				</span>
			)}
			<span data-slot="code-diff-line" className={cn('px-2 whitespace-pre', background)}>
				{line === undefined ? (
					''
				) : tokens.length === 0 ? (
					'\u200B'
				) : (
					<Tokens line={tokens} />
				)}
			</span>
		</>
	);
}

export type CodeDiffProps = Omit<ComponentProps<'div'>, 'children'> &
	VariantProps<typeof codeVariants> & {
		oldContent: string;
		newContent: string;
		language?: string;
		/** Shown in the header instead of the language. */
		fileName?: string;
		view?: 'split' | 'unified';
		copyable?: boolean;
	};

/** Two revisions of one file, side by side or stacked, with the changes counted in the header. */
export function CodeDiff({
	oldContent,
	newContent,
	language,
	fileName,
	view = 'split',
	copyable = true,
	variant = 'outlined',
	className,
	...props
}: CodeDiffProps) {
	const { rows, lines, additions, deletions } = useMemo(
		() => diffContent(oldContent, newContent),
		[oldContent, newContent],
	);
	const oldTokens = useCodeLines(oldContent, language);
	const newTokens = useCodeLines(newContent, language);

	const tokensAt = (source: CodeLine[], index: number | undefined) =>
		index === undefined ? [] : (source[index] ?? []);

	const title = fileName ?? language ?? 'diff';
	const showHeader = copyable || fileName !== undefined || language !== undefined;

	return (
		<div
			data-slot="code-diff"
			data-variant={variant}
			data-view={view}
			className={cn(codeVariants({ variant }), className)}
			{...props}
		>
			{showHeader && (
				<Header
					className={variant === 'ghost' ? 'border-b-0' : undefined}
					actions={copyable ? <Copy value={newContent} /> : null}
				>
					<span data-slot="code-diff-title" className="truncate font-medium">
						{title}
					</span>
					<span
						data-slot="code-diff-additions"
						className="shrink-0 tabular-nums text-success"
					>
						+{additions}
					</span>
					<span
						data-slot="code-diff-deletions"
						className="shrink-0 tabular-nums text-destructive"
					>
						−{deletions}
					</span>
				</Header>
			)}
			<div
				data-slot="code-diff-body"
				className={cn(
					'grid overflow-auto py-3',
					view === 'split'
						? 'w-fit min-w-full grid-cols-[max-content_auto_max-content_auto]'
						: 'w-fit min-w-full grid-cols-[max-content_max-content_max-content_auto]',
				)}
			>
				{view === 'split'
					? rows.map((row, index) => (
							<Fragment key={index}>
								<Gutter line={row.left} side="old" />
								<Content
									line={row.left}
									tokens={tokensAt(oldTokens, row.left?.old)}
								/>
								<Gutter line={row.right} side="new" />
								<Content
									line={row.right}
									tokens={tokensAt(newTokens, row.right?.new)}
								/>
							</Fragment>
						))
					: lines.map((line, index) => (
							<Fragment key={index}>
								<Gutter line={line} side="old" />
								<Gutter line={line} side="new" />
								<Content
									line={line}
									sign
									tokens={tokensAt(
										line.kind === 'delete' ? oldTokens : newTokens,
										line.kind === 'delete' ? line.old : line.new,
									)}
								/>
							</Fragment>
						))}
			</div>
		</div>
	);
}
