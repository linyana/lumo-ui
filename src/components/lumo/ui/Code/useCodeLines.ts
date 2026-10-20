import { useEffect, useMemo, useState } from 'react';
import { highlight, type CodeLine } from '@/lib/shiki';

type Result = { source: string; language: string | undefined; lines: CodeLine[] };

/** The code as plain, unstyled lines — what shows before the grammar arrives, and if it fails. */
function plain(code: string): CodeLine[] {
	return code.split('\n').map((line) => (line === '' ? [] : [{ content: line }]));
}

/**
 * Highlighted lines for `code`. The result is tagged with what produced it, so a change of
 * `code` shows plain text for a frame instead of the previous block's colours.
 */
export function useCodeLines(code: string, language?: string): CodeLine[] {
	const [result, setResult] = useState<Result | null>(null);

	useEffect(() => {
		let live = true;
		highlight(code, language).then(
			(lines) => {
				if (live) setResult({ source: code, language, lines });
			},
			() => {},
		);
		return () => {
			live = false;
		};
	}, [code, language]);

	return useMemo(
		() =>
			result?.source === code && result.language === language ? result.lines : plain(code),
		[code, language, result],
	);
}
