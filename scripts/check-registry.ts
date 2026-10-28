/**
 * Keeps registry.json honest, in both directions.
 *
 * `shadcn registry validate` catches a declared file that is missing from disk. It cannot
 * catch the opposite — a file that exists but is never declared — and that is the one that
 * bites: it is silently left out of the consuming project, and the failure surfaces there,
 * at build time, far from its cause.
 *
 * A component lives in one of two layers of `src/components/lumo`, and the two have different
 * shapes. `ui/` is a primitive, and a primitive is a single file: `ui/Button.tsx`. `blocks/`
 * is a composition, and a composition is a directory of parts: `blocks/Layout/index.tsx`. The
 * layer decides the item type it must carry — `registry:ui` and `registry:block` — so the
 * shape of registry.json mirrors shadcn's.
 *
 * No argument: check, and fail on any drift. `--fix`: write the correction back. The files
 * array is derived from the component tree rather than trusted, so a new component costs the
 * one anchor path its item needs anyway instead of a row per file.
 *
 * Items outside `src/components/lumo` (cn, theme) are checked for existence and target
 * mirroring, never added to or dropped. Anything this script will not guess at stops it before
 * it writes.
 */
import { join } from 'node:path';

type RegistryFile = { path: string; type?: string; target?: string };
type RegistryItem = {
	name: string;
	type?: string;
	files?: RegistryFile[];
	registryDependencies?: string[];
};
type Registry = { items: RegistryItem[] };

const fix = process.argv.includes('--fix');

const root = join(import.meta.dir, '..');
const registryPath = join(root, 'registry.json');
const componentRoot = join(root, 'src', 'components', 'lumo');
const componentPrefix = 'src/components/lumo/';

/** The two layers a component can belong to, and the item type each one demands. */
const layerTypes: Record<string, string> = { ui: 'registry:ui', blocks: 'registry:block' };

/** The registry.json item name convention: `CodeDiff` is `code-diff`. */
const kebab = (name: string) => name.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const registry: Registry = await Bun.file(registryPath).json();

/** Drift it can repair itself: written back under --fix, fatal without it. */
const drift: string[] = [];
/** Structure it must not guess at — a person settles these first. */
const problems: string[] = [];

// Every file under the component root, keyed by the component it belongs to: `ui/Button.tsx`
// for a primitive, `blocks/Layout` for a composition.
const onDisk = new Map<string, string[]>();
let files = 0;

const glob = new Bun.Glob('**/*');
for await (const entry of glob.scan({ cwd: componentRoot, onlyFiles: true })) {
	const rel = entry.replaceAll('\\', '/');
	const path = `${componentPrefix}${rel}`;
	files += 1;

	const segments = rel.split('/');
	const layer = segments[0]!;
	if (segments.length < 2) {
		problems.push(
			`${path}: loose file — a component lives in ${Object.keys(layerTypes).join('/')}`,
		);
		continue;
	}
	if (layerTypes[layer] === undefined) {
		problems.push(
			`${componentPrefix}${rel}: unknown layer — only ${Object.keys(layerTypes).join('/')} live here`,
		);
		continue;
	}

	if (layer === 'ui') {
		if (segments.length > 2) {
			problems.push(
				`${path}: a ui component is one file — ui/${segments[1]!.replace(/\.tsx?$/, '')}.tsx`,
			);
			continue;
		}
	} else if (segments.length < 3) {
		problems.push(`${path}: a block is a directory — blocks/<Name>/…`);
		continue;
	}

	const key = layer === 'ui' ? rel : segments.slice(0, 2).join('/');
	const bucket = onDisk.get(key);
	if (bucket === undefined) onDisk.set(key, [path]);
	else bucket.push(path);
}

/** Which item owns which component, read off the paths its files declare. */
const keyToItem = new Map<string, RegistryItem>();

for (const item of registry.items) {
	for (const file of item.files ?? []) {
		if (!file.path.startsWith(componentPrefix)) continue;
		const rel = file.path.slice(componentPrefix.length);
		const segments = rel.split('/');
		if (segments.length < 2) break; // a loose path; the scan above already reported it
		const key = segments.slice(0, 2).join('/');
		const owner = keyToItem.get(key);
		if (owner !== undefined && owner !== item) {
			problems.push(
				`${componentPrefix}${key}: anchored by both "${owner.name}" and "${item.name}"`,
			);
		} else {
			keyToItem.set(key, item);
		}
		break;
	}
}

for (const [key, item] of keyToItem) {
	const layer = key.split('/')[0]!;
	const expected = layerTypes[layer];
	if (expected !== undefined && item.type !== expected) {
		problems.push(
			`"${item.name}": type "${item.type}" but its files sit in ${layer}/ — expected "${expected}"`,
		);
	}
	if (!onDisk.has(key)) {
		problems.push(
			`${componentPrefix}${key}: "${item.name}" anchors this component but nothing is on disk — restore it or drop the item`,
		);
	}
}

for (const key of onDisk.keys()) {
	if (!keyToItem.has(key)) {
		const name = kebab(
			key
				.split('/')
				.pop()!
				.replace(/\.tsx?$/, ''),
		);
		problems.push(
			`${componentPrefix}${key}: no item anchors this component — add one named "${name}"`,
		);
	}
}

/** Every declared file, and the item that installs it — the manifest read as a map. */
const fileOwner = new Map<string, string>();
for (const item of registry.items) {
	for (const file of item.files ?? []) fileOwner.set(file.path, item.name);
}

/** An item's dependencies by item name, where the manifest spells them `linyana/lumo-ui/<name>`. */
const declaredDeps = new Map(
	registry.items.map((item) => [
		item.name,
		(item.registryDependencies ?? []).map((dep) => dep.slice(dep.lastIndexOf('/') + 1)),
	]),
);

/** Everything an item installs: itself, and whatever the dependencies it declares bring. */
function installs(name: string): Set<string> {
	const seen = new Set<string>();
	const queue = [name];
	while (queue.length > 0) {
		const current = queue.pop()!;
		if (seen.has(current)) continue;
		seen.add(current);
		queue.push(...(declaredDeps.get(current) ?? []));
	}
	return seen;
}

/** `@/lib/cn` → the file the app resolves it to, spelled the way registry.json spells paths. */
async function resolveImport(specifier: string) {
	for (const suffix of ['.tsx', '.ts', '.css', '/index.tsx', '/index.ts']) {
		const path = `src/${specifier.slice(2)}${suffix}`;
		if (await Bun.file(join(root, path)).exists()) return path;
	}
	return undefined;
}

/** The app's own imports — the edges that make one item depend on another. */
function localImports(source: string): string[] {
	return [...source.matchAll(/(?:from|import)\s+['"](@\/[^'"]+)['"]/g)].flatMap((match) =>
		match[1] === undefined ? [] : [match[1]],
	);
}

// A component's imports ARE the manifest's dependencies, and the docs draw their tree from the
// manifest: an import nobody declared is a file the CLI never copies, and it would be found in a
// consuming project at build time instead of here. So the declaration has to cover the code.
for (const item of registry.items) {
	const installed = installs(item.name);

	for (const file of item.files ?? []) {
		const handle = Bun.file(join(root, file.path));
		if (!(await handle.exists())) continue;

		for (const specifier of localImports(await handle.text())) {
			const path = await resolveImport(specifier);
			if (path === undefined) {
				problems.push(`${file.path}: imports "${specifier}", which resolves to no file`);
				continue;
			}

			const owner = fileOwner.get(path);
			if (owner === undefined) {
				problems.push(`${file.path}: imports ${path}, which no registry item declares`);
				continue;
			}

			if (owner === item.name || installed.has(owner)) continue;
			problems.push(
				`"${item.name}": ${file.path} imports "${owner}" but does not declare it — ` +
					`add "linyana/lumo-ui/${owner}" to its registryDependencies`,
			);
		}
	}
}

for (const item of registry.items) {
	const managed: RegistryFile[] = [];
	const rest: RegistryFile[] = [];

	for (const file of item.files ?? []) {
		const rel = file.path.slice(componentPrefix.length);
		const inComponent = file.path.startsWith(componentPrefix) && rel.includes('/');
		(inComponent ? managed : rest).push(file);
	}

	// Hand-written entries outside the component root: check them, never add or drop.
	for (const file of rest) {
		if (!(await Bun.file(join(root, file.path)).exists())) {
			problems.push(`${file.path}: declared in registry.json but missing from disk`);
		}
		// Targets mirror the source path so a typo cannot silently land a file elsewhere —
		// and on a case-insensitive filesystem such a typo would not even fail locally.
		if (file.target !== `~/${file.path}`) {
			drift.push(`${file.path}: target "${file.target}" does not mirror path "${file.path}"`);
			if (fix) file.target = `~/${file.path}`;
		}
	}

	if (managed.length === 0) continue;

	const anchor = managed[0]!;
	const rel = anchor.path.slice(componentPrefix.length);
	const key = rel.split('/').slice(0, 2).join('/');
	const prefix = `${componentPrefix}${key}`;

	if (managed.some((file) => !file.path.startsWith(`${prefix}/`) && file.path !== prefix)) {
		problems.push(
			`"${item.name}": its files span more than one component — a component lives in exactly one`,
		);
		continue;
	}

	const diskHere = onDisk.get(key) ?? [];
	const declaredHere = new Set(managed.map((file) => file.path));
	const expected = [...diskHere].sort();
	const itemDrift: string[] = [];

	for (const file of managed) {
		if (!diskHere.includes(file.path)) {
			itemDrift.push(`${file.path}: declared in registry.json but missing from disk`);
		} else if (file.target !== `~/${file.path}`) {
			itemDrift.push(
				`${file.path}: target "${file.target}" does not mirror path "${file.path}"`,
			);
		}
	}
	for (const path of expected) {
		if (!declaredHere.has(path)) {
			itemDrift.push(`${path}: exists on disk but is not declared in registry.json`);
		}
	}

	if (itemDrift.length === 0) continue;

	drift.push(...itemDrift);
	if (!fix) continue;

	// Keep the order a person chose and append what is new: reshuffling the whole array would
	// bury the one line actually added, and this script has no opinion on the order anyway.
	const known = new Map(managed.map((file) => [file.path, file]));
	const order = [
		...managed.filter((file) => diskHere.includes(file.path)).map((file) => file.path),
		...expected.filter((path) => !declaredHere.has(path)),
	];
	item.files = [
		...order.map((path) => ({
			path,
			type: known.get(path)?.type ?? 'registry:file',
			target: `~/${path}`,
		})),
		...rest,
	];
}

if (problems.length > 0) {
	console.error(`registry.json needs a person (${problems.length}):`);
	for (const problem of problems) console.error(`  - ${problem}`);
	console.error('nothing was written; settle these first');
	process.exit(1);
}

if (drift.length === 0) {
	const declared = new Set(
		registry.items.flatMap((item) => (item.files ?? []).map((f) => f.path)),
	);
	console.log(`registry ok: ${files} component files, ${declared.size} declared paths`);
} else if (fix) {
	await Bun.write(registryPath, `${JSON.stringify(registry, null, '\t')}\n`);
	// Hand-rolled JSON cannot know the project's printWidth, so let the project's own
	// formatter settle the layout — a sync that leaves `bun run check` failing has fixed nothing.
	const settled = Bun.spawnSync([process.execPath, 'x', 'oxfmt', registryPath], {
		stdin: 'ignore',
		stdout: 'ignore',
		stderr: 'ignore',
	});
	if (!settled.success) console.error('oxfmt could not settle the layout — run `bun run format`');
	console.log(`registry synced (${drift.length}):`);
	for (const change of drift) console.log(`  - ${change}`);
} else {
	console.error(`registry.json is out of sync (${drift.length}):`);
	for (const change of drift) console.error(`  - ${change}`);
	console.error('run `bun run registry:sync` to write the correction back');
	process.exit(1);
}
