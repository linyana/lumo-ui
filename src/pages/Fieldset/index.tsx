import { Code } from '@/components/ui/code';
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
import Groups from './demos/groups';

const files = ['src/components/ui/fieldset.tsx'];

const rootProps: Record<string, PropNode> = {
	disabled: {
		type: 'boolean',
		default: 'false',
		description:
			'Disables every field inside, through the element’s own `disabled` — a browser refuses the controls whether or not they know about it. Nested groups inherit it.',
	},
	render: {
		type: 'ReactElement',
		description: 'Base UI’s composition prop, for a group that is not a `<fieldset>`.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(); the columns, the width and the row spacing live here.',
	},
	'...props': {
		type: 'fieldset attributes',
		description: '`name`, `form`, and the rest of the element’s own.',
	},
};

const legendProps: Record<string, PropNode> = {
	render: {
		type: 'ReactElement',
		description: 'Composition, as everywhere else.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the type and the rule under it live here.',
	},
};

const partRows = [
	[
		'Fieldset.Root',
		'the group',
		'a real `<fieldset>`, with the frame and the browser’s `min-width` taken off.',
	],
	[
		'Fieldset.Legend',
		'the name of it',
		'a `<div>` whose id the group points its own `aria-labelledby` at.',
	],
];

const hookRows = [
	[
		'data-slot',
		'fieldset · fieldset-legend',
		'the two parts, so either can be reached from plain CSS.',
	],
	[
		'data-disabled',
		'on the group and on the legend',
		'what fades the heading; the controls inside fade through their own `Field.Root`.',
	],
	[
		'aria-labelledby',
		'the legend’s id, on the group',
		'written by the group, so the heading cannot be separated from what it names.',
	],
	[
		'disabled',
		'the attribute, on the element',
		'a browser disables everything inside without JavaScript having a say.',
	],
];

const usageImport = `import { Fieldset } from '@/components/ui/fieldset';
import { Field } from '@/components/ui/field';`;
const usageExample = `<Fieldset.Root>
	<Fieldset.Legend>billing details</Fieldset.Legend>
	<Field.Root name="company">…</Field.Root>
	<Field.Root name="taxId">…</Field.Root>
</Fieldset.Root>`;
const disabledExample = `<Fieldset.Root disabled>
	<Fieldset.Legend>billing details</Fieldset.Legend>
	…
</Fieldset.Root>`;

export function FieldsetPage() {
	return (
		<DocPage title="fieldset" description="a heading over the fields it names">
			<DocPreview path="src/pages/Fieldset/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and no appearance beyond stripping the frame: a box drawn around
						the fields would say what the legend over them already says.{' '}
						<Mono>Field</Mono> draws the rows inside it.
					</>
				}
			>
				<DocInstall name="fieldset" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the legend is the group’s accessible name, and the only thing that separates
						one group from the next. the fields keep their own names — a group is a
						heading, not a prefix, so a value is submitted as <Mono>company</Mono>{' '}
						rather than as <Mono>billing.company</Mono>.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="more than one answer"
				note={
					<>
						a long form is several questions, and each one gets a legend. a screen
						reader reading the second field hears “city” and also hears that it is in
						“where it goes” — the same thing the eye gets from the heading. the group
						works inside a <Mono>Form</Mono> like any other part of it: its fields are
						submitted under their own names, all in one object.
					</>
				}
			>
				<DocPreview path="src/pages/Fieldset/demos/groups.tsx">
					<Groups />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a group that cannot be answered"
				note={
					<>
						<Mono>disabled</Mono> is the element’s own, so the controls inside are
						refused by the browser rather than by a handler — and the legend dims with
						them, because a heading over fields nobody can fill is a lie.
					</>
				}
			>
				<Code code={disabledExample} language="tsx" header={false} />
			</DocSection>

			<DocSection
				title="api reference"
				note="the root is a `<fieldset>`, so its props are the element’s."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Fieldset.Root</Mono> — the group
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Fieldset.Legend</Mono> — the name of it
						</p>
						<PropTable props={legendProps} />
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
				note="the group and its heading are joined by an id written on the heading, so the two cannot drift apart."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
