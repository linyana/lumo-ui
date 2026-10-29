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

const files = ['src/components/lumo/ui/Select.tsx'];

const rootProps: Record<string, PropNode> = {
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
		description:
			'Fires for a click, for the arrow keys, and for the typeahead — reason says which.',
	},
	items: {
		type: 'Record<string, ReactNode> | { label, value }[]',
		description:
			'The same options as data, so `Value` can show a label before the list has ever been opened.',
	},
	multiple: {
		type: 'boolean',
		default: 'false',
		description:
			'One value or many. `Value` shows the labels joined unless it is given children.',
	},
	name: {
		type: 'string',
		description:
			'The key the value is submitted under. The hidden input Base UI keeps is this.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Half opacity and no pointer, and the popup cannot be opened.',
	},
	readOnly: {
		type: 'boolean',
		default: 'false',
		description: 'The list opens, and picking does nothing. The value still submits.',
	},
	required: {
		type: 'boolean',
		default: 'false',
		description: 'A native constraint, so a `Field` above it can report it empty.',
	},
	open: {
		type: 'boolean',
		description: 'The popup, controlled. Leave it out and the root keeps the state itself.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where the popup starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, eventDetails) => void',
		description: 'Fires on the trigger, on a click outside, and on escape.',
	},
	modal: {
		type: 'boolean',
		default: 'true',
		description:
			'Whether the page behind is inert while the list is open. Off, the popup follows a scroll of the page it belongs to.',
	},
	isItemEqualToValue: {
		type: '(itemValue, value) => boolean',
		description:
			'How a row decides it is the chosen one, for values that are objects rather than strings.',
	},
	itemToStringLabel: {
		type: '(itemValue) => string',
		description:
			'The label a value renders in the trigger, for a value that is not its own label.',
	},
};

const triggerProps: Record<string, PropNode> = {
	size: {
		type: "'sm' | 'md' | 'lg'",
		default: "'md'",
		description: 'The height — the same 32 / 36 / 40 an Input takes, so the two line up.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); a `w-56` here is what narrows the control.',
	},
	'...props': {
		type: 'Base UI Select.Trigger props',
		description: 'render, `disabled`, and the button’s own attributes.',
	},
};

const partRows = [
	['Select.Root', 'the state', 'the value, the open flag, and what submitting means.'],
	[
		'Select.Label',
		'the select’s name',
		'a `<div>`, so a click focuses the trigger without opening the list.',
	],
	[
		'Select.Trigger',
		'the control',
		'an Input’s shell as a button: the value, then the caret, at three heights. White as an Input is, and muted while the list is open.',
	],
	[
		'Select.Value',
		'what is chosen',
		'the label, truncated; `placeholder` while there is none, in muted type.',
	],
	[
		'Select.Icon',
		'the caret',
		'turns itself when the popup is open. Children replace the glyph.',
	],
	['Select.Portal', 'where it is mounted', 'the body, so nothing can clip the popup.'],
	['Select.Backdrop', 'the scrim', 'for a modal select, behind the list.'],
	[
		'Select.Positioner',
		'where it points',
		'under the trigger, `sideOffset` 6; the flip is Base UI’s.',
	],
	[
		'Select.Popup',
		'the panel',
		'at least as wide as the trigger, never taller than the viewport allowed.',
	],
	[
		'Select.ScrollUpArrow · ScrollDownArrow',
		'the ends of a long list',
		'rendered only while there is more above or below. Hovering one scrolls.',
	],
	['Select.List', 'the rows', 'the box that scrolls, and the padding around it.'],
	['Select.Group', 'a block of rows', 'grouped for the arrow keys as well as the eye.'],
	['Select.GroupLabel', 'its name', 'muted, and not one of the rows.'],
	[
		'Select.Item',
		'one option',
		'a Menu row: the same padding, the same `data-highlighted` tint — and the chosen one filled with `selected`.',
	],
	['Select.ItemText', 'the option’s label', 'what the trigger shows once it is chosen.'],
	['Select.Separator', 'a line between groups', 'mx-1, h-px.'],
];

const hookRows = [
	[
		'data-slot="select-trigger" · "select-popup" · …',
		'one per part',
		'the hook a call site styles without reaching for a class.',
	],
	[
		'data-popup-open',
		'on the trigger and the caret',
		'the caret’s turn and the trigger’s muted fill are both drawn from it.',
	],
	[
		'data-placeholder',
		'on the trigger and the value',
		'no value yet, so the label is muted — and a clear button could show itself.',
	],
	[
		'data-highlighted',
		'on one row',
		'the row the pointer or the arrow keys are on, filled with `accent`.',
	],
	[
		'data-selected',
		'on the chosen row',
		'filled with `selected`, a notch above the hover tint — so chosen and hovered never read as one.',
	],
	['data-disabled', 'on the root, the trigger, a row', 'no pointer, half opacity.'],
	[
		'data-readonly',
		'on the trigger',
		'the shell goes to muted, as an Input’s does when it is read-only.',
	],
	[
		'data-invalid · data-valid',
		'on the trigger',
		'written by the field above it, so the border turns destructive on its own.',
	],
	[
		'--anchor-width · --available-height',
		'on the positioner',
		'the trigger’s width and the room left on screen; the popup is sized from both.',
	],
	[
		'data-starting-style · data-ending-style',
		'on the popup',
		'scale-90 and opacity-0; `data-instant` drops the travel.',
	],
];

const usageImport = "import { Select } from '@/components/lumo/ui/Select';";
const usageExample = `<Select.Root defaultValue="rust">
	<Select.Trigger className="w-56">
		<Select.Value placeholder="choose a language" />
		<Select.Icon />
	</Select.Trigger>
	<Select.Portal>
		<Select.Positioner>
			<Select.Popup>
				<Select.List>
					<Select.Item value="rust">
						<Select.ItemText>rust</Select.ItemText>
					</Select.Item>
				</Select.List>
			</Select.Popup>
		</Select.Positioner>
	</Select.Portal>
</Select.Root>`;

export function SelectPage() {
	return (
		<DocPage
			title="select"
			description="one value out of many, in a list laid under the control that opened it"
		>
			<DocPreview path="src/pages/Select/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the keyboard, the typeahead, the flip and the form value are Base
						UI’s; what is here is the shell, the row and the caret.
					</>
				}
			>
				<DocInstall
					name="select"
					packages={['@base-ui/react', 'lucide-react', 'tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts', 'src/lib/control.ts', 'src/lib/surface.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the trigger holds the value and the caret; everything else is the popup. the
						chosen row is shown by its fill rather than by a mark, so the label never
						shifts between the two states — Base UI’s <Mono>ItemIndicator</Mono> is a
						one-line export and a check away if a project wants one anyway.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="groups, and an option that is out"
				note={
					<>
						a group is a block of rows for the arrow keys as well as the eye, and a
						disabled row stays in the list — the option a reader remembers is still
						findable, it simply cannot be picked. the typeahead skips both.
					</>
				}
			>
				<DocPreview path="src/pages/Select/demos/groups.tsx">
					<Groups />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what is not here"
				note={
					<>
						no search field inside the popup, and no tags in the trigger. a list long
						enough to need filtering is <Mono>Combobox</Mono> — run by its input rather
						than by a caret; a select is for options a reader recognises on sight, and
						its typeahead covers the rest. <Mono>multiple</Mono> is a root prop and
						works as it is — <Mono>Value</Mono> joins the labels unless you hand it a
						function, which is where tags would be drawn.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the popup opens <em>under</em> the trigger rather than over it. Base UI’s
					default is the other way round, laying the list on top so the chosen row sits on
					the value’s line — <Mono>{'<Select.Positioner alignItemWithTrigger />'}</Mono>{' '}
					brings that back, and it is what a native-feeling picker on a short page wants.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Select.Root</Mono> — the state
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Select.Trigger</Mono> — the control
						</p>
						<PropTable props={triggerProps} />
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
				note="the popup is sized from the trigger, which is why a wider option never makes a narrower box."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
