/**
 * The source behind a preview, and the files it reaches for.
 *
 * Every module in the docs app is available as text, but on demand: a page hands over a path, not a
 * string, so a demo's source is only fetched when somebody opens it — and the page it belongs to
 * carries none of it.
 */
const modules = import.meta.glob('/src/**/*.{ts,tsx,css}', {
	query: '?raw',
	import: 'default',
}) as Record<string, () => Promise<string>>;

/** How deep a tree is followed, and how many siblings one file may bring with it. */
const DEPTH = 3;
const WIDTH = 12;

export type SourceFile = {
	/** The module path, `src/…` — what the dialog loads and what a row is keyed by. */
	path: string;
	/** The file's own name, which is what a row shows. */
	name: string;
	children: SourceFile[];
};

/** `@/lib/cn` → `/src/lib/cn.tsx | /src/lib/cn.ts | …`, whichever the app actually has. */
function resolve(specifier: string) {
	const base = `/src/${specifier.slice(2)}`;
	for (const candidate of [
		`${base}.tsx`,
		`${base}.ts`,
		`${base}/index.tsx`,
		`${base}/index.ts`,
	]) {
		if (candidate in modules) return candidate;
	}
	return undefined;
}

/** The app's own imports, in the order they appear. Packages are not part of the tree. */
function importsOf(source: string) {
	const found: string[] = [];
	for (const match of source.matchAll(/(?:from|import)\s+['"](@\/[^'"]+)['"]/g)) {
		const target = resolve(match[1] ?? '');
		if (target !== undefined && !found.includes(target)) found.push(target);
	}
	return found;
}

/** The source at `path`, or `undefined` for a module the app does not carry. */
export async function readSource(path: string) {
	const key = path.startsWith('/') ? path : `/${path}`;
	return modules[key]?.();
}

/**
 * `path` and everything it imports, walked breadth-first so a shared file appears once — under the
 * first thing that reached it, which is also the shortest way to it.
 */
export async function readTree(path: string): Promise<SourceFile> {
	const root: SourceFile = { path, name: nameOf(path), children: [] };
	const seen = new Set([path.startsWith('/') ? path : `/${path}`]);
	const queue: Array<{ node: SourceFile; level: number }> = [{ node: root, level: 0 }];

	while (queue.length > 0) {
		const { node, level } = queue.shift()!;
		if (level >= DEPTH) continue;

		const source = await readSource(node.path);
		if (source === undefined) continue;

		for (const target of importsOf(source).slice(0, WIDTH)) {
			if (seen.has(target)) continue;
			seen.add(target);

			const next: SourceFile = {
				path: target.replace(/^\//, ''),
				name: nameOf(target),
				children: [],
			};
			node.children.push(next);
			queue.push({ node: next, level: level + 1 });
		}
	}

	return root;
}

function nameOf(path: string) {
	return path.slice(path.lastIndexOf('/') + 1);
}

/** The grammar for a file, by its extension. */
export function languageOf(path: string) {
	return path.slice(path.lastIndexOf('.') + 1);
}
