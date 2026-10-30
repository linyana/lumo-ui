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
import Range from './demos/range';
import States from './demos/states';
import Vertical from './demos/vertical';

const files = ['src/components/ui/slider.tsx'];

const rootProps: Record<string, PropNode> = {
	defaultValue: {
		type: 'number | number[]',
		description:
			'The value it opens on. An array is a range: one entry per thumb, in the order the thumbs are written.',
	},
	value: {
		type: 'number | number[]',
		description: 'The controlled form of the same thing.',
	},
	onValueChange: {
		type: '(value, eventDetails) => void',
		description:
			'Fires while it moves. `eventDetails.reason` says what moved it — drag, track press, keyboard.',
	},
	min: { type: 'number', default: '0', description: 'The bottom of the range.' },
	max: { type: 'number', default: '100', description: 'The top of it.' },
	step: {
		type: 'number',
		default: '1',
		description: 'How far one arrow key moves it, and the only values a drag lands on.',
	},
	largeStep: {
		type: 'number',
		default: '10',
		description: 'How far page up and page down move it, and shift with an arrow.',
	},
	orientation: {
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description:
			'A column instead of a row. It takes its height from `className`, and a width to sit the name and the number in.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Base UI’s disabled state: dimmed to half, and no longer taking the pointer.',
	},
	format: {
		type: 'Intl.NumberFormatOptions',
		description: 'How `Value` writes the number — a currency, a percentage, a unit.',
	},
	locale: {
		type: 'Intl.LocalesArgument',
		description: 'The locale the number is formatted in; the browser’s by default.',
	},
	name: {
		type: 'string',
		description: 'The field name the hidden inputs submit under.',
	},
	thumbAlignment: {
		type: '"center" | "edge" | "edge-client-only"',
		default: '"center"',
		description:
			'Where the knob sits at either end: centred on the groove’s edge, half of it outside, or inset so its own edge lines up.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the height of a vertical slider lives here.',
	},
	'...props': {
		type: 'Base UI SliderRootProps',
		description:
			'Everything else goes to Base UI: form, onValueCommitted, thumbCollisionBehavior.',
	},
};

const thumbProps: Record<string, PropNode> = {
	index: {
		type: 'number',
		description:
			'Which value of a range this thumb is. Only needed on a range, and only to keep server and client agreeing on the order.',
	},
	'aria-label': {
		type: 'string',
		description:
			'Its name, when the `Label` names the slider rather than the thumb — a range is two numbers, and a screen reader has to be able to tell them apart.',
	},
	getAriaValueText: {
		type: '(formatted, value, index) => string',
		description: 'The sentence heard in place of the bare number.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'One thumb of a range that cannot be moved.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the size of the knob lives here.',
	},
};

const partRows = [
	[
		'Slider.Root',
		'the whole control',
		'a two-column grid: the name and the number on the first line, the control under both. The numbers — `min`, `max`, `step`, the value — are read here and nowhere else.',
	],
	['Slider.Label', 'the name', 'wired by Base UI to the inputs inside the thumbs.'],
	[
		'Slider.Value',
		'the number',
		'formatted by Base UI from the same values the thumbs are on; a range reads `20 – 70`.',
	],
	[
		'Slider.Control',
		'the strip',
		'the box the thumbs are measured against, and the surface a press on the groove is read from. A touch that starts here belongs to the slider, not to the page.',
	],
	[
		'Slider.Track',
		'the groove',
		'`bg-muted`, the fill every placeholder in the library is drawn in. Its thickness is one of the two numbers worth overriding per call site.',
	],
	[
		'Slider.Indicator',
		'what is taken',
		'from the start of the range to the thumb, or between two.',
	],
	[
		'Slider.Thumb',
		'the knob',
		'the nearest one wins a drag; it carries a hidden `input[type=range]`, so a form and a screen reader both see a value.',
	],
];

const hookRows = [
	[
		'data-slot="slider" · "-label" · "-value" · "-control" · "-track" · "-indicator" · "-thumb"',
		'the seven parts',
		'one element each.',
	],
	[
		'data-orientation',
		'horizontal · vertical',
		'written by Base UI on every part, so one rule turns the whole control.',
	],
	[
		'data-dragging',
		'the knob under the finger',
		'what the thumb takes its colour and its small growth from.',
	],
	[
		'data-disabled',
		'Base UI’s state',
		'written on the root and on the thumb, so the dimming is one rule.',
	],
	[
		'input[type=range]',
		'what is announced',
		'one per thumb, `aria-valuenow` and `aria-valuetext` included. It is clipped to nothing — it is there to be heard, not drawn.',
	],
	[
		'has-[:focus-visible]',
		'the keyboard',
		'the ring the theme draws on that input would be clipped with it, so the thumb’s own edge steps to `--input-strong` instead — the same step a checkbox takes.',
	],
];

const usageImport = "import { Slider } from '@/components/ui/slider';";
const usageExample = `<Slider.Root defaultValue={64}>
	<Slider.Label>thumbnail size</Slider.Label>
	<Slider.Value />
	<Slider.Control>
		<Slider.Track>
			<Slider.Indicator />
			<Slider.Thumb />
		</Slider.Track>
	</Slider.Control>
</Slider.Root>`;

export function SliderPage() {
	return (
		<DocPage
			title="slider"
			description="a number you can move, with the value in words beside it"
		>
			<DocPreview path="src/pages/Slider/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file and Base UI’s slider, which owns the arithmetic: it turns a
						pointer’s position into a value, snaps that value to `step`, keeps two
						thumbs from crossing, and writes the same number into the fill, the readout
						and the hidden input.
					</>
				}
			>
				<DocInstall name="slider" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the anatomy is fixed — groove, fill and knob are one line — so the parts are
						written in order. the label is optional, the knob’s name is not: without a{' '}
						<Mono>Slider.Label</Mono>, the thumb needs an <Mono>aria-label</Mono>.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="two thumbs"
				note={
					<>
						a range is the same control with an array for a value and a thumb per entry.
						each thumb is named, because “20” and “70” are two different facts and a
						screen reader reads them out of context otherwise.
					</>
				}
			>
				<DocPreview path="src/pages/Slider/demos/range.tsx">
					<Range />
				</DocPreview>
			</DocSection>

			<DocSection
				title="vertical"
				note={
					<>
						orientation is Base UI’s, and it writes it on every part, so the groove, the
						fill and the knob all turn from one attribute. the height and the width are
						the call site’s, because a column has neither of its own.
					</>
				}
			>
				<DocPreview path="src/pages/Slider/demos/vertical.tsx">
					<Vertical />
				</DocPreview>
			</DocSection>

			<DocSection
				title="states"
				note={
					<>
						<Mono>step</Mono> is the only value a drag lands on, so a slider can be as
						coarse as the thing it sets. a disabled one keeps its fill: it is a reading
						of the value, and the value has not stopped being true.
					</>
				}
			>
				<DocPreview path="src/pages/Slider/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes the numbers; the parts take a class name."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Slider.Root</Mono> — the whole control
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Slider.Thumb</Mono> — the knob
						</p>
						<PropTable props={thumbProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable
							head={['part', 'what it is', 'notes']}
							mono={[0]}
							rows={partRows}
						/>
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the DOM is the API for styling, and the input inside the thumb is the API for everything else."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
