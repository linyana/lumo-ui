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
import Field from './demos/field';
import Icon from './demos/icon';
import Sizes from './demos/sizes';
import States from './demos/states';

const files = ['src/components/lumo/ui/Input.tsx'];

const inputProps: Record<string, PropNode> = {
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description:
			'32 / 36 / 40 tall, with the type to match — the same three tiers a Button takes, so the two line up in a row. The browser’s own numeric `size` attribute is not reachable: the width belongs to the container.',
	},
	value: {
		type: 'string',
		description: 'The controlled value. Leave it out and the field state is the browser’s.',
	},
	defaultValue: {
		type: 'string',
		description: 'The value it opens with, uncontrolled.',
	},
	onValueChange: {
		type: '(value: string, details) => void',
		description: 'Base UI’s change event, which carries whether the change was cancelled.',
	},
	type: {
		type: '"text" | "email" | "password" | "search" | …',
		default: '"text"',
		description:
			'The browser’s own; it decides the keyboard, the native constraints, and nothing about the look.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); padding for a glyph, and the width, live here.',
	},
	'...props': {
		type: 'Base UI Input props',
		description: 'render, the element’s attributes, and the native `required` / `pattern` set.',
	},
};

const hookRows = [
	['data-slot="input"', 'the control', 'one element, so there is no wrapper to reach past.'],
	['data-size', 'the current size', 'mirrored onto the DOM for plain CSS.'],
	[
		'data-invalid · aria-invalid',
		'present once the field fails',
		'the border turns destructive. the second is written by Base UI too, and is what a form library of your own would set.',
	],
	[
		'data-filled · data-dirty · data-touched',
		'Base UI’s field state',
		'for a label or a hint that reacts.',
	],
	[
		'disabled · data-disabled',
		'—',
		'half opacity, no pointer; the attribute is native, the flag comes from Field.',
	],
	['::placeholder', 'text-muted-foreground', 'the only colour a placeholder is allowed.'],
	[':focus-visible', '—', 'the ring, declared once in lumo-tokens.css.'],
];

const usageImport = "import { Input } from '@/components/lumo/ui/Input';";
const usageExample = `<Input
	size="md"
	type="email"
	placeholder="you@example.com"
	className="max-w-sm"
/>`;

export function InputPage() {
	return (
		<DocPage title="input" description="a single line of text, 32, 36 or 40 tall">
			<DocPreview path="src/pages/Input/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the element and its relationship to a field are Base UI’s; the
						appearance is a border colour, a radius and three heights.
					</>
				}
			>
				<DocInstall
					name="input"
					packages={['@base-ui/react', 'tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						it fills its container and does nothing about its width.{' '}
						<Mono>className</Mono> is where a measure belongs — an input that is a whole
						page wide is a form nobody proofread.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="sizes"
				note="the same 32 / 36 / 40 the buttons take, so an input and the button beside it meet on the same line."
			>
				<DocPreview path="src/pages/Input/demos/sizes.tsx">
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a glyph, beside it"
				note={
					<>
						no icon slot, and no wrapper element: a search field is the input with room
						added on the left, and the glyph placed against it. a slot would have to own
						the padding, the size and the alignment, and would still be the call site’s
						glyph.
					</>
				}
			>
				<DocPreview path="src/pages/Input/demos/icon.tsx">
					<Icon />
				</DocPreview>
			</DocSection>

			<DocSection
				title="states"
				note={
					<>
						read-only is still a box you can put a cursor in — it is drawn as a settled
						value rather than a wait for one — while disabled is not. an invalid input
						drawn by hand takes <Mono>aria-invalid</Mono> and gets the same border a
						field would have given it.
					</>
				}
			>
				<DocPreview path="src/pages/Input/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in a field"
				note={
					<>
						inside <Mono>Field.Root</Mono> the input is labelled and validated without a
						prop of its own — it registers itself, so the border, the describedby and
						the message are the field’s doing.
					</>
				}
			>
				<DocPreview path="src/pages/Input/demos/field.tsx">
					<Field />
				</DocPreview>
			</DocSection>

			<DocSection title="api reference" note="one variant of its own; the rest is an input.">
				<PropTable props={inputProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="state arrives from the field above it, so the input is styled by what the field already knows."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
