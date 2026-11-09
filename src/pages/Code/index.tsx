/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	DocUsage,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Basic from './demos/basic';
import LineNumbers from './demos/line-numbers';
import Surfaces from './demos/surfaces';
import Unknown from './demos/unknown';
import Wrap from './demos/wrap';

const files = ['src/components/ui/code.tsx'];

const codeProps: Record<string, PropNode> = {
	code: {
		required: true,
		type: 'string',
		description: 'The source itself, newlines and all. Nothing reads it but the highlighter.',
	},
	language: {
		type: 'string',
		description:
			'Grammar to highlight with, by name or by the spellings people write — ts, sh, yml. Anything we do not ship falls back to plain text instead of failing.',
	},
	fileName: {
		type: 'string',
		description: 'Shown instead of the language when the built-in header is enabled.',
	},
	variant: {
		type: '"filled" | "outlined" | "ghost"',
		default: '"ghost"',
		description: 'Transparent by default; compose with Card for a surface, title and actions.',
	},
	showLineNumbers: {
		type: 'boolean',
		default: 'false',
		description:
			'A column of numbers, max-content wide so it takes only its widest number, with the text in the slack.',
	},
	wrap: {
		type: 'boolean',
		default: 'false',
		description:
			'Folds long lines instead of scrolling them sideways; the block stays as wide as the page.',
	},
	copyable: {
		type: 'boolean',
		default: 'true',
		description: 'Shows the copy button when the built-in header is enabled.',
	},
	header: {
		type: 'boolean',
		default: 'false',
		description:
			'Opts into the built-in title and copy bar. Leave it off when Card supplies the header.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(), onto the block itself.',
	},
	'...props': {
		type: 'HTMLDivElement props',
		description: 'The block is a div: id, data-*, aria-* all land on it.',
	},
};

const hookRows = [
	['data-slot="code"', 'the block', 'a div carrying the variant’s colours.'],
	['data-variant', 'filled | outlined | ghost', 'mirrored onto it, so plain CSS can reach it.'],
	['data-slot="code-header"', 'the bar above', 'min-h-9, border-b unless the block is ghost.'],
	[
		'data-slot="code-title"',
		'the file or the language',
		'truncates; the language follows it when both are given.',
	],
	[
		'data-slot="code-body"',
		'the pre',
		'scrolls on its own, so the page never moves sideways for it.',
	],
	['data-slot="code-line"', 'one line', 'a grid cell; an empty line still occupies its row.'],
	[
		'data-slot="code-line-number"',
		'its number',
		'select-none, so copying the code does not take the numbers.',
	],
	[
		'data-slot="code-token"',
		'a run of one style',
		'colour arrives as --code-light and --code-dark, and .dark picks.',
	],
	[
		'data-slot="code-copy"',
		'the copy button',
		'a Button, size icon, so it loads when the clipboard is slow.',
	],
];

const languages = [
	'bash',
	'c',
	'cpp',
	'csharp',
	'css',
	'diff',
	'docker',
	'go',
	'graphql',
	'html',
	'java',
	'javascript',
	'json',
	'jsonc',
	'kotlin',
	'less',
	'lua',
	'markdown',
	'php',
	'python',
	'ruby',
	'rust',
	'scss',
	'shellscript',
	'sql',
	'svelte',
	'swift',
	'toml',
	'tsx',
	'typescript',
	'vue',
	'xml',
	'yaml',
];

const usageImport = `import { Card } from '@/components/ui/card';
import { Code, Copy } from '@/components/ui/code';`;
const usageExample = `<Card.Root className="gap-0 overflow-hidden py-0">
	<Card.Header className="min-h-9 border-b border-border/50 px-3 py-1">
		<Card.Title className="font-mono text-xs font-medium">cn.ts</Card.Title>
		<Card.Action>
			<Copy value={source} />
		</Card.Action>
	</Card.Header>
	<Card.Content className="min-w-0 px-0">
		<Code code={source} language="ts" showLineNumbers />
	</Card.Content>
</Card.Root>`;

export function CodePage() {
	return (
		<DocPage title="code" description="source, coloured; the surface is yours to compose">
			<DocPreview path="src/pages/Code/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						the block is one file; the highlighter behind it is another, and it is the
						half that carries the weight. <Mono>Code</Mono> also borrows{' '}
						<Mono>Button</Mono> for the exported copy button. Add <Mono>Card</Mono> when
						you want a surface with a title and actions.
					</>
				}
			>
				<DocInstall
					name="code"
					files={files}
					reaches={[
						'src/lib/shiki.ts',
						'src/components/ui/button.tsx',
						'src/components/ui/spinner.tsx',
						'src/lib/utils.ts',
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="Code renders the source. Card owns the surface, title and copy action."
			>
				<DocUsage snippets={[usageImport, usageExample]} />
			</DocSection>

			<DocSection
				title="line numbers"
				note={
					<>
						numbers are a column, not part of the text: wide as the widest number and no
						wider, and out of the way when the block is copied.
					</>
				}
			>
				<DocPreview path="src/pages/Code/demos/line-numbers.tsx">
					<LineNumbers />
				</DocPreview>
			</DocSection>

			<DocSection
				title="surfaces"
				note="a muted Card, the default Card surface, and Code on its own with no header or background."
			>
				<DocPreview path="src/pages/Code/demos/surfaces.tsx">
					<Surfaces />
				</DocPreview>
			</DocSection>

			<DocSection
				title="wrapping"
				note={
					<>
						long lines scroll sideways by default; with <Mono>wrap</Mono> they fold and
						the block stays as narrow as the page leaves it.
					</>
				}
			>
				<DocPreview path="src/pages/Code/demos/wrap.tsx">
					<Wrap />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a language we do not ship"
				note={
					<>
						<Mono>resolveLanguage</Mono> answers <Mono>text</Mono> for anything it does
						not know, so the block still reads — just without colour.
					</>
				}
			>
				<DocPreview path="src/pages/Code/demos/unknown.tsx">
					<Unknown />
				</DocPreview>
			</DocSection>

			<DocSection
				title="languages"
				note={
					<>
						one grammar per name, fetched the first time a block asks for it — a page of
						TypeScript never downloads the PHP one. these are the names that carry a
						grammar, and the spellings people write are folded onto them:{' '}
						<Mono>ts</Mono> → <Mono>typescript</Mono>, <Mono>sh</Mono> →{' '}
						<Mono>bash</Mono>, <Mono>yml</Mono> → <Mono>yaml</Mono>, <Mono>py</Mono> →{' '}
						<Mono>python</Mono>, <Mono>jsx</Mono> and <Mono>js</Mono> →{' '}
						<Mono>javascript</Mono>, <Mono>rs</Mono> → <Mono>rust</Mono>,{' '}
						<Mono>md</Mono> → <Mono>markdown</Mono>.
					</>
				}
			>
				<p className="flex flex-wrap gap-1.5 font-mono text-xs text-muted-foreground">
					{languages.map((name) => (
						<span key={name} className="rounded-sm bg-muted px-1.5 py-0.5">
							{name}
						</span>
					))}
				</p>
			</DocSection>

			<DocSection
				title="one pass per snippet"
				note={
					<>
						the same source in two blocks is tokenised once, and the answer is kept: a
						block that remounts — a route you come back to, a fold you reopen — paints
						colour on its first frame. before anything is known the block shows the code
						uncoloured, which is the same shape with the colour missing rather than a
						placeholder that says so.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the cache is keyed by grammar and source and keeps the last 200; a grammar still
					arrives only when a block asks for one, so an unused language is never fetched.
				</p>
				<p className="text-sm text-muted-foreground">
					and the work waits for an idle slice, one block at a time, and for the block to
					come close to the viewport — a page of source mounting at once would otherwise
					hold up the paint the click asked for. a block that is off the page, behind
					another tab or left before its turn never tokenises at all: the plain text is
					the same shape, so the block is only missing its colour. on a page of examples
					that is most of them.
				</p>
			</DocSection>

			<DocSection title="api reference" note="the code is the only required prop.">
				<PropTable props={codeProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note={
					<>
						colour rides on two custom properties per token rather than on a class, so
						switching the theme repaints and never re-tokenises.
					</>
				}
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
