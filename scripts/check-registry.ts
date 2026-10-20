/**
 * Keeps registry.json honest, in both directions.
 *
 * `shadcn registry validate` catches a declared file that is missing from disk. It cannot
 * catch the opposite — a file that exists but is never declared — and that is the one that
 * bites: it is silently left out of the consuming project, and the failure surfaces there,
 * at build time, far from its cause.
 *
 * No argument: check, and fail on any drift. `--fix`: write the correction back. The files
 * array is derived from the component tree rather than trusted, so a new component costs the
 * one anchor path its item needs anyway instead of a row per file.
 *
 * A component lives in one layer of `src/components/lumo`: `ui/<Name>/` for a primitive,
 * `blocks/<Name>/` for a composition. The layer decides the item type it must carry
 * (`registry:ui` and `registry:block`), so the shape of registry.json mirrors shadcn's.
 *
 * Items outside `src/components/lumo` (cn, theme) are checked for existence and target
 * mirroring, never added to or dropped. Anything this script will not guess at — an
 * unanchored directory, a loose file, a missing source — stops it before it writes.
 */
import { join } from 'node:path';

type RegistryFile = { path: string; type?: string; target?: string };
type RegistryItem = { name: string; type?: string; files?: RegistryFile[] };
type Registry = { items: RegistryItem[] };

const fix = process.argv.includes('--fix');

const root = join(import.meta.dir, '..');
const registryPath = join(root, 'registry.json');
const componentRoot = join(root, 'src', 'components', 'lumo');
const componentPrefix = 'src/components/lumo/';
/** The two layers a component can belong to, and the item type each one demands. */
const layerTypes: Record<string, string> = { ui: 'registry:ui', blocks: 'registry:block' };

/** `src/components/lumo/ui/Dialog/Popup/index.tsx` → `ui/Dialog`. */
const dirOf = (rel: string) => rel.split('/').slice(0, 2).join('/');

const registry: Registry = await Bun.file(registryPath).json();

/** Drift it can repair itself: written back under --fix, fatal without it. */
const drift: string[] = [];
/** Structure it must not guess at — a person settles these first. */
const problems: string[] = [];

// Every file under the component root, grouped by the directory it lives in.
const onDisk = new Map<string, string[]>();
let files = 0;

const glob = new Bun.Glob('**/*');
for await (const entry of glob.scan({ cwd: componentRoot, onlyFiles: true })) {
	const rel = entry.replaceAll('\\', '/');
	const path = `${componentPrefix}${rel}`;
	files += 1;

	// layer, component name, then whatever the component is made of.
	if (rel.split('/').length < 3) {
		problems.push(`${path}: loose file — a component must live in lumo/<layer>/<Name>/`);
		continue;
	}

	const dir = dirOf(rel);
	const bucket = onDisk.get(dir);
	if (bucket === undefined) onDisk.set(dir, [path]);
	else bucket.push(path);
}

// Which item owns which directory, read off the first component path each item declares.
// Learned rather than guessed, so no naming convention has to be invented — and a directory
// nothing anchors is reported, which is exactly where a person is wanted anyway.
const dirToItem = new Map<string, RegistryItem>();

for (const item of registry.items) {
	for (const file of item.files ?? []) {
		if (!file.path.startsWith(componentPrefix)) continue;
		const rel = file.path.slice(componentPrefix.length);
		if (rel.split('/').length < 3) continue; // a loose path; the scan above already reported it
		const dir = dirOf(rel);
		const owner = dirToItem.get(dir);
		if (owner !== undefined && owner !== item) {
			problems.push(
				`${componentPrefix}${dir}/: anchored by both "${owner.name}" and "${item.name}"`,
			);
		} else {
			dirToItem.set(dir, item);
		}
		break;
	}
}

for (const [dir, item] of dirToItem) {
	const layer = dir.split('/')[0]!;
	const expected = layerTypes[layer];
	if (expected === undefined) {
		problems.push(
			`${componentPrefix}${dir}/: unknown layer — only ${Object.keys(layerTypes).join('/')} live here`,
		);
	} else if (item.type !== expected) {
		problems.push(
			`"${item.name}": type "${item.type}" but its files sit in ${layer}/ — expected "${expected}"`,
		);
	}
}

for (const dir of onDisk.keys()) {
	if (!dirToItem.has(dir)) {
		problems.push(
			`${componentPrefix}${dir}/: no item anchors this directory — add an item naming one of its files`,
		);
	}
}

for (const [dir, item] of dirToItem) {
	if (!onDisk.has(dir)) {
		problems.push(
			`${componentPrefix}${dir}/: "${item.name}" anchors this directory but nothing is in it — restore the files or drop the item`,
		);
	}
}

for (const item of registry.items) {
	const managed: RegistryFile[] = [];
	const rest: RegistryFile[] = [];

	for (const file of item.files ?? []) {
		const rel = file.path.slice(componentPrefix.length);
		const inComponentDir = file.path.startsWith(componentPrefix) && rel.includes('/');
		(inComponentDir ? managed : rest).push(file);
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
	const dir = dirOf(anchor.path.slice(componentPrefix.length));
	const home = `${componentPrefix}${dir}/`;
	if (managed.some((file) => !file.path.startsWith(home))) {
		problems.push(
			`"${item.name}": its files span more than one component directory — a component lives in exactly one`,
		);
		continue;
	}

	const diskHere = onDisk.get(dir) ?? [];
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
	const fallbackType = anchor.type ?? 'registry:file';
	const order = [
		...managed.filter((file) => diskHere.includes(file.path)).map((file) => file.path),
		...expected.filter((path) => !declaredHere.has(path)),
	];
	item.files = [
		...order.map((path) => ({
			path,
			type: known.get(path)?.type ?? fallbackType,
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
