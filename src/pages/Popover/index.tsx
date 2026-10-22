import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import popoverSource from '@/components/lumo/ui/Popover.tsx?raw';
import cnSource from '@/lib/cn.ts?raw';
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
import Detached from './demos/detached';
import detachedSource from './demos/detached.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Popover.tsx', code: popoverSource }];

const rootProps: Record<string, PropNode> = {
	open: {
		type: 'boolean',
		description: 'The panel, controlled. Leave it out and the root keeps the state itself.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where it starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, event, reason) => void',
		description: 'Fires on the trigger, on a click outside, and on escape.',
	},
};

const partRows = [
	['Popover.Root', 'the state', 'one root per panel, or one for many triggers through handle.'],
	['Popover.Trigger', 'the button that opens it', 'compose a Button through render.'],
	['Popover.Portal', 'where it is mounted', 'the body, so nothing can clip the panel.'],
	[
		'Popover.Positioner',
		'where it points',
		'side, align and sideOffset (8 by default) — all Base UI’s.',
	],
	[
		'Popover.Popup',
		'the panel',
		'rounded-lg, bordered, p-3, max-w-md; sized to what is inside it.',
	],
	[
		'Popover.Viewport',
		'the sliding window',
		'one panel can hold several; the old slides out as the new comes in.',
	],
	[
		'Popover.Arrow',
		'the pointer',
		'reads the side Base UI chose and hangs off that edge, carrying the panel’s border and fill.',
	],
	['Popover.Title', 'its name', 'text-sm font-semibold.'],
	['Popover.Description', 'the sentence under it', 'muted, mt-1, announced with the title.'],
	['Popover.Close', 'a way out', 'one per exit.'],
	[
		'Popover.Backdrop',
		'a dim behind',
		'only for a modal popover; the panel is normally page-level.',
	],
];

const hookRows = [
	[
		'data-slot="popover-popup"',
		'the panel',
		'h-(--popup-height) and w-(--popup-width), so a viewport inside eases between panels.',
	],
	[
		'data-slot="popover-arrow"',
		'the pointer',
		'hangs off data-side; the square inside it is clipped to a triangle.',
	],
	[
		'data-slot="popover-viewport"',
		'the sliding window',
		'carries the inline padding both panels are clipped to.',
	],
	[
		'data-current · data-previous',
		'the panel arriving / leaving',
		'Base UI’s, and what the slide is written against.',
	],
	['data-activation-direction', 'left | right | up | down', 'which way the panels travel.'],
	[
		'data-starting-style · data-ending-style',
		'entering / leaving',
		'scale-90 and opacity-0; data-instant drops it.',
	],
	[
		'data-side',
		'top | bottom | left | right',
		'chosen by Base UI on every placement, and read by the arrow.',
	],
];

const usageImport = "import { Popover } from '@/components/lumo/ui/Popover';";
const usageExample = `<Popover.Root>
	<Popover.Trigger render={<Button>open</Button>} />
	<Popover.Portal>
		<Popover.Positioner side="bottom" align="start">
			<Popover.Popup>
				<Popover.Arrow />
				<Popover.Title>deploy to production?</Popover.Title>
				<Popover.Description>it rebuilds in about a minute.</Popover.Description>
				<Popover.Close render={<Button size="sm">deploy</Button>} />
			</Popover.Popup>
		</Popover.Positioner>
	</Popover.Portal>
</Popover.Root>`;

export function PopoverPage() {
	return (
		<DocPage title="popover" description="an anchored panel that holds rich content">
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the placement, the flip, the dismissal and the anchor tracking are
						Base UI’s; the arrow is the only part that had to be drawn, and it carries
						the panel’s own border and fill so the outline reads as one shape.
					</>
				}
			>
				<DocInstall
					name="popover"
					packages={['@base-ui/react']}
					files={files}
					reaches={[{ path: 'src/lib/cn.ts', code: cnSource }]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						unlike a dialog the page stays interactive behind it, so a click outside
						dismisses it.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="one popup, three detached triggers"
				note={
					<>
						no trigger owns the popup — one handle does, and each trigger hands it its
						own payload. the popup itself never unmounts, so moving between triggers
						slides the old panel out the way the new one came in.
					</>
				}
			>
				<DocPreview name="detached.tsx" source={detachedSource}>
					<Detached />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Popover.Root</Mono> — the state
						</p>
						<PropTable props={rootProps} />
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
