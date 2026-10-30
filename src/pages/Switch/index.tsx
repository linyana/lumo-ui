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
import States from './demos/states';

const files = ['src/components/ui/switch.tsx'];

const rootProps: Record<string, PropNode> = {
	checked: {
		type: 'boolean',
		description: 'The controlled state. Leave it out and the switch owns its own.',
	},
	defaultChecked: {
		type: 'boolean',
		default: 'false',
		description: 'Whether it starts on, uncontrolled.',
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
		description: 'Stays where it is, and still submits its value.',
	},
	name: {
		type: 'string',
		description: 'The key the value is submitted under; `value` is what is submitted.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the track’s own colours live here, if they must.',
	},
	'...props': {
		type: 'Base UI SwitchRoot props',
		description: 'render, the element’s own attributes, and `inputRef` for the hidden input.',
	},
};

const thumbProps: Record<string, PropNode> = {
	className: {
		type: 'string',
		description:
			'Merged last through cn(); the knob is one 16px circle, and usually stays one.',
	},
};

const partRows = [
	[
		'Switch.Root',
		'the track',
		'a `<span>` with a hidden `<input>` beside it, so a form and a label both see it.',
	],
	[
		'Switch.Thumb',
		'the knob',
		'Base UI writes `data-checked` on it too, so it moves off its own attribute rather than a prop.',
	],
];

const hookRows = [
	['data-slot="switch" · "switch-thumb"', 'the two parts', 'one element each.'],
	[
		'data-checked · data-unchecked',
		'where the knob is',
		'the track fills with `primary`; the knob travels the track’s inner width.',
	],
	[
		'data-invalid',
		'once the field fails',
		'the track keeps its colour — a switch is not a box to mark up — and the message is the field’s.',
	],
	[
		'disabled · data-disabled · data-readonly',
		'—',
		'half opacity, no pointer; the first is native, the second is what the look reads.',
	],
	[
		':hover · :focus-visible',
		'bg-input-strong',
		'the track darkens one step for both, and focus draws no outline. On, it is already `primary`: it keeps the ring instead, because a fill has no step left to take.',
	],
];

const usageImport = "import { Switch } from '@/components/ui/switch';";
const usageExample = `<Switch.Root name="preview" defaultChecked>
	<Switch.Thumb />
</Switch.Root>`;

export function SwitchPage() {
	return (
		<DocPage title="switch" description="on or off, and it stays where you put it">
			<DocPreview path="src/pages/Switch/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and no glyph: the whole control is two spans and a colour. the
						hidden input beside them is what the form submits and what the label points
						at.
					</>
				}
			>
				<DocInstall name="switch" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						a switch takes effect as it moves, which is why it wants a sentence beside
						it rather than a save button under it. a form that needs confirming wants a
						checkbox.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="both ends, and the rest"
				note={
					<>
						Base UI writes `data-checked` on the track and on the knob, so the whole
						control is one attribute with two elements reading it. the travel is the
						track’s inner width — 36 less the 2px of padding and the knob’s own 16 — and
						it is a transform, so nothing reflows as it moves.
					</>
				}
			>
				<DocPreview path="src/pages/Switch/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the track takes Base UI’s props; the knob takes a class name and nothing else."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Switch.Root</Mono> — the track
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Switch.Thumb</Mono> — the knob
						</p>
						<PropTable props={thumbProps} />
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
				note="one boolean, written on the track and read by the knob — a switch has no third state to describe."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
