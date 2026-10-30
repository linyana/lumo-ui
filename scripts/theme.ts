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
 */
import { join } from 'node:path';

/** A block of CSS: a selector or at-rule, its declarations, and whatever it nests. */
type Block = {
	selector: string;
	declarations: [string, string][];
	children: Block[];
};

/**
 * A `selector → declarations` map, as `registry.json` spells `css`: one brace per level, so a
 * layer's rules and a keyframe's steps are the same shape.
 */
type Css = { [key: string]: string | Css };
type Vars = Record<string, string>;

const root = join(import.meta.dir, '..');
const TOKENS = 'src/styles/lumo-tokens.css';
const PALETTE = 'src/styles/lumo-palette.css';

/**
 * The stylesheet, read as blocks. Comments go first — they carry semicolons, braces and quoted
 * sentences, and say so at length — and then a header runs to the first `{`, `;` or `}`, which is
 * what tells a block from a declaration or from a statement with no body at all.
 */
function parse(source: string): Block[] {
	const text = source.replace(/\/\*[\s\S]*?\*\//g, '');
	let index = 0;

	const top: Block = { selector: '', declarations: [], children: [] };

	/** A header or a value on one line: the file wraps both, the manifest has no columns. */
	const oneLine = (value: string) => value.trim().replace(/\s+/g, ' ');

	/** `property: value`, or `undefined` for a statement that carries no colon-bound pair. */
	const pair = (body: string): [string, string] | undefined => {
		const at = body.indexOf(':');
		if (at === -1) return undefined;
		return [oneLine(body.slice(0, at)), oneLine(body.slice(at + 1))];
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

			// A statement that is not a declaration is an at-rule with no body: `@custom-variant`
			// and its like, which keeps its whole header as the key.
			const declaration = body.trim().startsWith('@') ? undefined : pair(body);
			if (declaration === undefined) {
				if (body.trim() !== '') {
					into.children.push({ selector: oneLine(body), declarations: [], children: [] });
				}
			} else {
				into.declarations.push(declaration);
			}

			if (!statement) return;
		}
	}

	contents(top);
	return top.children;
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
 */
function cssOf(blocks: Block[], into: Css, keyframes: Css) {
	for (const block of blocks) {
		if (block.selector.startsWith('@keyframes')) {
			const steps: Css = {};
			for (const step of block.children) steps[step.selector] = declarations(step);
			keyframes[block.selector] = steps;
			continue;
		}

		if (!block.selector.startsWith('@')) {
			into[block.selector] = declarations(block);
			continue;
		}

		const nested: Css = {};
		cssOf(block.children, nested, keyframes);
		into[block.selector] = nested;
	}
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

	for (const block of tokens) {
		if (block.selector === '@theme inline') {
			Object.assign(theme, variables(block));
			cssOf(block.children, css, keyframes);
			continue;
		}
		if (block.selector === ':root') Object.assign(light, variables(block));
		else if (block.selector === '.dark') Object.assign(dark, variables(block));
		else cssOf([block], css, keyframes);
	}

	const colours = { light: {}, dark: {} } as { light: Vars; dark: Vars };
	for (const block of palette) {
		if (block.selector === ':root') Object.assign(colours.light, variables(block));
		if (block.selector === '.dark') Object.assign(colours.dark, variables(block));
	}

	return {
		theme: { cssVars: { theme, light, dark }, css: { ...css, ...keyframes } },
		palette: { cssVars: colours },
	};
}
