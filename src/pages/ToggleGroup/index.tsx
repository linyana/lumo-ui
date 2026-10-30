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
import Multiple from './demos/multiple';
import Sizes from './demos/sizes';

const files = ['src/components/ui/toggle-group.tsx'];

const rootProps: Record<string, PropNode> = {
	defaultValue: {
		type: 'string[]',
		description: 'The values that open pressed — one, unless `multiple`.',
	},
	value: {
		type: 'string[]',
		description: 'The controlled form of the same thing.',
	},
	onValueChange: {
		type: '(value: string[], eventDetails) => void',
		description: 'Fires on every change. Cancelling `eventDetails` leaves the row as it was.',
	},
	multiple: {
		type: 'boolean',
		default: 'false',
		description:
			'Whether several of them can be down at once, as a toolbar of switches rather than a choice between them.',
	},
	orientation: {
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description:
			'Which way the arrow keys move. Written on the group as `data-orientation`, so the row can turn from one attribute.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Disables every item in the row, whichever way it is set on one of them.',
	},
	loopFocus: {
		type: 'boolean',
		default: 'true',
		description:
			'Whether the arrow keys come back round to the first item at the end of the row.',
	},
	variant: {
		type: '"ghost" | "outline"',
		default: '"ghost"',
		description:
			'The tier every item is drawn at. An item can override it, which a row rarely wants.',
	},
	size: {
		type: '"sm" | "md" | "lg" | "icon"',
		default: '"md"',
		description:
			'The scale every item is drawn at, so one control cannot end up a different size from its neighbours.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); it lands on the row rather than on an item.',
	},
};

const itemProps: Record<string, PropNode> = {
	value: {
		type: 'string',
		description: 'Its name in the group’s state — what the array holds while it is on.',
	},
	'aria-label': {
		type: 'string',
		description: 'Its name, when the glyph is the only thing in it.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'One item of the row that cannot be pressed.',
	},
	variant: {
		type: '"ghost" | "outline"',
		default: 'the group’s',
		description: 'Overrides the row’s tier for this one item.',
	},
	size: {
		type: '"sm" | "md" | "lg" | "icon"',
		default: 'the group’s',
		description: 'Overrides the row’s scale for this one item.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn().',
	},
};

const partRows = [
	[
		'ToggleGroup.Root',
		'the row',
		'one control: it holds the pressed values, makes the row a single stop in the tab order, and hands the arrow keys on to the items.',
	],
	[
		'ToggleGroup.Item',
		'one toggle of the set',
		'a `Toggle` that takes its state from the group instead of keeping one — and its tier and scale from the row, unless it says otherwise.',
	],
];

const hookRows = [
	[
		'data-slot="toggle-group" · "toggle-group-item"',
		'the row and its items',
		'one element each.',
	],
	['role="group"', 'the row', 'Base UI’s, so the items are announced as one set.'],
	[
		'data-orientation',
		'horizontal · vertical',
		'which way the arrow keys move, and which way the row is laid out.',
	],
	[
		'data-multiple',
		'present when several can be on',
		'the difference between a choice and a toolbar.',
	],
	[
		'data-disabled',
		'present while disabled',
		'written by Base UI on the group and on every item.',
	],
	[
		'data-pressed · aria-pressed',
		'which items are on',
		'per item, from `Toggle` — the tint is the only thing a row has to draw.',
	],
];

const usageImport = "import { ToggleGroup } from '@/components/ui/toggle-group';";
const usageExample = `<ToggleGroup.Root defaultValue={['left']} aria-label="alignment">
	<ToggleGroup.Item value="left" aria-label="left">
		<AlignLeft />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="center" aria-label="centre">
		<AlignCenter />
	</ToggleGroup.Item>
</ToggleGroup.Root>`;

export function ToggleGroupPage() {
	return (
		<DocPage
			title="toggle-group"
			description="a set of toggles that is one control, rather than several that happen to sit together"
		>
			<DocPreview path="src/pages/ToggleGroup/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and the toggle it is made of, which the CLI installs with it. Base
						UI’s group supplies the rest: a value every item shares, and one stop in the
						tab order instead of one per button.
					</>
				}
			>
				<DocInstall
					name="toggle-group"
					files={files}
					reaches={['src/components/ui/toggle.tsx', 'src/lib/utils.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						an item without a <Mono>value</Mono> has no name in the group’s state, so
						each one gets the word the array will hold. the row itself is named for a
						screen reader — it is a group, and a group with no name is a set of buttons
						that happen to be near each other.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="no frame of its own"
				note={
					<>
						the group draws nothing around its items. a toggle already carries its own
						edge or deliberately none, and a box drawn around a row of boxes is a third
						edge saying nothing the row does not — so what the row owns is the space
						between them, and the tier and scale they are drawn at.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					a run of choices that changes the panel under it is not this: that is{' '}
					<Mono>Tabs</Mono>, which draws a track and moves a highlight along it, because
					something else on the page is answering.
				</p>
			</DocSection>

			<DocSection
				title="more than one at a time"
				note={
					<>
						<Mono>multiple</Mono> turns the row from a choice into a set of switches.
						Base UI writes <Mono>data-multiple</Mono> on the group, so a row that wants
						to look different can say so from plain CSS.
					</>
				}
			>
				<DocPreview path="src/pages/ToggleGroup/demos/multiple.tsx">
					<Multiple />
				</DocPreview>
			</DocSection>

			<DocSection
				title="tier and scale are the row's"
				note={
					<>
						an item inherits both, so a row cannot end up with one control drawn a size
						larger than the one beside it. an item may still override either, and rarely
						should.
					</>
				}
			>
				<DocPreview path="src/pages/ToggleGroup/demos/sizes.tsx">
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the row takes the state and the look; an item takes its name in it."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>ToggleGroup.Root</Mono> — the row
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>ToggleGroup.Item</Mono> — one toggle of the set
						</p>
						<PropTable props={itemProps} />
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

			<DocSection title="hooks" note="one set, one focus stop, and the arrow keys inside it.">
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
