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
import Errors from './demos/errors';

const files = ['src/components/ui/form.tsx'];

const formProps: Record<string, PropNode> = {
	errors: {
		type: 'Record<string, string | string[]>',
		description:
			'Verdicts from outside the browser — a server, a schema — keyed by the field’s `name`. Each lands in that field’s own `Error`, where it wins the line over a `match` or a written sentence; the field clears its own once it is edited.',
	},
	validationMode: {
		type: '"onSubmit" | "onBlur" | "onChange"',
		default: '"onSubmit"',
		description:
			'When every field inside is checked. onSubmit waits for the submit, then re-checks a field as it changes; the same prop on one `Field.Root` wins for that field.',
	},
	onFormSubmit: {
		type: '(values, eventDetails) => void',
		description:
			'The values as an object, keyed by the fields’ names, once every one of them passed. `preventDefault()` is already called, so this is the whole handler.',
	},
	actionsRef: {
		type: 'RefObject<{ validate: (name?) => void }>',
		description:
			'Checks the whole form on demand, or one field by name — for a step that must be settled before the reader may leave it.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(); the width and the spacing between fields live here.',
	},
	'...props': {
		type: 'Base UI Form props',
		description:
			'`action`, `render`, and the native `<form>` attributes, `noValidate` included.',
	},
};

const partRows = [
	['Form', 'the submission', 'a real `<form>`; the fields inside register themselves.'],
	[
		'Field.Root name',
		'the key',
		'the name a value is submitted under, and the name an error is filed under.',
	],
	[
		'Field.Error',
		'the complaint',
		'a constraint, a `validate`, or an entry from `errors` — and a verdict the form holds wins the line.',
	],
];

const submitRows = [
	[
		'onFormSubmit',
		'the values, as an object',
		'only after every field passed — the browser’s constraints and every `validate` alike.',
	],
	[
		'focus',
		'the first field that failed',
		'so a rejected submit puts the reader where the answer is, not at the top of the page.',
	],
	[
		'errors',
		'cleared, one field at a time',
		'editing a field that was refused drops that refusal, without touching the others.',
	],
	[
		'validationMode',
		'"onSubmit", then on change',
		'nothing is reported before the first submit, and everything is reported after it.',
	],
];

const usageImport = `import { Form } from '@/components/ui/form';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';`;
const usageExample = `<Form onFormSubmit={(values) => save(values)}>
	<Field.Root name="email">
		<Field.Label>email</Field.Label>
		<Input type="email" required />
		<Field.Error match="valueMissing">an address is required.</Field.Error>
	</Field.Root>
	<Button type="submit" />
</Form>`;
const modeExample = `<Form validationMode="onBlur">…</Form>
<Field.Root name="email" validationMode="onChange">…</Field.Root>`;

export function FormPage() {
	return (
		<DocPage title="form" description="the fields as one submission">
			<DocPreview path="src/pages/Form/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and almost no appearance of its own: a form is a stack of fields
						and the verdict they share. <Mono>Field</Mono> is what gives each row its
						name and its message, and <Mono>Fieldset</Mono> is what gives a long form
						its headings.
					</>
				}
			>
				<DocInstall name="form" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						a form knows the fields inside it by their <Mono>name</Mono>, so nothing is
						wired between the two by hand: the same name is the key of the value and of
						the error.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a verdict from somewhere else"
				note={
					<>
						a browser can say a value is missing or misshapen, and cannot say a username
						is taken. that answer arrives as <Mono>errors</Mono> — the shape a server
						action returns — and is filed under the field it names, rather than gathered
						above the form where a reader has to match it up themselves. typing in the
						field drops it, so the complaint cannot outlive the value it was about.
					</>
				}
			>
				<DocPreview path="src/pages/Form/demos/errors.tsx">
					<Errors />
				</DocPreview>
			</DocSection>

			<DocSection
				title="when a field is checked"
				note={
					<>
						a form reports nothing until it is submitted, and everything after: the
						first submit is the reader’s answer to “is this ready”, and from then on
						every change re-checks its own field. an account created on a page of its
						own wants the other order, and says so — <Mono>onBlur</Mono> once the reader
						leaves a field, <Mono>onChange</Mono> on every keystroke of it.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={modeExample} language="tsx" header={false} />
					<p className="text-sm text-muted-foreground">
						the form’s mode is the default for every field in it, and one field that
						needs a different one says so on its own root.
					</p>
				</div>
			</DocSection>

			<DocSection
				title="api reference"
				note="the props are Base UI’s, plus a name for the errors."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Form</Mono> — the submission
						</p>
						<PropTable props={formProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts it is made of</p>
						<DocTable
							head={['part', 'what it is for', 'notes']}
							mono={[0]}
							rows={partRows}
						/>
					</div>
				</div>
			</DocSection>

			<DocSection
				title="what a submit does"
				note="one pass over every field, in the order a reader meets them."
			>
				<DocTable head={['step', 'result', 'notes']} mono={[0, 1]} rows={submitRows} />
			</DocSection>
		</DocPage>
	);
}
