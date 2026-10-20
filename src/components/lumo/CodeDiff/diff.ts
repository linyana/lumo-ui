import { diffLines } from 'diff';

export type DiffKind = 'context' | 'add' | 'delete';

export type DiffLine = {
	kind: DiffKind;
	text: string;
	/** 0-based position in the old file, absent where this line has no old side. */
	old?: number;
	/** 0-based position in the new file, absent where this line has no new side. */
	new?: number;
};

/** One row of the side-by-side view: what the old file had on the left, the new one on the right. */
export type DiffRow = {
	left?: DiffLine;
	right?: DiffLine;
};

export type Diff = {
	lines: DiffLine[];
	rows: DiffRow[];
	additions: number;
	deletions: number;
};

/** Splits a chunk of diff output, dropping only the empty string that a trailing newline leaves. */
function splitLines(value: string): string[] {
	const lines = value.split('\n');
	if (lines.at(-1) === '') lines.pop();
	return lines;
}

/**
 * Pairs the run of removed and added lines between two unchanged ones, so the two files read
 * side by side. A change is not always one-for-one — whichever side runs out ends blank.
 */
function pair(lines: DiffLine[]): DiffRow[] {
	const rows: DiffRow[] = [];
	let index = 0;

	while (index < lines.length) {
		const line = lines[index]!;
		if (line.kind === 'context') {
			rows.push({ left: line, right: line });
			index += 1;
			continue;
		}

		const removed: DiffLine[] = [];
		const added: DiffLine[] = [];
		while (index < lines.length && lines[index]!.kind !== 'context') {
			const changed = lines[index]!;
			(changed.kind === 'delete' ? removed : added).push(changed);
			index += 1;
		}

		for (let at = 0; at < Math.max(removed.length, added.length); at += 1) {
			rows.push({ left: removed[at], right: added[at] });
		}
	}

	return rows;
}

/** Line diff of two files, counted and, for the split view, paired into rows. */
export function diffContent(oldContent: string, newContent: string): Diff {
	const lines: DiffLine[] = [];
	let oldIndex = 0;
	let newIndex = 0;
	let additions = 0;
	let deletions = 0;

	for (const change of diffLines(oldContent, newContent, { ignoreNewlineAtEof: true })) {
		for (const text of splitLines(change.value)) {
			if (change.added) {
				lines.push({ kind: 'add', new: newIndex, text });
				newIndex += 1;
				additions += 1;
			} else if (change.removed) {
				lines.push({ kind: 'delete', old: oldIndex, text });
				oldIndex += 1;
				deletions += 1;
			} else {
				lines.push({ kind: 'context', old: oldIndex, new: newIndex, text });
				oldIndex += 1;
				newIndex += 1;
			}
		}
	}

	return { lines, rows: pair(lines), additions, deletions };
}
