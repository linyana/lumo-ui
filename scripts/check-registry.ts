/**
 * Keeps registry.json honest, in both directions.
 *
 * The repository is laid out the way a shadcn registry's items *land*: one file per ui component,
 * one directory per block, one file per lib helper. The manifest mirrors that shape instead of
 * describing an install path — `files[].path` is where the file lives here, `files[].type` is the
 * layer it belongs to, and **no `target` is written at all**, because the CLI is the one that
 * decides where a file goes: the consumer's `aliases.ui`, `aliases.lib` and `aliases.components`,
 * read from its own components.json. Pinning a `~/src/components/...` target here would install a
 * second copy of every component next to the one the consumer already has, which is the opposite
 * of sharing one.
 *
 * A file's imports are checked against the manifest, both kinds: a local one has to be an item this
 * one reaches, and an npm one has to be a package it declares. The second is what the docs build
 * the install command from, so a package missing here is a command that does not compile — in the
 * reader's project, not in this one.
 *
 * No argument: check, and fail on any drift. `--fix`: write the correction back. Anything this
 * script will not guess at stops it before it writes.
 */
import { join } from 'node:path';
import { themeItems } from './theme';

type RegistryFile = { path: string; type?: string; target?: string };
type RegistryItem = {
	name: string;
	type?: string;
	files?: RegistryFile[];
	registryDependencies?: string[];
	dependencies?: string[];
	cssVars?: unknown;
	css?: unknown;
};
type Registry = { items: RegistryItem[] };

const fix = process.argv.includes('--fix');

const root = join(import.meta.dir, '..');
const registryPath = join(root, 'registry.json');

/**
 * The layers a component can live in, and the item type and file type each one demands. The
 * stylesheets are not one of them: they are merged into the project's own CSS rather than copied,
 * so src/styles holds the source of the theme items and no file of any item.
 */
const layers = {
	'src/components/ui': { item: 'registry:ui', file: 'registry:ui', kind: 'file', claims: true },
	'src/components/blocks': {
		item: 'registry:block',
		file: 'registry:component',
		kind: 'directory',
		claims: true,
	},
	'src/lib': { item: 'registry:lib', file: 'registry:lib', kind: 'file', claims: true },
} as const;

type Layer = keyof typeof layers;
const layerNames = Object.keys(layers) as Layer[];
/** The layers every file of which has to be claimed by an item. */
const claimedLayers = layerNames.filter((layer) => layers[layer].claims);

/**
 * The target a file needs, and `undefined` for the ones the CLI places on its own: a ui component
 * and a lib helper land on the consumer's aliases, so naming a path here would only pin a second
 * copy beside it.
 */
function targetFor(itemType: string | undefined, path: string): string | undefined {
	if (itemType === 'registry:block') return `@components/${path.replace('src/components/', '')}`;
	return undefined;
}

/** The layer a declared path belongs to, and the key that layer is filed under. */
function locate(path: string) {
	for (const layer of layerNames) {
		if (!path.startsWith(`${layer}/`)) continue;
		const rest = path.slice(layer.length + 1);
		const segments = rest.split('/');
		const key = layers[layer].kind === 'directory' ? segments[0] : rest;
		return key === undefined ? undefined : { layer, key };
	}
	return undefined;
}

const registry: Registry = await Bun.file(registryPath).json();

/** Drift it can repair itself: written back under --fix, fatal without it. */
const drift: string[] = [];
/** Structure it must not guess at — a person settles these first. */
const problems: string[] = [];

/** Every declared path, on disk, filed under the component it belongs to. */
const onDisk = new Map<string, string[]>();
let filesOnDisk = 0;

const glob = new Bun.Glob('**/*');
for (const layer of claimedLayers) {
	const layerRoot = join(root, layer);
	for await (const entry of glob.scan({ cwd: layerRoot, onlyFiles: true })) {
		const path = `${layer}/${entry.replaceAll('\\', '/')}`;
		filesOnDisk += 1;

		const located = locate(path);
		if (located === undefined) {
			problems.push(`${path}: loose file — every file belongs to one component`);
			continue;
		}

		// A ui component is one file directly under the alias root; a block is a directory of
		// parts; a lib helper or a stylesheet is one file. The layers say which, so the shape of
		// the tree is what the manifest gets to describe.
		const { kind } = layers[layer];
		const rest = path.slice(layer.length + 1);
		if (kind === 'file' && rest.includes('/')) {
			problems.push(`${path}: ${layer} holds files, not directories`);
			continue;
		}

		const bucket = onDisk.get(located.key);
		if (bucket === undefined) onDisk.set(located.key, [path]);
		else bucket.push(path);
	}
}

/** Which item owns which component. */
const owners = new Map<string, RegistryItem>();
for (const item of registry.items) {
	for (const file of item.files ?? []) {
		const located = locate(file.path);
		if (located === undefined) continue;
		const owner = owners.get(located.key);
		if (owner !== undefined && owner !== item) {
			problems.push(`${located.key}: anchored by both "${owner.name}" and "${item.name}"`);
		} else {
			owners.set(located.key, item);
		}
	}
}

// Every component on disk has exactly one item, named the way it is spelled, carrying the type its
// layer demands. A component nobody claims is silently missing from every install.
for (const [key, paths] of onDisk) {
	const located = locate(paths[0]!);
	if (located === undefined) continue;
	const { item: itemType, file: fileType } = layers[located.layer];
	const name = key.replace(/\.\w+$/, '');
	const item = owners.get(key);

	if (item === undefined) {
		problems.push(`${key}: no item claims it — add one named "${name}" with type ${itemType}`);
		continue;
	}

	if (item.name !== name) {
		problems.push(`"${item.name}": it installs ${key}, so it has to be named "${name}"`);
	}
	if (item.type !== itemType) {
		problems.push(
			`"${item.name}": type is "${item.type}", but ${located.layer} is ${itemType}`,
		);
	}

	const declared = item.files ?? [];
	const here = new Set(declared.map((file) => file.path));
	const expected = [...paths].sort();
	const itemDrift: string[] = [];

	for (const path of expected) {
		if (!here.has(path)) itemDrift.push(`${path}: exists on disk but is not declared`);
	}
	for (const file of declared) {
		if (!paths.includes(file.path)) {
			itemDrift.push(`${file.path}: declared but missing from disk`);
			continue;
		}

		if (file.type !== fileType) {
			itemDrift.push(`${file.path}: file type is "${file.type}", not ${fileType}`);
		}

		// Where the file lands is the CLI's decision, from the file type and the consumer's
		// aliases — except for the two kinds that have no alias to land under: a block keeps its
		// own directory below the components alias (the CLI would otherwise strip it, since the
		// item's files share it), and a stylesheet has no alias at all.
		const wanted = targetFor(itemType, file.path);
		if (file.target !== wanted) {
			itemDrift.push(
				wanted === undefined
					? `${file.path}: drop its target — the file type decides where it goes`
					: `${file.path}: target "${file.target}" is not "${wanted}"`,
			);
		}
	}

	if (itemDrift.length === 0) continue;

	drift.push(...itemDrift);
	if (!fix) continue;

	// Keep the order a person chose and append what is new: reshuffling the whole array would
	// bury the one line actually added, and this script has no opinion on the order anyway.
	const order = [
		...declared.filter((file) => paths.includes(file.path)).map((file) => file.path),
		...expected.filter((path) => !here.has(path)),
	];
	item.type = itemType;
	item.files = order.map((path) => {
		const file: RegistryFile = { path, type: fileType };
		const target = targetFor(itemType, path);
		if (target !== undefined) file.target = target;
		return file;
	});
}

// The stylesheets, which no file carries: the manifest holds them as the two items that get merged
// into a project's own CSS. Read off the CSS itself, so the file a reader edits is the file that
// ships, and a value changed in one place cannot go missing from the other.
const { theme, palette } = await themeItems();
const themes: Array<{
	name: string;
	type: string;
	cssVars: unknown;
	css?: unknown;
	description: string;
}> = [
	{
		name: 'theme',
		type: 'registry:style',
		cssVars: theme.cssVars,
		css: theme.css,
		description:
			'Everything a component reads that a shadcn theme does not define: the `dark` variant, ' +
			'the `@theme` mappings, the interaction and motion tokens, the radius scale, the outcome ' +
			"colours, the shadows, the focus ring and the base layer. Merged into the project's " +
			'stylesheet and required either way.',
	},
	{
		name: 'palette',
		type: 'registry:item',
		cssVars: palette.cssVars,
		description:
			'The default light and dark page colours, under the shadcn/ui names, and the `--radius` ' +
			'the radius scale derives from. Added only where the project has none of its own; ' +
			'@lumo/theme is needed either way.',
	},
];

for (const wanted of themes) {
	const item = registry.items.find((candidate) => candidate.name === wanted.name);
	if (item === undefined) {
		problems.push(`no item named "${wanted.name}" — the stylesheets have nowhere to go`);
		continue;
	}

	if (item.type !== wanted.type) {
		problems.push(`"${item.name}": type is "${item.type}", not "${wanted.type}"`);
	}
	if (item.files !== undefined) {
		drift.push(
			`"${item.name}": it is merged into the project's CSS, not copied — its files go`,
		);
		if (fix) delete item.files;
	}

	const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);

	if (!same(item.cssVars, wanted.cssVars)) {
		drift.push(`"${item.name}": cssVars differ from the stylesheet it is read off`);
		if (fix) item.cssVars = wanted.cssVars;
	}
	if (!same(item.css, wanted.css)) {
		drift.push(`"${item.name}": css differs from the stylesheet`);
		if (fix) {
			if (wanted.css === undefined) delete item.css;
			else item.css = wanted.css;
		}
	}
}

/** Every declared path, and the item that installs it — the manifest read as a map. */
const fileOwner = new Map<string, string>();
for (const item of registry.items) {
	for (const file of item.files ?? []) fileOwner.set(file.path, item.name);
}

/** An item's dependencies by item name, where the manifest spells them `@lumo/<name>`. */
const declaredDeps = new Map(
	registry.items.map((item) => [
		item.name,
		(item.registryDependencies ?? []).map((dep) => dep.slice(dep.lastIndexOf('/') + 1)),
	]),
);

for (const item of registry.items) {
	for (const dependency of item.registryDependencies ?? []) {
		const name = dependency.slice(dependency.lastIndexOf('/') + 1);
		if (!dependency.startsWith('@lumo/')) {
			problems.push(`"${item.name}": "${dependency}" is not spelled @lumo/<name>`);
		} else if (!registry.items.some((other) => other.name === name)) {
			problems.push(`"${item.name}": depends on "${dependency}", which is no item`);
		}
	}
}

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

const itemByName = new Map(registry.items.map((item) => [item.name, item]));

/** The npm packages an install pulls: every `dependencies` entry of every item it reaches. */
function packagesUnder(installed: Set<string>): Set<string> {
	const packages = new Set<string>();
	for (const name of installed) {
		for (const dependency of itemByName.get(name)?.dependencies ?? []) packages.add(dependency);
	}
	return packages;
}

/**
 * React is the consuming app's, not the manifest's: a library that installed its own copy would
 * hand a project two of them. Everything else a copied file imports has to be declared.
 */
const ownPackages = new Set(['react', 'react-dom']);

/** `@base-ui/react/avatar` → `@base-ui/react`; `motion/react` → `motion`. */
function packageOf(specifier: string): string {
	const [scope, name] = specifier.split('/');
	return specifier.startsWith('@') ? `${scope}/${name}` : scope!;
}

/** `@/lib/utils` → the file the app resolves it to, spelled the way registry.json spells paths. */
async function resolveImport(specifier: string) {
	for (const suffix of ['.tsx', '.ts', '.css', '/index.tsx', '/index.ts']) {
		const path = `src/${specifier.slice(2)}${suffix}`;
		if (await Bun.file(join(root, path)).exists()) return path;
	}
	return undefined;
}

/** Every module a file names, in either of the two spellings TypeScript accepts. */
function imports(source: string): string[] {
	return [...source.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)].flatMap((match) =>
		match[1] === undefined ? [] : [match[1]],
	);
}

/** The app's own imports — the edges that make one item depend on another. */
function localImports(source: string): string[] {
	return imports(source).filter((specifier) => specifier.startsWith('@/'));
}

/** The ones that leave the app: each is a package the manifest has to name. */
function npmImports(source: string): string[] {
	return imports(source).filter(
		(specifier) =>
			!specifier.startsWith('@/') &&
			!specifier.startsWith('.') &&
			!specifier.startsWith('node:'),
	);
}

// A component's imports ARE the manifest's dependencies, and the docs draw their tree from the
// manifest: an import nobody declared is a file the CLI never copies, and it would be found in a
// consuming project at build time instead of here. So the declaration has to cover the code — the
// same for the packages it names, which are what the reader's install command is built from.
for (const item of registry.items) {
	const installed = installs(item.name);
	const packages = packagesUnder(installed);

	for (const file of item.files ?? []) {
		const handle = Bun.file(join(root, file.path));
		if (!(await handle.exists())) continue;
		// Only code imports: a stylesheet's `@import` names something the project loads itself, and
		// the prose around it carries quotes that are not imports at all.
		if (!/\.tsx?$/.test(file.path)) continue;
		const source = await handle.text();

		for (const specifier of localImports(source)) {
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
					`add "@lumo/${owner}" to its registryDependencies`,
			);
		}

		for (const specifier of npmImports(source)) {
			const name = packageOf(specifier);
			if (ownPackages.has(name) || packages.has(name)) continue;
			problems.push(
				`"${item.name}": ${file.path} imports "${specifier}", but neither it nor a ` +
					`dependency declares "${name}" — add it to the item's dependencies`,
			);
		}
	}
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
	console.log(`registry ok: ${filesOnDisk} files, ${declared.size} declared paths`);
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
