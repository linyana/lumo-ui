/* oxlint-disable react/no-array-index-key -- a token is identified by where it sits in the line, and nothing else */
import type { CSSProperties } from 'react';
import type { CodeLine } from '@/lib/shiki';
import { cn } from '@/lib/cn';

export type TokensProps = {
	line: CodeLine;
};

/**
 * One highlighted line. Colour arrives as two custom properties and is chosen by the `dark`
 * variant rather than by JS, so switching themes repaints without re-tokenising anything.
 */
export function Tokens({ line }: TokensProps) {
	return line.map((token, index) => (
		<span
			key={index}
			data-slot="code-token"
			className={cn(
				token.light && token.dark && 'text-(--code-light) dark:text-(--code-dark)',
				token.italic && 'italic',
				token.bold && 'font-bold',
				token.underline && 'underline',
			)}
			style={
				{
					'--code-light': token.light,
					'--code-dark': token.dark,
				} as CSSProperties
			}
		>
			{token.content}
		</span>
	));
}
