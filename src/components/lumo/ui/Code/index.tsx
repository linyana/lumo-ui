/* oxlint-disable react/no-array-index-key -- a line of code is identified by its position, which is also its number */
import { Fragment, type ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Copy } from '@/components/lumo/ui/Code/Copy';
import { Header } from '@/components/lumo/ui/Code/Header';
import { Tokens } from '@/components/lumo/ui/Code/Tokens';
import { useCodeLines } from '@/components/lumo/ui/Code/useCodeLines';
import { cn } from '@/lib/cn';

export const codeVariants = tv({
	base: ['w-full overflow-hidden rounded-lg font-mono text-sm leading-5'],
	variants: {
		variant: {
			filled: 'bg-muted',
			outlined: 'border bg-background',
			ghost: 'bg-transparent',
		},
	},
	defaultVariants: {
		variant: 'outlined',
	},
});

export type CodeProps = Omit<ComponentProps<'div'>, 'children'> &
	VariantProps<typeof codeVariants> & {
		code: string;
		/** Grammar to highlight with. Anything we do not ship falls back to plain text. */
		language?: string;
		/** Shown in the header instead of the language. */
		fileName?: string;
		showLineNumbers?: boolean;
		/** Wrap long lines instead of scrolling them sideways. */
		wrap?: boolean;
		copyable?: boolean;
	};

/** A block of source, highlighted, with a header saying what it is and a button to take it. */
export function Code({
	code,
	language,
	fileName,
	variant = 'outlined',
	showLineNumbers = false,
	wrap = false,
	copyable = true,
	className,
	...props
}: CodeProps) {
	const lines = useCodeLines(code, language);
	const title = fileName ?? language ?? 'code';
	const showHeader = copyable || fileName !== undefined || language !== undefined;
	// Without line numbers the text is the only column. With them the number column is
	// `max-content`, so it takes exactly its widest number and no share of the leftover space;
	// wrapped text needs `minmax(0,1fr)` to fold instead of overflow.
	const columns = !showLineNumbers
		? 'grid-cols-1'
		: wrap
			? 'grid-cols-[max-content_minmax(0,1fr)]'
			: 'grid-cols-[max-content_auto]';

	return (
		<div
			data-slot="code"
			data-variant={variant}
			className={cn(codeVariants({ variant }), className)}
			{...props}
		>
			{showHeader && (
				<Header
					className={variant === 'ghost' ? 'border-b-0' : undefined}
					actions={copyable ? <Copy value={code} /> : null}
				>
					<span data-slot="code-title" className="truncate font-medium">
						{title}
					</span>
					{fileName !== undefined && language !== undefined && (
						<span data-slot="code-language" className="truncate text-muted-foreground">
							{language}
						</span>
					)}
				</Header>
			)}
			<pre data-slot="code-body" className="overflow-auto py-3">
				<code
					className={cn(
						'grid',
						columns,
						wrap ? 'w-full' : 'w-fit min-w-full',
						!showLineNumbers && 'pl-4',
					)}
				>
					{lines.map((line, index) => (
						<Fragment key={index}>
							{showLineNumbers && (
								<span
									data-slot="code-line-number"
									className="pr-2 pl-3 text-right text-muted-foreground select-none"
								>
									{index + 1}
								</span>
							)}
							<span
								data-slot="code-line"
								className={cn(
									'pr-4',
									wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
								)}
							>
								{line.length === 0 ? '\u200B' : <Tokens line={line} />}
							</span>
						</Fragment>
					))}
				</code>
			</pre>
		</div>
	);
}
