/**
 * The source behind a preview, and the files it is made of.
 *
 * The text arrives on demand: a page hands over a path, not a string, so a demo's source is only
 * fetched when somebody opens it — and the page it belongs to carries none of it.
 *
 * The shape of the tree is not read off the code. It is `registry.json`, the manifest the CLI
 * installs from: an item's files, then everything its `registryDependencies` copy. So what the
 * dialog draws is exactly what a reader would get, and an import the manifest forgets is caught by
 * `scripts/check-registry.ts` rather than quietly shown as a file that is never copied.
 */
import registry from '../../../registry.json';

/** Every module in the docs app is available as text, but only to the dialog that asks for one. */
const modules = import.meta.glob('/src/**/*.{ts,tsx,css}', {
	query: '?raw',
	import: 'default',
}) as Record<string, () => Promise<string>>;

type Item = {
	name: string;
	files?: Array<{ path: string }>;
	registryDependencies?: string[];
};

const items = new Map((registry.items as Item[]).map((item) => [item.name, item]));

/** A dependency is written the way the CLI takes it: `linyana/lumo-ui/<name>`. */
const DEPENDENCY_PREFIX = 'linyana/lumo-ui/';

/** `CodeTree` → `code-tree`: a page and an item are spelled the same way, by the same rule. */
function kebab(name: string) {
	return name.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * The files an item installs: its own, then everything its dependencies bring, breadth-first — the
 * order the CLI copies in. Nothing here needs a depth limit, because the manifest is the whole
 * graph; a dependency cycle would be a broken manifest and is reported by the check.
 */
export function filesOf(name: string | undefined): string[] {
	if (name === undefined) return [];

	const files: string[] = [];
	const seen = new Set<string>();
	const queue = [name];

	while (queue.length > 0) {
		const current = queue.shift()!;
		if (seen.has(current)) continue;
		seen.add(current);

		const item = items.get(current);
		if (item === undefined) continue;
		for (const file of item.files ?? []) files.push(file.path);
		for (const dependency of item.registryDependencies ?? []) {
			queue.push(dependency.slice(DEPENDENCY_PREFIX.length));
		}
	}

	return files;
}

/**
 * The item a demo belongs to, read off where the demo lives: a page is named after the component it
 * documents, so `src/pages/CodeTree/…` is `code-tree`. A page with no such item — the overview —
 * gets no tree rather than a wrong one.
 */
export function itemOf(path: string): string | undefined {
	const [page] = path.replace(/^\/?src\/pages\//, '').split('/');
	const name = page === undefined ? '' : kebab(page);
	return items.has(name) ? name : undefined;
}

/** The source at `path`, or `undefined` for a module the app does not carry. */
export async function readSource(path: string) {
	const key = path.startsWith('/') ? path : `/${path}`;
	return modules[key]?.();
}

/** The grammar for a file, by its extension. */
export function languageOf(path: string) {
	return path.slice(path.lastIndexOf('.') + 1);
}
