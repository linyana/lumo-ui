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
import Groups from './demos/groups';

const files = ['src/components/lumo/ui/Combobox.tsx'];

const rootProps: Record<string, PropNode> = {
	items: {
		type: 'any[] | Group[]',
		required: true,
		description:
			'What the list is made of. Filtering, the empty message and the chosen label all read from here.',
	},
	value: {
		type: 'Value | Value[] | null',
		description: 'The chosen value, or the chosen values when `multiple` is on.',
	},
	defaultValue: {
		type: 'Value | Value[] | null',
		description: 'Where it starts, uncontrolled.',
	},
	onValueChange: {
		type: '(value, eventDetails) => void',
		description: 'Fires when a row is picked, and when the clear button empties the field.',
	},
	inputValue: {
		type: 'string',
		description: 'What the field reads, controlled — the query as well as the chosen label.',
	},
	defaultInputValue: {
		type: 'string',
		description: 'What the field reads on the first render, uncontrolled.',
	},
	onInputValueChange: {
		type: '(inputValue, eventDetails) => void',
		description: 'Fires on every keystroke, which is where a search server is asked.',
	},
	filter: {
		type: '(item, query, itemToString) => boolean',
		description: 'How a row matches the query. `null` turns filtering off and leaves the list.',
	},
	limit: {
		type: 'number',
		default: '-1',
		description: 'How many rows the filtered list may show.',
	},
	autoHighlight: {
		type: 'boolean',
		default: 'false',
		description:
			'Whether the first match is highlighted as the query narrows, so Enter picks it.',
	},
	open: {
		type: 'boolean',
		description: 'The popup, controlled. Leave it out and the root keeps the state itself.',
	},
	onOpenChange: {
		type: '(open: boolean, eventDetails) => void',
		description: 'Fires on the field, on the caret, on a click outside, and on escape.',
	},
	name: {
		type: 'string',
		description: 'The key the value is submitted under.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Half opacity and no pointer, and the list cannot be opened.',
	},
	readOnly: {
		type: 'boolean',
		default: 'false',
		description:
			'The list opens and picking does nothing. The typed query is not accepted either.',
	},
	multiple: {
		type: 'boolean',
		default: 'false',
		description:
			'Whether many values can be held. Base UI draws them as chips, which this file does not ship.',
	},
};

const partRows = [
	[
		'Combobox.Root',
		'the state',
		'the items, the query, the chosen value, and what submitting means.',
	],
	[
		'Combobox.InputGroup',
		'the box around the field',
		'holds no look of its own; it is the corner the buttons are placed against.',
	],
	[
		'Combobox.Input',
		'the field, and the control',
		'an Input’s shell with the end left free for the caret — so the focus ring is drawn around the field.',
	],
	[
		'Combobox.Trigger',
		'the caret',
		'opens the list without typing, and turns itself while it is open. Children replace the glyph.',
	],
	[
		'Combobox.Clear',
		'the way back',
		'mounted only while there is something to clear, which is what the field’s extra room is keyed to.',
	],
	['Combobox.Portal', 'where it is mounted', 'the body, so nothing can clip the popup.'],
	[
		'Combobox.Positioner',
		'where it points',
		'under the field, `sideOffset` 6; the flip is Base UI’s.',
	],
	[
		'Combobox.Popup',
		'the panel',
		'at least as wide as the field, never taller than the viewport allowed.',
	],
	[
		'Combobox.Empty',
		'when nothing matches',
		'stays mounted and swaps its text, because a live message has to be there to be read.',
	],
	[
		'Combobox.Status',
		'the announcement',
		'visually hidden; for a list that arrives or counts itself, not for a static one.',
	],
	['Combobox.List', 'the rows', 'the box that scrolls, and the padding around it.'],
	['Combobox.Group', 'a block of rows', 'given its own `items`, so it filters as one.'],
	['Combobox.GroupLabel', 'its name', 'muted, and not one of the rows.'],
	[
		'Combobox.Collection',
		'one group’s rows',
		'renders the group’s `items` through the function it is given.',
	],
	[
		'Combobox.Item',
		'one option',
		'a Menu row: the same tint while the pointer or the arrows are on it — and the chosen one filled with `selected`.',
	],
	['Combobox.Separator', 'a line between groups', 'mx-1, h-px.'],
];

const hookRows = [
	[
		'data-slot="combobox-input" · "combobox-item" · …',
		'one per part',
		'the hook a call site styles without reaching for a class.',
	],
	['data-popup-open', 'on the trigger', 'written by Base UI; the caret’s turn is drawn from it.'],
	['data-highlighted', 'on one row', 'the row the pointer or the arrow keys are on.'],
	[
		'data-selected',
		'on the chosen row',
		'filled with `selected`, a notch above the hover tint — so chosen and hovered never read as one.',
	],
	[
		'data-list-empty',
		'on the group and the trigger',
		'the query matched nothing, which is what the empty message is shown for.',
	],
	['data-size', 'on the field', 'sm | md | lg, mirroring the variant onto the DOM.'],
	[
		'--anchor-width · --available-height',
		'on the positioner',
		'the field’s width and the room left on screen; the popup is sized from both.',
	],
	[
		'data-starting-style · data-ending-style',
		'on the popup',
		'scale-90 and opacity-0; `data-instant` drops the travel.',
	],
];

const usageImport = "import { Combobox } from '@/components/lumo/ui/Combobox';";
const usageExample = `<Combobox.Root items={languages}>
	<Combobox.InputGroup className="w-56">
		<Combobox.Input placeholder="search a language" aria-label="language" />
		<Combobox.Clear />
		<Combobox.Trigger />
	</Combobox.InputGroup>
	<Combobox.Portal>
		<Combobox.Positioner>
			<Combobox.Popup>
				<Combobox.Empty />
				<Combobox.List>
					{(language: string) => (
						<Combobox.Item key={language} value={language}>
							{language}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Popup>
		</Combobox.Positioner>
	</Combobox.Portal>
</Combobox.Root>`;

export function ComboboxPage() {
	return (
		<DocPage
			title="combobox"
			description="a select whose options are found by typing — the field is the control"
		>
			<DocPreview path="src/pages/Combobox/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the filtering, the keyboard, the chosen label left in the field
						and the form value are Base UI’s; what is here is the field, the caret and
						the row.
					</>
				}
			>
				<DocInstall
					name="combobox"
					packages={['@base-ui/react', 'lucide-react', 'tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts', 'src/lib/control.ts', 'src/lib/surface.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the root takes the <Mono>items</Mono>, and the list renders them — its
						children are a function called once per item, so what is shown and what is
						filtered are the same array. <Mono>Field</Mono> recognises the input without
						being told, so a label, a description and an error come from the field above
						it. The row the reader lands on is tinted, and the one they have chosen is
						filled a notch darker, so neither needs a glyph.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="groups"
				note={
					<>
						hand the root an array of groups and the list gets one call per group; a{' '}
						<Mono>Group</Mono> given its own <Mono>items</Mono> filters as a whole, so a
						group with nothing left in it disappears with its label.{' '}
						<Mono>Collection</Mono> is what draws that group’s rows.
					</>
				}
			>
				<DocPreview path="src/pages/Combobox/demos/groups.tsx">
					<Groups />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what is not here"
				note={
					<>
						no chips. <Mono>multiple</Mono> works on the root, but Base UI draws the
						chosen values with <Mono>Chips</Mono> and <Mono>Chip</Mono>, which this file
						does not ship — a field that holds several values is its own piece of work
						rather than a variant of this one.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					no async search either, though the parts are all there: give the root a{' '}
					<Mono>filter={'{null}'}</Mono> to stop Base UI narrowing the list locally, ask
					the server from <Mono>onInputValueChange</Mono>, and keep a{' '}
					<Mono>Combobox.Status</Mono> mounted with the count in it. The list a query
					leaves empty is still this component’s <Mono>Empty</Mono>.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Combobox.Root</Mono> — the state
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
				note="the popup is sized from the field, so a longer option never makes a narrower box."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
