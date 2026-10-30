/**
 * The manifest's copy of the stylesheets.
 *
 * `src/styles/lumo-tokens.css` and `lumo-palette.css` are what the docs site loads, and they are
 * also what a project receives: shadcn's CLI does not copy a stylesheet, it merges one — `cssVars`
 * into the project's `:root`/`.dark`/`@theme inline`, `css` into its base layer — so the two files
 * are read here and turned into the two items that carry them. Reading rather than restating keeps
 * one source: the CSS a reader can edit is the CSS that ships.
 *
 * Two items, because they answer two questions. `theme` is what a component cannot draw without —
 * the mappings, the interaction timing, the outcomes, the focus ring — and its type makes the CLI
 * write them. `palette` is only where the default colours come from, and its type makes the CLI
 * *not* overwrite a project that already has its own.
 *
 * A stylesheet is not a schema, so the reading is checked twice over, and both checks run on every
 * `bun run check`: the declarations that went in are counted against the ones that came out, and the
 * result is written back to CSS and read again, which is the shape the CLI will hand the project.
 * A syntax this file does not understand fails here rather than leaving a hole in the manifest.
 */
import { join } from 'node:path';

/** A block of CSS: a selector or at-rule, its declarations, and whatever it nests. */
type Block = {
	selector: string;
	declarations: [string, string][];
	children: Block[];
};

/** A `selector → declarations` map, as `registry.json` spells `css`: one brace per level. */
type Css = { [key: string]: string | Css };
type Vars = Record<string, string>;

const root = join(import.meta.dir, '..');
const TOKENS = 'src/styles/lumo-tokens.css';
const PALETTE = 'src/styles/lumo-palette.css';

/** A stylesheet that cannot be carried whole, named the way a person can act on it. */
class ThemeError extends Error {
	constructor(file: string, problems: string[]) {
		super(
			`${file} cannot be shipped as it is (${problems.length}):\n${problems
				.map((problem) => `  - ${problem}`)
				.join('\n')}`,
		);
	}
}

/**
 * The stylesheet, read as blocks. Comments go first — they carry semicolons, braces and quoted
 * sentences, and say so at length — and then a header runs to the first `{`, `;` or `}`, which is
 * what tells a block from a declaration or from a statement with no body at all.
 */
function parse(source: string): {
	blocks: Block[];
	problems: string[];
	/** Every declaration the file holds, counted so the manifest can be held to the same number. */
	declarations: number;
} {
	const text = source.replace(/\/\*[\s\S]*?\*\//g, '');
	let index = 0;
	let reads = 0;
	const problems: string[] = [];

	const top: Block = { selector: '', declarations: [], children: [] };

	/** A header or a value on one line: the file wraps both, the manifest has no columns. */
	const oneLine = (value: string) => value.trim().replace(/\s+/g, ' ');

	/** A custom property or a property name — not a sentence that happens to hold a colon. */
	const property = (name: string) => /^(--[a-z0-9-]+|-?[a-z][a-z0-9-]*)$/i.test(name);

	/** `property: value`, or `undefined` for a statement that carries no colon-bound pair. */
	const pair = (body: string): [string, string] | undefined => {
		const at = body.indexOf(':');
		if (at === -1) return undefined;
		const name = oneLine(body.slice(0, at));
		if (!property(name)) return undefined;
		return [name, oneLine(body.slice(at + 1))];
	};

	/** One block's contents. The caller has consumed the `{`; this stops after the matching `}`. */
	function contents(into: Block) {
		for (;;) {
			while (index < text.length && /\s/.test(text[index]!)) index++;
			if (index >= text.length) return;
			if (text[index] === '}') {
				index++;
				return;
			}

			let body = '';
			while (index < text.length && !'{;}'.includes(text[index]!)) body += text[index++];

			if (text[index] === '{') {
				index++;
				const child: Block = { selector: oneLine(body), declarations: [], children: [] };
				contents(child);
				into.children.push(child);
				continue;
			}

			const statement = text[index] === ';';
			if (statement) index++;
			const atRule = body.trim().startsWith('@');

			// A statement that is not a declaration is an at-rule with no body: `@custom-variant`
			// and its like, which keeps its whole header as the key. Anything else is text this
			// reader did not understand, and guessing at it would put it in the manifest as a rule.
			const declaration = atRule ? undefined : pair(body);
			if (declaration === undefined) {
				if (atRule) {
					into.children.push({ selector: oneLine(body), declarations: [], children: [] });
				} else if (body.trim() !== '') {
					problems.push(
						`${oneLine(body)}: neither a block, a declaration nor an at-rule`,
					);
				}
			} else if (into === top) {
				// Nothing lives outside a block in CSS, and a leftover statement read as one would
				// swallow the header that follows it.
				problems.push(`${declaration[0]}: a declaration outside any block`);
			} else {
				reads++;
				into.declarations.push(declaration);
			}

			if (!statement) return;
		}
	}

	contents(top);
	return { blocks: top.children, problems, declarations: reads };
}

/** `:root` → `{ background: '…' }`: the custom-property prefix off, which is how cssVars spells it. */
function variables(block: Block): Vars {
	return Object.fromEntries(
		block.declarations.map(([property, value]) => [property.replace(/^--/, ''), value]),
	);
}

/** Kept as written: `css` is raw CSS, not variables. */
function declarations(block: Block): Vars {
	return Object.fromEntries(block.declarations);
}

/**
 * A block as `css` spells it: an at-rule keeps its whole header as the key and whatever it nests as
 * the value. Keyframes are the exception — they are collected apart and hoisted to the top, because
 * the CLI files every one it is handed under `@theme inline`, and one a layer deeper would be
 * written as a rule by mistake.
 *
 * Two shapes have no spelling here and are reported instead of being written wrong: an at-rule that
 * carries declarations of its own (only `@theme inline` does, and it is read apart), and a rule that
 * carries both declarations and nested rules.
 */
function cssOf(blocks: Block[], into: Css, keyframes: Css, problems: string[]) {
	for (const block of blocks) {
		if (block.selector.startsWith('@keyframes')) {
			const steps: Css = {};
			for (const step of block.children) steps[step.selector] = declarations(step);
			keyframes[block.selector] = steps;
			continue;
		}

		if (!block.selector.startsWith('@')) {
			if (block.children.length > 0) {
				problems.push(`${block.selector}: a rule holding both declarations and rules`);
				continue;
			}
			into[block.selector] = declarations(block);
			continue;
		}

		if (block.declarations.length > 0) {
			problems.push(`${block.selector}: an at-rule holding declarations — give them a block`);
			continue;
		}

		const nested: Css = {};
		cssOf(block.children, nested, keyframes, problems);
		into[block.selector] = nested;
	}
}

/** Every declaration in a `css` map, however deep. */
function leaves(map: Css): number {
	return Object.values(map).reduce<number>(
		(count, value) => count + (typeof value === 'string' ? 1 : leaves(value)),
		0,
	);
}

/**
 * The manifest written back out as the CSS it came from, which is the only way to know that what the
 * CLI is handed can still be read. The order is the order the CLI writes: variables first, then the
 * rules; nothing here depends on it, because the comparison that follows is of sets, not columns.
 */
function render(items: ThemeItems): string {
	const lines: string[] = [];

	const block = (selector: string, body: string[], into: string[]) => {
		if (body.length === 0) return;
		into.push(`${selector} {`, ...body.map((line) => `\t${line}`), '}');
	};

	// A variable map named its own prefix; a rule's declarations are written as they are.
	const vars = (map: Vars) => Object.entries(map).map(([key, value]) => `--${key}: ${value};`);
	const own = (map: Vars) => Object.entries(map).map(([key, value]) => `${key}: ${value};`);

	const rules = (map: Css, into: string[]) => {
		for (const [selector, value] of Object.entries(map)) {
			if (typeof value === 'string') {
				into.push(`${selector}: ${value};`);
				continue;
			}

			const entries = Object.entries(value);
			// An at-rule with nothing in it is a statement: `@custom-variant dark (…)`.
			if (entries.length === 0 && selector.startsWith('@')) {
				into.push(`${selector};`);
				continue;
			}
			if (entries.every(([, nested]) => typeof nested === 'string')) {
				block(selector, own(value as Vars), into);
				continue;
			}

			const inner: string[] = [];
			rules(value, inner);
			block(selector, inner, into);
		}
	};

	block('@theme inline', vars(items.theme.cssVars.theme), lines);
	block(':root', vars(items.theme.cssVars.light), lines);
	block('.dark', vars(items.theme.cssVars.dark), lines);
	rules(items.theme.css, lines);

	return lines.join('\n');
}

/**
 * Reads a stylesheet and holds it to its own count: every declaration the file carries has to arrive
 * somewhere in the manifest. A file that loses one is a file this reader no longer understands —
 * which is a failure here, at `check` time, and not a component that draws wrong in a project.
 */
function carry(file: string, read: number, placed: number, problems: string[]) {
	if (read !== placed) {
		problems.push(`${read} declarations read, ${placed} carried — something has no home`);
	}
	if (problems.length > 0) throw new ThemeError(file, problems);
}

export type ThemeItems = {
	/** What every component needs, written over whatever the project has. */
	theme: { cssVars: { theme: Vars; light: Vars; dark: Vars }; css: Css };
	/** The default colours, added only where the project has none of its own. */
	palette: { cssVars: { light: Vars; dark: Vars } };
};

export async function themeItems(): Promise<ThemeItems> {
	const tokens = parse(await Bun.file(join(root, TOKENS)).text());
	const palette = parse(await Bun.file(join(root, PALETTE)).text());

	const css: Css = {};
	const keyframes: Css = {};
	const theme: Vars = {};
	const light: Vars = {};
	const dark: Vars = {};
	const problems = [...tokens.problems];

	for (const block of tokens.blocks) {
		if (block.selector === '@theme inline') {
			Object.assign(theme, variables(block));
			cssOf(block.children, css, keyframes, problems);
			continue;
		}
		if (block.selector === ':root') {
			if (block.children.length > 0)
				problems.push(':root: rules nested inside a variable block');
			Object.assign(light, variables(block));
			continue;
		}
		if (block.selector === '.dark') {
			if (block.children.length > 0)
				problems.push('.dark: rules nested inside a variable block');
			Object.assign(dark, variables(block));
			continue;
		}
		cssOf([block], css, keyframes, problems);
	}

	const items: ThemeItems = {
		theme: { cssVars: { theme, light, dark }, css: { ...css, ...keyframes } },
		palette: { cssVars: { light: {}, dark: {} } },
	};

	carry(
		TOKENS,
		tokens.declarations,
		Object.keys(theme).length +
			Object.keys(light).length +
			Object.keys(dark).length +
			leaves(items.theme.css),
		problems,
	);

	const colours = [...palette.problems];
	for (const block of palette.blocks) {
		if (block.selector === ':root')
			Object.assign(items.palette.cssVars.light, variables(block));
		else if (block.selector === '.dark')
			Object.assign(items.palette.cssVars.dark, variables(block));
		else colours.push(`${block.selector}: a palette holds :root and .dark, nothing else`);
	}

	carry(
		PALETTE,
		palette.declarations,
		Object.keys(items.palette.cssVars.light).length +
			Object.keys(items.palette.cssVars.dark).length,
		colours,
	);

	// The manifest, read back as CSS: what the CLI is handed has to be what it can write. Anything
	// that survives the first reading and not the second would reach a project as mangled CSS.
	const reread = parse(render(items));
	const shape = (value: unknown) => JSON.stringify(value);
	if (reread.problems.length > 0)
		throw new ThemeError(`${TOKENS} → manifest → CSS`, reread.problems);
	const expectedBlocks = expected(items);
	if (shape(reread.blocks) !== shape(expectedBlocks)) {
		throw new ThemeError(`${TOKENS} → manifest → CSS`, [
			'the manifest does not read back as the CSS it was written from',
			mismatch(reread.blocks, expectedBlocks),
		]);
	}

	return items;
}

/** The first block two readings disagree about, spelled for a person rather than as JSON. */
function mismatch(read: Block[], want: Block[]): string {
	const at = read.findIndex(
		(block, index) => JSON.stringify(block) !== JSON.stringify(want[index]),
	);
	const index = at === -1 ? Math.min(read.length, want.length) - 1 : at;
	const show = (block: Block | undefined) =>
		block === undefined
			? 'nothing'
			: `${block.selector} {${block.declarations.map(([property, value]) => ` ${property}: ${value};`).join('')} }${
					block.children.length === 0 ? '' : ` +${block.children.length} nested`
				}`;
	return `${index}: read ${show(read[index])} · expected ${show(want[index])}`;
}

/**
 * The blocks `render` produced, read the way a stylesheet is: one per variable block, then a block
 * per `css` key. Spelling them out is what makes the round trip a comparison of two trees rather
 * than of two spellings.
 */
function expected(items: ThemeItems): Block[] {
	const block = (selector: string, pairs: [string, string][]): Block => ({
		selector,
		declarations: pairs,
		children: [],
	});

	const vars = (map: Vars): [string, string][] =>
		Object.entries(map).map(([key, value]) => [`--${key}`, value]);

	const rules = (selector: string, value: Css): Block => {
		const entries = Object.entries(value);
		if (entries.every(([, nested]) => typeof nested === 'string')) {
			return block(selector, Object.entries(value as Vars));
		}
		return {
			selector,
			declarations: [],
			children: entries.map(([nested, deeper]) => rules(nested, deeper as Css)),
		};
	};

	const blocks = [
		['@theme inline', items.theme.cssVars.theme],
		[':root', items.theme.cssVars.light],
		['.dark', items.theme.cssVars.dark],
	] as const;

	return [
		...blocks
			.filter(([, map]) => Object.keys(map).length > 0)
			.map(([selector, map]) => block(selector, vars(map))),
		...Object.entries(items.theme.css).map(([selector, value]) =>
			rules(selector, value as Css),
		),
	];
}
