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
import Controlled from './demos/controlled';
import States from './demos/states';

const files = ['src/components/lumo/ui/RadioGroup.tsx'];

const rootProps: Record<string, PropNode> = {
	value: {
		type: 'Value',
		description:
			'The value of the item that is selected. Leave it out and the group owns its own.',
	},
	defaultValue: {
		type: 'Value',
		description: 'The value selected on the first render, uncontrolled.',
	},
	onValueChange: {
		type: '(value, eventDetails) => void',
		description: 'Fires when the selection moves, by click or by arrow key.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Every item in the group, as one. `Field.Item disabled` does one of them.',
	},
	readOnly: {
		type: 'boolean',
		default: 'false',
		description: 'Cannot be moved, and still submits the value it holds.',
	},
	required: {
		type: 'boolean',
		default: 'false',
		description:
			'A native constraint on the items, so a `Field` above the group can report it empty.',
	},
	name: {
		type: 'string',
		description:
			'The key the chosen value is submitted under. One for the group, not the item.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the group is a `grid gap-2`, and a row is here.',
	},
	'...props': {
		type: 'Base UI RadioGroup props',
		description: 'render, and the element’s own attributes.',
	},
};

const itemProps: Record<string, PropNode> = {
	value: {
		type: 'Value',
		required: true,
		description: 'What selecting this item puts in the group’s value.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'One option that cannot be picked, while the rest of the group can.',
	},
	readOnly: {
		type: 'boolean',
		default: 'false',
		description: 'Visible as it is, and not selectable.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(); `mt-0.5` is the usual nudge beside a two-line label.',
	},
	'...props': {
		type: 'Base UI Radio props',
		description: 'render, `label`, and the element’s own attributes.',
	},
};

const partRows = [
	[
		'RadioGroup.Root',
		'the group',
		'a `<div role="radiogroup">`: one value, and the arrow keys between the items.',
	],
	[
		'RadioGroup.Item',
		'one option',
		'Base UI’s `Radio`, named for what it is inside the group: a `<span>` and a hidden `<input>`.',
	],
	[
		'RadioGroup.Indicator',
		'the dot',
		'mounted for the selected item only, so an unselected circle carries no hidden child.',
	],
];

const hookRows = [
	['data-slot="radio-group" · "radio" · "radio-indicator"', 'one each', 'one element per part.'],
	[
		'data-checked · data-unchecked',
		'on the selected item',
		'the border turns `primary` and the dot fills; the dot is scaled in, so nothing jumps.',
	],
	[
		'data-invalid',
		'once the field fails',
		'the border turns destructive, for the same reason an input’s does.',
	],
	[
		'disabled · data-disabled · data-readonly',
		'—',
		'half opacity and no pointer, on the item or on the whole group.',
	],
	[
		':hover · :focus-visible',
		'border-input-strong',
		'the item’s edge steps one darker for both, and focus draws no outline. A selected item answers focus only — the ring around the dot already says “on”.',
	],
];

const usageImport = "import { RadioGroup } from '@/components/lumo/ui/RadioGroup';";
const usageExample = `<Field.Root>
	<Field.Label>plan</Field.Label>
	<RadioGroup.Root defaultValue="team">
		<Field.Item>
			<RadioGroup.Item value="team">
				<RadioGroup.Indicator />
			</RadioGroup.Item>
			<Field.Label>team</Field.Label>
		</Field.Item>
	</RadioGroup.Root>
</Field.Root>`;

export function RadioGroupPage() {
	return (
		<DocPage title="radio group" description="exactly one of these, and never none">
			<DocPreview path="src/pages/RadioGroup/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. Base UI ships the group and the item as two imports; they are one
						namespace here because neither is much use without the other.
					</>
				}
			>
				<DocInstall
					name="radio-group"
					packages={['@base-ui/react']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						<Mono>Field.Item</Mono> is the row: it ties the label to the item beside it,
						so the words are clickable and a reader announces the two together. the
						group’s own name goes above, on the field.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a row, and an option that is out"
				note={
					<>
						the group is a grid of rows; two options side by side are{' '}
						<Mono>grid-flow-col</Mono> at the call site rather than another variant.
						disable one item and the rest of the group keeps its arrows and its tab
						stop, which is what makes it a group.
					</>
				}
			>
				<DocPreview path="src/pages/RadioGroup/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="the value, outside"
				note={
					<>
						<Mono>onValueChange</Mono> hands over the item’s value, not its index, so a
						group is usually the whole of its own state. the item that is selected keeps
						the only tab stop: arrows move the selection, tab leaves the group.
					</>
				}
			>
				<DocPreview path="src/pages/RadioGroup/demos/controlled.tsx">
					<Controlled />
				</DocPreview>
			</DocSection>

			<DocSection title="api reference" note="two sets of props, one namespace.">
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>RadioGroup.Root</Mono> — the group
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>RadioGroup.Item</Mono> — one option
						</p>
						<PropTable props={itemProps} />
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
				note="selection is written on the item, so a selected row can be styled as a whole from plain css."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
