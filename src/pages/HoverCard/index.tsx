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
import Link from './demos/link';

const files = ['src/components/ui/hover-card.tsx'];

const rootProps: Record<string, PropNode> = {
	open: {
		type: 'boolean',
		description: 'The card, controlled. Leave it out and the pointer decides.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where it starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, event, reason) => void',
		description: 'Fires when the pointer rests, leaves, or the card is dismissed.',
	},
};

const triggerProps: Record<string, PropNode> = {
	delay: {
		type: 'number',
		default: '600',
		description: 'How long the pointer rests before the card arrives. In milliseconds.',
	},
	closeDelay: {
		type: 'number',
		default: '300',
		description: 'How long after it leaves before the card goes — long enough to come back.',
	},
};

const partRows = [
	[
		'HoverCard.Trigger',
		'the thing it is about',
		'an anchor by default, and a button once composed through render; the keyboard reaches it the same way.',
	],
	['HoverCard.Portal', 'where it is mounted', 'the body, so nothing can clip the panel.'],
	[
		'HoverCard.Positioner',
		'where it points',
		'side, align and sideOffset (8 by default) — all Base UI’s.',
	],
	[
		'HoverCard.Popup',
		'the card',
		'rounded-xl, bordered, p-4, and capped at max-w-xs; the pointer can travel into it and back without it closing.',
	],
	[
		'HoverCard.Viewport',
		'the sliding window',
		'for a card whose content changes under one trigger; the old slides out as the new comes in.',
	],
	[
		'HoverCard.Arrow',
		'the pointer',
		'reads the side Base UI chose and hangs off that edge, carrying the card’s border and fill.',
	],
];

const hookRows = [
	[
		'data-slot="hover-card-popup"',
		'the card',
		'h-(--popup-height) and w-(--popup-width), so a viewport inside eases between panels.',
	],
	[
		'data-slot="hover-card-arrow"',
		'the pointer',
		'hangs off data-side; the square inside it is clipped to a triangle.',
	],
	['data-open · data-closed', 'the card and its trigger', 'Base UI’s, present while it is up.'],
	[
		'data-starting-style · data-ending-style',
		'entering / leaving',
		'scale-90 and opacity-0; data-instant drops it.',
	],
	['data-side', 'top | bottom | left | right', 'chosen by Base UI on every placement.'],
	[':focus-visible', 'on the trigger', 'a tab reaches the card too — it is not hover-only.'],
];

const usageImport = "import { HoverCard } from '@/components/ui/hover-card';";
const usageExample = `<HoverCard.Root>
	<HoverCard.Trigger render={<Button variant="link">@linyana</Button>} />
	<HoverCard.Portal>
		<HoverCard.Positioner side="bottom" align="start">
			<HoverCard.Popup>
				<HoverCard.Arrow />
				<p className="text-sm font-medium">Linyana</p>
				<p className="mt-1.5 text-sm text-muted-foreground">maintains lumo-ui.</p>
			</HoverCard.Popup>
		</HoverCard.Positioner>
	</HoverCard.Portal>
</HoverCard.Root>`;

export function HoverCardPage() {
	return (
		<DocPage title="hover card" description="a card about the thing the pointer rests on">
			<DocPreview path="src/pages/HoverCard/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, over Base UI’s preview card. what it adds to a popover is the
						wait: the pointer has to rest before anything arrives, and it can travel
						into the card without it closing — a popover opens on a click because it
						wants an answer, this one opens on a pause because it is offering context.
					</>
				}
			>
				<DocInstall
					name="hover-card"
					files={files}
					reaches={['src/lib/utils.ts', 'src/lib/surface.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the panel is a column of prose and one action, since a card this small holds
						an entity rather than a form. anything with a field in it is a popover.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a link, previewed"
				note={
					<>
						the canonical use, and the one that needs no render prop: the trigger is
						already an anchor, so the card opens under a real link and the keyboard
						focuses it the way it focuses any other.
					</>
				}
			>
				<DocPreview path="src/pages/HoverCard/demos/link.tsx">
					<Link />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>HoverCard.Root</Mono> — the state
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>HoverCard.Trigger</Mono> — the wait
						</p>
						<PropTable props={triggerProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the card arrives from wherever Base UI anchored it, so the same surface a popover is drawn on is what scales in."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
