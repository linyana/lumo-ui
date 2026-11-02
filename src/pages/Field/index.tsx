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
import Native from './demos/native';
import Validation from './demos/validation';

const files = ['src/components/ui/field.tsx'];

const rootProps: Record<string, PropNode> = {
	name: {
		type: 'string',
		description:
			'The key the value is submitted under. The control can carry one too; the root wins.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Dims the label and the sentence, and disables whatever control is inside.',
	},
	validate: {
		type: '(value, formValues) => string | string[] | null | Promise<…>',
		description:
			'Your own check. A returned string is the message, and it goes on the control as custom validity — so the native `:invalid` and a form’s submit both see it.',
	},
	validationMode: {
		type: '"onSubmit" | "onBlur" | "onChange"',
		default: '"onSubmit"',
		description:
			'When `validate` runs. onSubmit waits for a Form, so a field standing on its own usually wants onBlur.',
	},
	invalid: {
		type: 'boolean',
		description: 'Sets the state from outside, for a field whose verdict lives elsewhere.',
	},
	actionsRef: {
		type: 'RefObject<{ validate: () => void }>',
		description:
			'Re-validates on demand, for a value that changes without the control knowing.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the width and the row spacing live here.',
	},
	'...props': {
		type: 'Base UI FieldRoot props',
		description:
			'render, the element’s own attributes, and the controlled dirty / touched flags.',
	},
};

const partRows = [
	[
		'Field.Label',
		'the name',
		'a real `<label>`, associated by the field, not by a matching htmlFor.',
	],
	[
		'Field.Control',
		'the wiring',
		'id, describedby, invalid; hand it any element through render.',
	],
	['Field.Description', 'the sentence under it', 'muted, and the thing describedby points at.'],
	[
		'Field.Error',
		'the complaint',
		'renders only while the field fails, with the message it was given.',
	],
	[
		'Field.Item',
		'one of several',
		'a row of `flex items-start gap-2`: the control, and the label and description that belong to it.',
	],
	[
		'Field.Validity',
		'the raw state',
		'a function of the ValidityState, for a message Error cannot type.',
	],
];

const hookRows = [
	[
		'data-slot',
		'field · field-label · field-description · field-error · field-item',
		'the four styled parts, and the row that holds one of several.',
	],
	[
		'data-invalid',
		'present on the field and its control',
		'what turns an input’s border destructive.',
	],
	[
		'data-disabled · data-valid · data-touched · data-dirty · data-filled · data-focused',
		'Base UI’s state',
		'mirrored onto the field and onto every control that registered with it.',
	],
	[
		'aria-labelledby',
		'the label’s id',
		'written on the control; there is no htmlFor to get wrong.',
	],
	[
		'aria-describedby',
		'the description and the error',
		'both ids, so a reader hears the explanation before the complaint.',
	],
	[
		'aria-invalid',
		'true while invalid',
		'the same fact as data-invalid, in the language of ARIA.',
	],
	[
		':focus-visible',
		'border-input-strong',
		'the same step a hover takes, and no outline: every field in the family moves its own edge.',
	],
];

const usageImport = `import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';`;
const usageExample = `<Field.Root validationMode="onBlur">
	<Field.Label>email</Field.Label>
	<Input type="email" placeholder="you@example.com" />
	<Field.Description>only when something breaks.</Field.Description>
	<Field.Error match="typeMismatch">that is missing an @.</Field.Error>
</Field.Root>`;
const constraintExample = `<Input type="email" defaultValue="you" required />
<Field.Error match="typeMismatch">that is missing an @.</Field.Error>
<Field.Error match="valueMissing">an address is required.</Field.Error>`;

export function FieldPage() {
	return (
		<DocPage title="field" description="one control, its name, and the line beneath it">
			<DocPreview path="src/pages/Field/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and no appearance of its own: a field labels and validates what is
						inside it, so the look belongs to the control. <Mono>Input</Mono> is the one
						it is usually seen with.
					</>
				}
			>
				<DocInstall name="field" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the four parts read in the order a person meets them: what this is, where to
						type, what that means, and — when it goes wrong — why.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a verdict, on blur"
				note={
					<>
						<Mono>validate</Mono> returns the sentence to show, or nothing at all —
						which is what a field with no complaint left looks like. the message is
						installed as the control’s custom validity, so the browser and the form
						agree with the pixels. a native constraint is checked first, though: an
						input with <Mono>type=&quot;email&quot;</Mono> answers before{' '}
						<Mono>validate</Mono> is asked.
					</>
				}
			>
				<DocPreview path="src/pages/Field/demos/validation.tsx">
					<Validation />
				</DocPreview>
			</DocSection>

			<DocSection
				title="any control, not just ours"
				note={
					<>
						<Mono>Field.Control</Mono> is the seam: it writes the id, the describedby
						and the invalid flag onto whatever element it is given. the textarea below
						is the browser’s, styled by the call site, and still carries a name and an
						error — which is why every later control slots into Field instead of
						repeating the wiring. Base UI’s own controls — <Mono>Input</Mono>, a
						Checkbox, a Select — register themselves, so they need no{' '}
						<Mono>Control</Mono> between the two.
					</>
				}
			>
				<DocPreview path="src/pages/Field/demos/native.tsx">
					<Native />
				</DocPreview>
			</DocSection>

			<DocSection title="the browser’s own constraints">
				<div className="space-y-3">
					<p className="text-sm text-muted-foreground">
						<Mono>required</Mono>, <Mono>type=&quot;email&quot;</Mono> and{' '}
						<Mono>pattern</Mono> are validation already, and the field reads them
						without a <Mono>validate</Mono> prop. <Mono>Error</Mono> takes{' '}
						<Mono>match</Mono>, so each constraint gets its own sentence and a reader is
						told the one thing that is wrong rather than all of them at once.
					</p>
					<Code code={constraintExample} language="tsx" header={false} />
					<p className="text-sm text-muted-foreground">
						left alone, <Mono>Error</Mono> shows the browser’s own message in the
						browser’s own language; children replace it with a sentence written for the
						product. a required value also needs{' '}
						<Mono>validationMode=&quot;onBlur&quot;</Mono> to be reported before a form
						is submitted.
					</p>
					<p className="text-sm text-muted-foreground">
						one verdict does not come from the browser at all — the <Mono>errors</Mono>{' '}
						a <Mono>Form</Mono> is handed after a server answered. while the form holds
						one for a field it wins that field’s line, over <Mono>match</Mono> and over
						children alike: it is the newer of the two, and it is about the value that
						was actually sent.
					</p>
				</div>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; the parts are elements."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Field.Root</Mono> — the state
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
				note="the label and the message are joined to the control by the field, so a wrong htmlFor is not a mistake that can be made here."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
