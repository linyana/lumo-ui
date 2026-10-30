import { Code } from '@/components/ui/code';
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
import InField from './demos/field';
import States from './demos/states';

const files = ['src/components/ui/textarea.tsx'];

const textareaProps: Record<string, PropNode> = {
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description:
			'64 / 80 / 96 of minimum height, with the type to match — the same three tiers an Input takes, so a short one and a long one line up in a column. The height itself is `rows`, or the corner the reader drags.',
	},
	rows: {
		type: 'number',
		description: 'The browser’s own: how tall it opens, above the minimum the size sets.',
	},
	value: {
		type: 'string',
		description: 'The controlled value — the text is the child, so this is the whole of it.',
	},
	defaultValue: {
		type: 'string',
		description: 'The text it opens with, uncontrolled.',
	},
	onChange: {
		type: '(event) => void',
		description: 'The native change; the field is told by the control, not by this.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); `resize-none` and the width live here.',
	},
	'...props': {
		type: 'HTMLTextAreaElement props',
		description: 'Every native attribute, including `required`, `maxLength` and `placeholder`.',
	},
};

const hookRows = [
	['data-slot="textarea"', 'the control', 'one element; there is no wrapper to reach past.'],
	['data-size', 'the current size', 'mirrored onto the DOM for plain CSS.'],
	[
		'data-invalid · aria-invalid',
		'present once the field fails',
		'the border turns destructive. the second is what a form library of your own would set.',
	],
	[
		'data-filled · data-dirty · data-touched',
		'Base UI’s field state',
		'written by `Field.Control`, for a label or a hint that reacts.',
	],
	[
		'disabled · data-disabled · readonly',
		'—',
		'half opacity, no pointer; a read-only one keeps `bg-muted`, because it is still a value.',
	],
	['::placeholder', 'text-muted-foreground', 'the only colour a placeholder is allowed.'],
	[
		':hover · :focus-visible',
		'border-input-strong',
		'the border steps one darker for both, and focus draws no outline: the field moves its own edge instead.',
	],
];

const usageImport = "import { Textarea } from '@/components/ui/textarea';";
const usageExample = `<Textarea
	size="md"
	rows={4}
	placeholder="what changed, and what it costs"
	className="max-w-sm"
/>`;

export function TextareaPage() {
	return (
		<DocPage title="textarea" description="several lines of text, in the same box as an input">
			<DocPreview path="src/pages/Textarea/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and the element really is the browser’s — Base UI ships no
						textarea. the one thing the file adds is the seam:{' '}
						<Mono>Field.Control</Mono>, which is what puts the id, the describedby and
						the invalid flag on a native element.
					</>
				}
			>
				<DocInstall name="textarea" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						it fills its container, so a measure is the call site’s business; and it can
						be dragged taller from the corner, because a long field is the one control a
						reader usually wants more room in.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="states, and a height it keeps"
				note={
					<>
						read-only is still a box you can put a cursor in, drawn as a settled value;
						disabled is not. <Mono>resize-none</Mono> is the call site saying the height
						is a decision, not a suggestion — and then <Mono>rows</Mono> is the whole of
						it.
					</>
				}
			>
				<DocPreview path="src/pages/Textarea/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in a field"
				note={
					<>
						inside <Mono>Field.Root</Mono> it is labelled and validated without a prop
						of its own, exactly as <Mono>Input</Mono> is — which is the point of
						mounting a native element through <Mono>Control</Mono> instead of wrapping
						it.
					</>
				}
			>
				<DocPreview path="src/pages/Textarea/demos/field.tsx">
					<InField />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="one variant of its own; the rest is a textarea."
			>
				<PropTable props={textareaProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the same hooks an input carries, because a field cannot tell the two apart."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
