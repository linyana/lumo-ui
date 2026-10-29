import { Code } from '@/components/lumo/ui/Code';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Basic from './demos/basic';
import Rows from './demos/rows';

const files = ['src/components/lumo/ui/Badge.tsx'];

const badgeProps: Record<string, PropNode> = {
	variant: {
		type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info"',
		default: '"default"',
		description:
			'Which fill it wears. The first three are the fills a button already has; the last four are a tint of an outcome colour, because an outcome is a fact and not a control.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); a size, an uppercase, a wider pad all land here.',
	},
	'...props': {
		type: 'HTMLSpanElement props',
		description: 'The label is a span: aria-label, title, data-* and the rest pass through.',
	},
};

const hookRows = [
	['data-slot="badge"', 'the label', 'a span that holds its word and nothing else.'],
	[
		'data-variant',
		'the fill',
		'written on the DOM, so a project can restyle one variant from plain CSS.',
	],
	[
		'bg-destructive/10 · text-destructive',
		'an outcome',
		'the hue at a tenth of its weight behind the word that names it — the same colour a filled button would use, held back to a tint.',
	],
	[
		'px-1.5 py-0.5 · text-xs',
		'its size',
		'one size, read at a glance. A badge that needs to be read carefully is a paragraph.',
	],
	['align-middle', 'its seat', 'so it sits on a line of text instead of lifting off it.'],
];

const usageImport = "import { Badge } from '@/components/lumo/ui/Badge';";
const usageExample = `<div className="flex items-center gap-2">
	<span>deploy</span>
	<Badge variant="success">passed</Badge>
</div>`;

export function BadgePage() {
	return (
		<DocPage title="badge" description="a word that labels the thing beside it">
			<DocPreview path="src/pages/Badge/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one span and one dependency, <Mono>cn()</Mono>: there is no behaviour here
						to borrow, so nothing is owed to Base UI. it borrows the icon slot from{' '}
						<Mono>control</Mono>, which is what keeps a glyph in a badge the size of the
						text around it.
					</>
				}
			>
				<DocInstall
					name="badge"
					packages={['tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts', 'src/lib/control.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						a badge is a label, not a button: it never takes the pointer and never
						carries the whole meaning of a row. if the word has to be pressed, it wants{' '}
						<Mono>Button</Mono> at <Mono>size=&quot;sm&quot;</Mono>.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="where it sits"
				note={
					<>
						the word a badge carries is short on purpose, and the row it belongs to is
						what supplies the noun. that is also why it sits at the end of the line and
						never at its start: an outcome answers the question the row just asked.
					</>
				}
			>
				<DocPreview path="src/pages/Badge/demos/rows.tsx">
					<Rows />
				</DocPreview>
			</DocSection>

			<DocSection
				title="an outcome is not a volume"
				note={
					<>
						<Mono>destructive</Mono>, <Mono>success</Mono>, <Mono>warning</Mono> and{' '}
						<Mono>info</Mono> are a tint of their hue rather than its solid fill. a row
						of four solid blocks would be four shouts, and the loudest one would win the
						row regardless of what the reader came for. the colour is still there to be
						found — it is the word&rsquo;s ink.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					inside a surface that is already tinted — a muted row, a <Mono>Card</Mono>{' '}
					footer — <Mono>secondary</Mono> and <Mono>outline</Mono> are the two that stay
					quiet, because they take their colour from the surface instead of adding one.
				</p>
			</DocSection>

			<DocSection title="api reference" note="one prop of its own; the rest is a span's.">
				<PropTable props={badgeProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="nothing to hook: a badge has no state, and that is the point of it."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
