/**
 * The files a thing is made of, in the shape of the repository.
 *
 * Flat paths in, folders out: a folder exists here exactly when one of the paths lives in it, so
 * the tree can never claim a directory nobody handed over. Nothing here draws anything — the
 * component that does is `Menu`, and this is only what it is handed.
 */

export type CodeTreeNode =
	| { kind: 'folder'; name: string; path: string; children: CodeTreeNode[] }
	| { kind: 'file'; name: string; path: string };

/** A path as the tree reads it: no leading separator and no `./`, so two spellings of one file
 *  are one row. */
export function normalPath(path: string) {
	return path.replace(/^\.\//, '').replace(/^\/+/, '');
}

type Branch = { name: string; path: string; folders: Map<string, Branch>; files: CodeTreeNode[] };

/** Every folder a set of files lives in, each one named by the path `treeOf` gives the same folder. */
export function foldersOf(paths: Iterable<string>): Set<string> {
	const folders = new Set<string>();

	for (const path of paths) {
		const segments = normalPath(path).split('/').slice(0, -1);
		for (let depth = 1; depth <= segments.length; depth += 1) {
			folders.add(segments.slice(0, depth).join('/'));
		}
	}

	return folders;
}

/** Folders before files, each by name, with numbers read as numbers rather than as digits. */
function order(nodes: CodeTreeNode[]): CodeTreeNode[] {
	return nodes.sort((a, b) =>
		a.kind === b.kind
			? a.name.localeCompare(b.name, undefined, { numeric: true })
			: a.kind === 'folder'
				? -1
				: 1,
	);
}

/** Flat paths as the shape a person reads a project in. A path that repeats is drawn once. */
export function treeOf(paths: string[]): CodeTreeNode[] {
	const root: Branch = { name: '', path: '', folders: new Map(), files: [] };

	for (const path of new Set(paths.map(normalPath))) {
		const segments = path.split('/').filter((segment) => segment !== '');
		const name = segments.pop();
		if (name === undefined) continue;

		let branch = root;
		for (const segment of segments) {
			const seen = branch.folders.get(segment);
			if (seen !== undefined) {
				branch = seen;
				continue;
			}
			const created: Branch = {
				name: segment,
				path: branch.path === '' ? segment : `${branch.path}/${segment}`,
				folders: new Map(),
				files: [],
			};
			branch.folders.set(segment, created);
			branch = created;
		}
		branch.files.push({ kind: 'file', name, path });
	}

	const toNodes = (branch: Branch): CodeTreeNode[] =>
		order([
			...[...branch.folders.values()].map((child): CodeTreeNode => ({
				kind: 'folder',
				name: child.name,
				path: child.path,
				children: toNodes(child),
			})),
			...branch.files,
		]);

	return toNodes(root);
}
