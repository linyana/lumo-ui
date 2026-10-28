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
import Detached from './demos/detached';

const files = ['src/components/lumo/ui/Tooltip.tsx'];

const providerProps: Record<string, PropNode> = {
	delay: {
		type: 'number',
		default: '600',
		description:
			'How long a trigger is hovered before its hint appears. The trigger here asks for 100ms of its own, and that wins over this — the provider is what a tooltip with no opinion of its own gets.',
	},
	closeDelay: {
		type: 'number',
		default: '0',
		description: 'How long a hint survives after the pointer leaves.',
	},
	timeout: {
		type: 'number',
		default: '400',
		description: 'After a hint is dismissed, how long before the next one opens instantly.',
	},
};

const partRows = [
	['Tooltip.Provider', 'the timing', 'one per page, so every hint waits the same.'],
	['Tooltip.Root', 'the state', 'one per trigger, or one for many through handle.'],
	[
		'Tooltip.Trigger',
		'what is pointed at',
		'rendered through render; it opens on hover and on keyboard focus.',
	],
	['Tooltip.Portal', 'where it is mounted', 'the body, so nothing clips it.'],
	[
		'Tooltip.Positioner',
		'where it points',
		'side, align, sideOffset (11 by default, to clear the arrow).',
	],
	['Tooltip.Popup', 'the hint', 'bg-primary, text-xs, max-w-xs; sized to what is inside it.'],
	[
		'Tooltip.Viewport',
		'the sliding window',
		'one hint can hold several; the old slides out as the new comes in.',
	],
	['Tooltip.Arrow', 'the pointer', 'reads data-side and hangs off that edge.'],
];

const hookRows = [
	[
		'data-slot="tooltip-popup"',
		'the hint',
		'bg-primary, so it reads as an annotation and never competes with a button.',
	],
	['data-slot="tooltip-arrow"', 'the pointer', 'clipped to a triangle, in bg-primary.'],
	[
		'data-slot="tooltip-viewport"',
		'the sliding window',
		'the inline padding both hints are clipped to.',
	],
	[
		'data-current · data-previous',
		'arriving / leaving',
		'Base UI’s; the slide is written against them.',
	],
	[
		'data-side',
		'top | bottom | left | right',
		'chosen on every placement, and read by the arrow.',
	],
	[
		'role="tooltip" · aria-describedby',
		'—',
		'on the popup and the trigger — announced, not a second label.',
	],
	[
		'data-starting-style · data-ending-style',
		'entering / leaving',
		'scale-90 and opacity-0; data-instant drops it.',
	],
];

const usageImport = "import { Tooltip } from '@/components/lumo/ui/Tooltip';";
const usageExample = `<Tooltip.Provider delay={300}>
	<Tooltip.Root>
		<Tooltip.Trigger render={<Button variant="outline">hover me</Button>} />
		<Tooltip.Portal>
			<Tooltip.Positioner>
				<Tooltip.Popup>
					a hint, on hover and on focus
					<Tooltip.Arrow />
				</Tooltip.Popup>
			</Tooltip.Positioner>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>`;

export function TooltipPage() {
	return (
		<DocPage title="tooltip" description="hover and focus hint anchored to its trigger">
			<DocPreview path="src/pages/Tooltip/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. hovering only ever previews; the same hint is announced on
						keyboard focus, and the trigger is already tied to it by{' '}
						<Mono>aria-describedby</Mono>.
					</>
				}
			>
				<DocInstall
					name="tooltip"
					packages={['@base-ui/react']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="a provider for the timing, a root for the state, a trigger to point at."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="one popup, three triggers"
				note={
					<>
						hover straight across the row: the popup glides to the next trigger, its
						content slides out the way it came, and the width animates instead of
						jumping. that is <Mono>Viewport</Mono>.
					</>
				}
			>
				<DocPreview path="src/pages/Tooltip/demos/detached.tsx">
					<Detached />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a hint is not a name"
				note={
					<>
						an icon-only button still needs its <Mono>aria-label</Mono>: a tooltip
						describes and does not name, so a screen reader that never shows it would
						leave the control anonymous.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					and it is never the only way to say something that matters — a value only a
					hover reveals is a value a keyboard cannot reach on a touchscreen.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the timing lives on the provider, the state on the root."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Tooltip.Provider</Mono> — the timing
						</p>
						<PropTable props={providerProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the arrow follows data-side, so it hangs off whichever edge Base UI picked without a second measurement."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
