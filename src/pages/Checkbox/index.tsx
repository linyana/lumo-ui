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

const files = ['src/components/ui/checkbox.tsx'];

const rootProps: Record<string, PropNode> = {
	checked: {
		type: 'boolean',
		description: 'The controlled state. Leave it out and the box owns its own.',
	},
	defaultChecked: {
		type: 'boolean',
		default: 'false',
		description: 'The state it opens with, uncontrolled.',
	},
	indeterminate: {
		type: 'boolean',
		default: 'false',
		description:
			'Neither ticked nor not — the reason a “select all” box draws a dash. It is drawn on top of `checked`, so the two can both be true.',
	},
	onCheckedChange: {
		type: '(checked: boolean, eventDetails) => void',
		description: 'Base UI’s change event, which also carries whether the change was cancelled.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Half opacity and no pointer. `Field.Item disabled` sets the same flag.',
	},
	readOnly: {
		type: 'boolean',
		default: 'false',
		description: 'Cannot be changed by the reader, and still submitted with the form.',
	},
	required: {
		type: 'boolean',
		default: 'false',
		description:
			'A native constraint, so a `Field` above it reports the box as invalid and draws the border.',
	},
	name: {
		type: 'string',
		description: 'The key the value is submitted under.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); a size override lives here, and nowhere else.',
	},
	'...props': {
		type: 'Base UI CheckboxRoot props',
		description: 'render, the element’s own attributes, and `value` for a form that wants one.',
	},
};

const partRows = [
	[
		'Checkbox.Root',
		'the box',
		'a `<span>` with a hidden `<input>` beside it, so a form and a native label both see a checkbox.',
	],
	[
		'Checkbox.Indicator',
		'the tick',
		'mounted only while the box holds a value. lucide’s `Check`, or `Minus` when indeterminate.',
	],
];

const hookRows = [
	['data-slot="checkbox" · "checkbox-indicator"', 'the two parts', 'one element each.'],
	[
		'data-checked · data-unchecked',
		'which of the two states',
		'the fill turns `primary`, the border follows it.',
	],
	[
		'data-indeterminate',
		'on the box and the tick',
		'the tick swaps for a dash; nothing has to be told twice.',
	],
	[
		'data-invalid',
		'once the field fails',
		'border turns destructive, for the same reason an input’s does.',
	],
	[
		'disabled · data-disabled · data-readonly',
		'—',
		'half opacity, no pointer; the first is native, the second is what the look reads.',
	],
	[
		':hover · :focus-visible',
		'border-input-strong',
		'the box’s edge steps one darker for both, and focus draws no outline. A checked box answers focus only — hover has nothing to add to “on”.',
	],
];

const usageImport = "import { Checkbox } from '@/components/ui/checkbox';";
const usageExample = `<Checkbox.Root name="readme" defaultChecked>
	<Checkbox.Indicator />
</Checkbox.Root>`;

export function CheckboxPage() {
	return (
		<DocPage title="checkbox" description="one of several, any number of them">
			<DocPreview path="src/pages/Checkbox/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the box, the input inside it and the state are Base UI’s; the
						appearance is a 16px square, a border and a fill.
					</>
				}
			>
				<DocInstall name="checkbox" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the root carries the name and the state; the indicator carries the tick.{' '}
						<Mono>Field.Item</Mono> is the row — it is what makes the words beside the
						box a label for it.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="four states, and a fifth"
				note={
					<>
						indeterminate is not a decoration: a group whose parent box is ticked,
						unticked and half-ticked needs the third state to say “some of these”.{' '}
						<Mono>Indicator</Mono> draws the dash itself, on{' '}
						<Mono>data-indeterminate</Mono>, so nothing at the call site has to choose
						between two glyphs. read only still submits; disabled does not.
					</>
				}
			>
				<DocPreview path="src/pages/Checkbox/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in a field"
				note={
					<>
						a checkbox registers with the field above it the way an input does, so{' '}
						<Mono>required</Mono> is enough to be both reported and drawn. the message
						sits under the whole row rather than beside the box, because that is where a
						sentence about the choice belongs.
					</>
				}
			>
				<DocPreview path="src/pages/Checkbox/demos/field.tsx">
					<InField />
				</DocPreview>
			</DocSection>

			<DocSection title="api reference" note="no size, no variant: a box is 16px.">
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Checkbox.Root</Mono> — the box
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable
							head={['part', 'what it is for', 'notes']}
							mono={[0]}
							rows={partRows}
						/>
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the state is written on the box by Base UI, so a call site styles the box rather than tracking a boolean of its own."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
