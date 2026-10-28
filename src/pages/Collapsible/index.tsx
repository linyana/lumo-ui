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
import Swapped from './demos/swapped';

const files = ['src/components/lumo/ui/Collapsible.tsx'];

const panelProps: Record<string, PropNode> = {
	peek: {
		type: 'number',
		default: '0',
		description:
			'The height kept while closed, in pixels, so a folded body can show a peek of itself instead of nothing. 0 takes the closed panel out of the layout. The box clips while it holds one.',
	},
	className: {
		type: 'string',
		description:
			'Merged with cn(), so a Base UI state callback is not accepted. The clip lives here.',
	},
	'...props': {
		type: 'Base UI Collapsible.Panel props',
		description:
			'Everything else goes to Base UI: keepMounted is already set, id and aria-* follow the trigger.',
	},
};

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
		description: 'Fires on a click on the trigger, and after the spring has run out.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'The trigger stops taking the pointer and dims to half.',
	},
};

const hookRows = [
	[
		'data-slot="collapsible-trigger"',
		'the row',
		'group, so the caret inside can read its state.',
	],
	['data-panel-open', 'present while open', 'written by Base UI onto the trigger.'],
	['data-slot="collapsible-icon"', 'the caret', 'rotates 90° on group-data-panel-open.'],
	[
		'data-slot="collapsible-panel"',
		'the body',
		'overflow-clip; height is the animated number, not a class.',
	],
	[
		'inert',
		'present while closed',
		'the panel stays mounted to be animated, and stays out of the way.',
	],
	['aria-controls · aria-expanded', '—', 'on the trigger, from Base UI; the id is its own.'],
];

const usageImport = "import { Collapsible } from '@/components/lumo/ui/Collapsible';";
const usageExample = `<Collapsible.Root>
	<Collapsible.Trigger>
		recovery keys
		<Collapsible.Icon />
	</Collapsible.Trigger>
	<Collapsible.Panel>
		<div className="px-3 pb-3">alien-bean-pasta</div>
	</Collapsible.Panel>
</Collapsible.Root>`;

export function CollapsiblePage() {
	return (
		<DocPage title="collapsible" description="a disclosure region that expands one panel">
			<DocPreview path="src/pages/Collapsible/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						Base UI owns the id, the trigger’s <Mono>aria-expanded</Mono> and the state
						attributes; the panel takes <Mono>hidden</Mono> off so it has two heights to
						animate between. the height itself belongs to <Mono>Transition</Mono>, which
						is the one box in the library that glides to a size.
					</>
				}
			>
				<DocInstall
					name="collapsible"
					packages={['@base-ui/react', 'lucide-react']}
					files={files}
					reaches={[
						'src/components/lumo/ui/Transition.tsx',
						'src/lib/motion.ts',
						'src/lib/measure.ts',
						'src/lib/cn.ts',
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="three parts: a row, a caret that turns with the panel, and the panel itself."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a body that changes"
				note={
					<>
						the contents of every panel sit in a <Mono>Transition</Mono>, so a body that
						changes size once the panel is open eases to the new size instead of
						jumping. replacing the body needs nothing else: the box measures what is
						inside it and glides from its own height to the new one.
					</>
				}
			>
				<DocPreview path="src/pages/Collapsible/demos/swapped.tsx">
					<Swapped />
				</DocPreview>
			</DocSection>

			<DocSection
				title="why a spring"
				note={
					<>
						the closed height — <Mono>0</Mono>, or a <Mono>peek</Mono> — and{' '}
						<Mono>auto</Mono> — or, now, the size the body takes — are two ends of the
						same number to the animation, so a panel turns around mid-flight from where
						it is, at the speed it already had. there is no second animation underneath
						it: the height belongs to <Mono>Transition</Mono>, which measures the body
						and glides between the peek and whatever the body needs. the panel stays in
						the DOM while closed — that is what there is to animate — so it is{' '}
						<Mono>inert</Mono> until it opens, rather than <Mono>hidden</Mono>. a spring
						is for a size that travels, so a fold of a couple of rows — a submenu — is a
						short ease instead: it arrives while the reader is still looking at the
						click, rather than four hundred milliseconds later.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the caret reads <Mono>data-panel-open</Mono> off the trigger and turns with it,
					which is why it is a part of the component rather than an icon a call site
					passes: no generic glyph could know when to turn. it turns on{' '}
					<Mono>--duration-turn</Mono> rather than the state token — a glyph whose whole
					meaning is what the panel is doing keeps time with the panel, not with a hover.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root’s props are Base UI’s; the panel adds two of its own."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Collapsible.Root</Mono> — the state
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Collapsible.Panel</Mono> — the body
						</p>
						<PropTable props={panelProps} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the open state lives on the trigger as an attribute, so the caret needs no prop to know it."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
