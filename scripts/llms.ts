/**
 * The same docs, written for an agent to read.
 *
 * ant.design serves `/llms.txt`: one small file an assistant can fetch to learn what a library is,
 * how it is installed, and where the page about each part lives. This is that, generated from
 * `registry.json` rather than written by hand — the manifest already carries every item's title, its
 * prose, and the files it copies, so the index cannot advertise a component the CLI would not
 * install, and an item added here shows up in all three files without a second edit.
 *
 * Three outputs, smallest to largest:
 *
 * - `/docs/<name>.md` — one item: what it is, how it is installed, the source it copies, and the
 *   examples its page shows.
 * - `/llms.txt` — the index: what this is, how an install works, the rules that decide the code,
 *   then every item by layer, each linking to its markdown.
 * - `/llms-full.txt` — the rules, the index and every item in one fetch, for a reader that would
 *   rather have it all than follow links.
 *
 * The examples are read off the page directory that documents the item (`src/pages/Button/demos` is
 * `@lumo/button`), which is the same rule the docs app uses to name an item — so a page and its
 * markdown are never a component apart.
 */
import { mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

type RegistryFile = { path: string; type?: string };
type RegistryItem = {
	name: string;
	type: string;
	description?: string;
	files?: RegistryFile[];
	registryDependencies?: string[];
	dependencies?: string[];
};

const root = join(import.meta.dir, '..');
const out = join(root, 'public');
const docs = join(out, 'docs');
const registry = (await Bun.file(join(root, 'registry.json')).json()) as { items: RegistryItem[] };

/** The order an index is read in, and every item type filed under one of the four. */
const groups = [
	{ title: 'Components', types: ['registry:ui'] },
	{ title: 'Blocks', types: ['registry:block'] },
	{ title: 'Helpers', types: ['registry:lib'] },
	{ title: 'Theme', types: ['registry:style', 'registry:item'] },
];

/** Where a copied file lands, which is the consumer's alias rather than a path this repo names. */
const landing: Record<string, string> = {
	'registry:ui': "the project's `aliases.ui`",
	'registry:lib': "the project's `aliases.lib`",
	'registry:component': "the project's `aliases.components`",
};

/** The stylesheets the two merged items are generated from: no file is copied, so this is the text. */
const stylesheets: Record<string, string> = {
	theme: 'src/styles/lumo-tokens.css',
	palette: 'src/styles/lumo-palette.css',
};

/** `RadioGroup` → `radio-group`: a page directory and a registry item are spelled by one rule. */
function kebab(name: string) {
	return name.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** A fence's language, which for TSX is `tsx` — the grammar the docs app highlights it with. */
function language(path: string) {
	return path.slice(path.lastIndexOf('.') + 1);
}

/** The docs app's pages, by the route the router serves them on. */
async function routePages() {
	const pages = new Map<string, string>();
	for (const entry of await readdir(join(root, 'src/pages'), { withFileTypes: true })) {
		if (!entry.isDirectory() || entry.name === 'DocPage') continue;
		pages.set(kebab(entry.name), entry.name);
	}
	return pages;
}

const pages = await routePages();

/**
 * The examples a page shows, `basic` first — the one a reader would have written anyway — then the
 * rest alphabetically, so the order is the doc's rather than the file system's.
 */
async function demosOf(name: string) {
	const page = pages.get(name);
	if (page === undefined) return [];

	const dir = join(root, 'src/pages', page, 'demos');
	const files = (await readdir(dir).catch(() => [] as string[])).filter((file) =>
		file.endsWith('.tsx'),
	);

	const weight = (file: string) => (file.startsWith('basic.') ? 0 : 1);
	return files
		.sort((left, right) => weight(left) - weight(right) || left.localeCompare(right))
		.map((file) => `src/pages/${page}/demos/${file}`);
}

/**
 * One file, fenced and named: the whole of a component's API in a library of copyable source. The
 * fence outgrows any run of backticks inside the file, so a demo that shows markdown cannot end the
 * block it is quoted in.
 */
async function fileBlock(path: string) {
	const source = (await Bun.file(join(root, path)).text()).trimEnd();
	const runs = [...source.matchAll(/`+/g)].map((match) => match[0].length);
	const fence = '`'.repeat(Math.max(3, ...runs.map((run) => run + 1)));
	return [`### ${path}`, '', `${fence}${language(path)}`, source, fence].join('\n');
}

/** An item's install section: the one command, and what it brings without being asked. */
function installBlock(item: RegistryItem) {
	const lines = [
		'## install',
		'',
		'```bash',
		`bunx shadcn@latest add @lumo/${item.name}`,
		'```',
		'',
		`- payload: \`/r/${item.name}.json\``,
	];

	if (pages.has(item.name)) lines.push(`- docs page: \`/${item.name}\``);

	const reached = item.registryDependencies ?? [];
	if (reached.length > 0) {
		lines.push(`- comes with it: ${reached.map((name) => `\`${name}\``).join(', ')}`);
	}

	const packages = item.dependencies ?? [];
	if (packages.length > 0) {
		lines.push(`- npm packages: ${packages.map((name) => `\`${name}\``).join(', ')}`);
	}

	const files = item.files ?? [];
	const alias = landing[files[0]?.type ?? ''] ?? 'the project';
	if (files.length === 1) {
		lines.push(`- lands in: \`${files[0]?.path.split('/').pop()}\` under ${alias}`);
	} else if (files.length > 1) {
		lines.push(`- lands in: ${files.length} files under ${alias}`);
	}

	return [...lines, ''];
}

/** Everything about one item: its install, the source it copies, and its examples. */
async function itemDoc(item: RegistryItem) {
	const files = item.files ?? [];
	const lines: string[] = [`# ${item.name}`, ''];
	if (item.description !== undefined) lines.push(`> ${item.description}`, '');

	lines.push(...installBlock(item));

	const stylesheet = stylesheets[item.name];
	if (stylesheet !== undefined) {
		lines.push(
			'## what the CLI does',
			'',
			'Not a file, and not copied: the CLI merges it into the stylesheet `components.json` names ' +
				'— the custom properties into `:root`, `.dark` and `@theme inline`, the rules into the ' +
				'base layer. `@lumo/theme` is required either way; `@lumo/palette` is the default ' +
				'colours, added only where a project has none of its own. The source it is generated ' +
				'from is the stylesheet below, so a variable in it is the variable installed.',
			'',
			await fileBlock(stylesheet),
			'',
		);
	}

	if (files.length > 0) {
		lines.push(
			'## source',
			'',
			'What ships is source, and the source is the API: there is no generated prop table to ' +
				'consult, so read the signatures below rather than guessing at one. A part this item ' +
				'needs from another item lives in that item’s page.',
			'',
		);
		for (const file of files) lines.push(await fileBlock(file.path), '');
	}

	const demos = await demosOf(item.name);
	if (demos.length > 0) {
		lines.push(
			'## examples',
			'',
			'Each is a page in this repository; the `@/` it imports resolve through the consumer’s own ' +
				'aliases once the files are installed.',
			'',
		);
		for (const path of demos) lines.push(await fileBlock(path), '');
	}

	return `${lines.join('\n').trimEnd()}\n`;
}

/** What this is, and how a first install goes — the part every output opens with. */
function brief() {
	return [
		'lumo-ui is a personal React component library distributed as a shadcn registry — there is no',
		'npm package. A component arrives as source, in the project, copied into the consumer’s own',
		'aliases; a file already there with the same content is skipped, so a second install shares the',
		'first. The site is the registry: `/r/<name>.json` is what the CLI reads.',
		'',
		'## how an install works',
		'',
		'Declare the namespace once, in `components.json` (or under `registries` in `package.json`).',
		'`<host>` is the origin this file was fetched from, and `{name}` is the CLI’s placeholder.',
		'',
		'```json',
		'"registries": { "@lumo": "https://<host>/r/{name}.json" }',
		'```',
		'',
		'```bash',
		'bunx shadcn@latest add @lumo/theme',
		'bunx shadcn@latest add @lumo/button',
		'```',
		'',
		'`@lumo/theme` is required and is merged into the project’s stylesheet rather than copied;',
		'`@lumo/palette` only adds the default colours where a project has none. Everything a component',
		'imports comes with it: another item, or the npm package it names.',
		'',
		'## rules that decide the code',
		'',
		'- Behaviour is Base UI’s (`@base-ui/react`). Focus trapping, escape, scroll lock, positioning',
		'  and ARIA are never reimplemented here.',
		'- Composition is `render`, not `asChild`: `<Dialog.Trigger render={<Button />} />`.',
		'- Appearance is tokens only — `bg-primary`, `text-muted-foreground`, `rounded-md`. No',
		'  `bg-blue-500`, no `#fff`, no `rounded-[6px]`, and no new token without a reason.',
		'- Focus is declared once, in the theme’s `:focus-visible`. A component does not write its own;',
		'  the field family instead moves its own edge to `--input-strong`.',
		'- State attributes are Base UI’s own: `data-open`, `data-closed`, `data-starting-style`,',
		'  `data-ending-style`, `data-highlighted`, `data-disabled`. A variant is mirrored as',
		'  `data-variant`, a size as `data-size`.',
		'- Icons are lucide, passed as rendered elements into a slot — `icon={<Trash2 />}`, sized in',
		'  `em` by the slot itself — never as an icon-component type.',
		'- A multi-part component exports one namespace (`Dialog.Root`, `Dialog.Popup`, …); a',
		'  single-part one exports the function. Every rendered element carries `data-slot`.',
		'- The consumer’s `className` is merged last, through `cn()`.',
	].join('\n');
}

/** Every item by layer, each one a link to its markdown: the catalogue both files repeat. */
function catalogue() {
	const lines: string[] = [];
	for (const group of groups) {
		const items = ordered(group);
		if (items.length === 0) continue;

		lines.push(`## ${group.title}`, '');
		for (const item of items) {
			const note = item.description === undefined ? '' : `: ${item.description}`;
			lines.push(`- [${item.name}](/docs/${item.name}.md)${note}`);
		}
		lines.push('');
	}
	return lines.join('\n').trimEnd();
}

/** A group's items, alphabetically: an index is read by looking things up, not by history. */
function ordered(group: (typeof groups)[number]) {
	return registry.items
		.filter((item) => group.types.includes(item.type))
		.sort((left, right) => left.name.localeCompare(right.name));
}

const summary =
	'> Components to copy, not to install: Base UI for behaviour, Tailwind v4 for styling, CSS\n' +
	'> variables for theme.';

const navigation = [
	'## navigation',
	'',
	'- [Full documentation](/llms-full.txt): every item, its source and its examples, in one file.',
	'- [Repository rules](/docs/agents.md): layer, naming, token, icon and registry rules, and why.',
	'- `/r/<name>.json`: the payload the CLI installs; `/docs/<name>.md`: the same item as prose.',
].join('\n');

const markdown = [
	`# lumo-ui\n\n${summary}`,
	'An item’s markdown page is `/docs/<name>.md` — what it is, its install command, the source it ' +
		'copies and its examples. Everything below is also in one file: [llms-full.txt](/llms-full.txt).',
	brief(),
	navigation,
	catalogue(),
].join('\n\n');

/**
 * The mark every generated file opens with.
 *
 * `_headers` declares the charset, and a reader that honours it needs nothing more — but one that
 * does not, a Chinese-locale browser or a downloaded copy opened in a Windows editor, falls back to
 * the machine's own code page, and `—` (`E2 80 94`) then reads as `鈥` beside a replacement
 * character. A BOM is sniffed before the charset and before any guess from the language, so these
 * three bytes are what keeps a reader that trusts neither on UTF-8.
 */
const BOM = '\uFEFF';

const write = (path: string, text: string) => Bun.write(path, BOM + text);

const itemDocs = new Map<string, string>();
for (const item of registry.items) itemDocs.set(item.name, await itemDoc(item));

const rules = await Bun.file(join(root, 'AGENTS.md')).text();
const full = [
	[`# lumo-ui — full documentation\n\n${summary}`, brief()].join('\n\n'),
	['# the index', navigation, catalogue()].join('\n\n'),
	`# repository rules\n\n${rules.trimEnd()}`,
	...groups.flatMap((group) => ordered(group)).map((item) => itemDocs.get(item.name)!),
].join('\n\n---\n\n');

await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });
await write(join(out, 'llms.txt'), markdown);
await write(join(out, 'llms-full.txt'), `${full}\n`);
await write(join(docs, 'agents.md'), rules);
for (const [name, doc] of itemDocs) await write(join(docs, `${name}.md`), doc);

const size = (text: string) => `${Math.round(text.length / 1024)}K`;
console.log(
	`llms ok: ${itemDocs.size} item pages, llms.txt ${size(markdown)}, llms-full.txt ${size(full)}`,
);
