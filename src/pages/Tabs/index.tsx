import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import tabsSource from '@/components/lumo/ui/Tabs.tsx?raw';
import transitionSource from '@/components/lumo/ui/Transition.tsx?raw';
import cnSource from '@/lib/cn.ts?raw';
import motionSource from '@/lib/motion.ts?raw';
import measureSource from '@/lib/measure.ts?raw';
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
import basicSource from './demos/basic.tsx?raw';
import Request from './demos/request';
import requestSource from './demos/request.tsx?raw';
import Sizes from './demos/sizes';
import sizesSource from './demos/sizes.tsx?raw';
import Swapped from './demos/swapped';
import swappedSource from './demos/swapped.tsx?raw';
import Tracked from './demos/tracked';
import trackedSource from './demos/tracked.tsx?raw';
import Variants from './demos/variants';
import variantsSource from './demos/variants.tsx?raw';
import Vertical from './demos/vertical';
import verticalSource from './demos/vertical.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Tabs.tsx', code: tabsSource }];

const rootProps: Record<string, PropNode> = {
	variant: {
		type: '"rounded" | "square" | "point"',
		default: '"rounded"',
		description:
			'The skin, and the shape of the indicator with it: a pill in a muted track, a bar on the list’s edge, or a dot under the label.',
	},
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description: '28 / 32 / 36 tall. One size on the root reaches every part it wraps.',
	},
	orientation: {
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description:
			'Which way the tabs run. The indicator reads it off the list, so the same element follows either way.',
	},
	value: {
		type: 'TabsValue',
		description: 'The open tab, controlled — any value a Tab was given.',
	},
	defaultValue: {
		type: 'TabsValue',
		description: 'Where it starts, uncontrolled.',
	},
	onValueChange: {
		type: '(value, details) => void',
		description: 'Fires on a click and on the arrow keys.',
	},
};

const panelProps: Record<string, PropNode> = {
	value: {
		required: true,
		type: 'TabsValue',
		description:
			'Which tab opens it. A panel and its tab are tied together by this and nothing else.',
	},
	transition: {
		type: 'boolean',
		default: 'true',
		description:
			'Wraps the contents in a Transition, so a body that changes size eases to the new one. false opts out, which also drops the ease.',
	},
	className: {
		type: 'string',
		description: 'Merged with cn(), so a Base UI state callback is not accepted here.',
	},
};

const partRows = [
	['Tabs.Root', 'the state, and the grid', 'a row of tabs over a panel, or a column beside one.'],
	['Tabs.List', 'the row of tabs', 'the track’s padding, gap and hairline, by variant.'],
	['Tabs.Tab', 'one tab', 'a button; disabled is half opacity and no pointer.'],
	[
		'Tabs.Indicator',
		'the moving highlight',
		'one per list — it is placed from --active-tab-*, so nothing here is per-tab.',
	],
	['Tabs.Panel', 'one panel', 'stacked and cross-faded, unless it is in Panels.'],
	[
		'Tabs.Panels',
		'every panel at once',
		'one track, slid to the selected lane; the box is only as tall as the lane on screen.',
	],
];

const hookRows = [
	['data-slot="tabs"', 'the root', 'a grid; orientation decides how many columns.'],
	[
		'data-variant · data-size',
		'on the root, the list, each tab and the indicator',
		'mirrored for plain CSS.',
	],
	[
		'--active-tab-top · -left · -width · -height',
		'the selected tab’s box',
		'written by Base UI, read by the indicator’s transform.',
	],
	['data-active', 'on the selected tab', 'what the label’s colour follows.'],
	[
		'data-slot="tabs-panel"',
		'one panel',
		'the leaving one keeps its place for the length of the fade.',
	],
	[
		'data-starting-style · data-ending-style',
		'entering / leaving',
		'opacity and a sideways shift, by activation direction.',
	],
	[
		'data-slot="tabs-track" · lanes',
		'the sliding track, and each lane',
		'the track is one percentage translate with a pixel correction on top; the box’s height follows the lane on screen.',
	],
	[
		'data-slot="tabs-panels"',
		'the box under the track',
		'its height is written to the element, not to state — a measured lane does not re-render a panel.',
	],
	[
		'inert',
		'on the lanes out of sight',
		'they stay mounted to be slid, and stay out of the tab order.',
	],
];

const usageImport = "import { Tabs } from '@/components/lumo/ui/Tabs';";
const usageExample = `<Tabs.Root defaultValue="overview">
	<Tabs.List>
		<Tabs.Tab value="overview">overview</Tabs.Tab>
		<Tabs.Tab value="activity">activity</Tabs.Tab>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Panel value="overview">workspace stats.</Tabs.Panel>
	<Tabs.Panel value="activity">who changed what.</Tabs.Panel>
</Tabs.Root>`;

export function TabsPage() {
	return (
		<DocPage title="tabs" description="one panel at a time, chosen from a row of tabs">
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						Base UI owns the selection and measures the active tab; the track and the
						box under it move on the springs in <Mono>lib/motion.ts</Mono> — the same
						ones <Mono>Transition</Mono> uses, written straight to the DOM rather than
						kept in state.
					</>
				}
			>
				<DocInstall
					name="tabs"
					packages={['@base-ui/react', 'tailwind-variants']}
					files={files}
					reaches={[
						{ path: 'src/components/lumo/ui/Transition.tsx', code: transitionSource },
						{ path: 'src/lib/motion.ts', code: motionSource },
						{ path: 'src/lib/measure.ts', code: measureSource },
						{ path: 'src/lib/cn.ts', code: cnSource },
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="one list, one indicator, one panel per tab. the values are the link between them."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="three indicators, one measurement"
				note={
					<>
						each variant is the same element wearing a different skin: a pill, a bar on
						the list’s edge, or a dot. Base UI measures the active tab and hands the
						result over as <Mono>--active-tab-*</Mono>, so nothing here is per-tab.
					</>
				}
			>
				<DocPreview name="variants.tsx" source={variantsSource}>
					<Variants />
				</DocPreview>
			</DocSection>

			<DocSection title="sizes" note="one size on the root reaches every part it wraps.">
				<DocPreview name="sizes.tsx" source={sizesSource}>
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="vertical, with a disabled tab"
				note="orientation moves the whole control, and the same indicator follows it."
			>
				<DocPreview name="vertical.tsx" source={verticalSource}>
					<Vertical />
				</DocPreview>
			</DocSection>

			<DocSection
				title="one track, slid sideways"
				note={
					<>
						wrap the panels in <Mono>Tabs.Panels</Mono> and they stop taking turns: they
						sit side by side on one track, and the track is slid to the selected lane,
						so the panel arriving and the panel leaving travel together. the box holding
						the track is only as tall as the lane on screen and follows it as the track
						moves; the lanes out of sight are blurred and <Mono>inert</Mono>. everything
						inside a panel is clipped to it — nothing can hang out of the edge. neither
						movement is React state: both are springs written to the elements, so a
						click made mid-flight takes over at the speed the track already had.
					</>
				}
			>
				<DocPreview name="tracked.tsx" source={trackedSource}>
					<Tracked />
				</DocPreview>
			</DocSection>

			<DocSection
				title="one panel, swapped content"
				note={
					<>
						panels of their own already cross-fade, since Base UI keeps the one that is
						leaving mounted for the length of its transition. every panel also wraps its
						contents in <Mono>Transition</Mono>, so a body that changes eases to the new
						size instead of being re-measured.
					</>
				}
			>
				<DocPreview name="swapped.tsx" source={swappedSource}>
					<Swapped />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a request behind every tab"
				note={
					<>
						the usual body has to be asked for before it can say anything, and the
						answer is what has a size: the panel opens at the placeholder’s height, the
						request lands, and the box eases from one to the other. the switch never
						waits for it. <Mono>key={'{value}'}</Mono> on the body is what asks again on
						every visit — drop it and the answer is reused, kept by the panel that
						stayed.
					</>
				}
			>
				<DocPreview name="request.tsx" source={requestSource}>
					<Request />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root and the panel are the two that decide anything."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Tabs.Root</Mono> — the state and the skin
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Tabs.Panel</Mono> — one panel
						</p>
						<PropTable props={panelProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the indicator is placed from variables Base UI writes, so a tab never has to know its own geometry."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
