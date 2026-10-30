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
import Icon from './demos/icon';
import States from './demos/states';

const files = ['src/components/ui/toggle.tsx'];

const toggleProps: Record<string, PropNode> = {
	variant: {
		type: '"ghost" | "outline"',
		default: '"ghost"',
		description:
			'The tier: ghost is a word or a glyph until it is on, outline is drawn either way.',
	},
	size: {
		type: '"sm" | "md" | "lg" | "icon"',
		default: '"md"',
		description: '32 / 36 / 40 tall, with the type to match. icon is the 36 square.',
	},
	pressed: {
		type: 'boolean',
		description:
			'The controlled state. Base UI writes it back as `data-pressed` and `aria-pressed`.',
	},
	defaultPressed: {
		type: 'boolean',
		default: 'false',
		description: 'The state it opens on.',
	},
	onPressedChange: {
		type: '(pressed, eventDetails) => void',
		description:
			'Fires on every change. Cancelling `eventDetails` leaves the toggle as it was.',
	},
	value: {
		type: 'string',
		description:
			'Its name in a `ToggleGroup`, where the group holds the state and this only says which item it is.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Base UI’s disabled state: dimmed to half, and no longer taking the pointer.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(), so a Base UI state callback is not accepted.',
	},
	children: {
		type: 'ReactNode',
		description: 'The label, a glyph, or both — a glyph sizes itself from the text beside it.',
	},
	'...props': {
		type: 'Base UI ToggleProps',
		description: 'Everything else goes to Base UI: onClick, render, nativeButton.',
	},
};

const hookRows = [
	['data-slot', 'toggle', 'the button.'],
	['data-variant', 'the current tier', 'mirrored onto the DOM for plain CSS.'],
	['data-size', 'the current size', 'same.'],
	['data-pressed', 'present while it is on', 'Base UI’s, and the only selector the tint needs.'],
	[
		'aria-pressed',
		'true while it is on',
		'what a screen reader hears in place of a second label.',
	],
	['data-disabled', 'present while disabled', 'written by Base UI.'],
	[':focus-visible', '—', 'the ring, declared once in lumo-tokens.css.'],
];

const usageImport = "import { Toggle } from '@/components/ui/toggle';";
const usageExample = `<Toggle aria-label="pin" defaultPressed>
	<Pin />
</Toggle>`;

export function TogglePage() {
	return (
		<DocPage
			title="toggle"
			description="a control that stays where it was put: one setting, on or off"
		>
			<DocPreview path="src/pages/Toggle/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file and Base UI’s toggle, which is a button with a memory: it keeps the
						state, writes <Mono>aria-pressed</Mono>, and inside a group reads the state
						from there instead.
					</>
				}
			>
				<DocInstall
					name="toggle"
					files={files}
					reaches={['src/lib/control.ts', 'src/lib/utils.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						one component, no parts, no barrel. a glyph as the only child needs its name
						in <Mono>aria-label</Mono>.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="on is a tint, kept"
				note={
					<>
						the pointer already leaves a tint on everything it passes over, so being on
						is that same tint made lasting rather than a louder fill of its own — which
						is the rule a nav row and a chosen menu row follow too. the surface never
						changes colour between the two states; only the layer over it does, and it
						deepens a step while the pointer is still there. a press adds no downward
						nudge the way <Mono>Button</Mono>’s does: the toggle has already answered
						the press by staying down.
					</>
				}
			>
				<DocPreview path="src/pages/Toggle/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="icon"
				note={
					<>
						a glyph is an ordinary child and the slot sizes it in <Mono>em</Mono>, so a{' '}
						<Mono>lg</Mono> toggle grows its glyph without the call site saying so.{' '}
						<Mono>icon</Mono> is the square that holds one and nothing else.
					</>
				}
			>
				<DocPreview path="src/pages/Toggle/demos/icon.tsx">
					<Icon />
				</DocPreview>
			</DocSection>

			<DocSection
				title="one of a set"
				note={
					<>
						a toggle on its own keeps its own state. when several of them are one choice
						— or one toolbar — the state belongs to the set, and the set is{' '}
						<Mono>ToggleGroup</Mono>.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the group draws the row and holds the value; this component is what its items
					are made of, and it stops keeping a state of its own while it is inside one.
				</p>
			</DocSection>

			<DocSection title="api reference" note="every prop is optional; the rest is Base UI's.">
				<PropTable props={toggleProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the DOM is the API for styling: the state, the tier and the size are all on the element."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
