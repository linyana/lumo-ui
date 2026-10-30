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
import Peek from './demos/peek';
import States from './demos/states';

const files = ['src/components/ui/accordion.tsx'];

const rootProps: Record<string, PropNode> = {
	defaultValue: {
		type: 'Value[]',
		description: 'The item values that open with the page — one, unless `multiple`.',
	},
	value: {
		type: 'Value[]',
		description: 'The controlled form of the same thing.',
	},
	onValueChange: {
		type: '(value: Value[], eventDetails) => void',
		description:
			'Fires when a row opens or closes. Cancelling `eventDetails` leaves the list as it was.',
	},
	multiple: {
		type: 'boolean',
		default: 'false',
		description:
			'Whether several answers can stand open at once — a reference page rather than a set of choices.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Every row of the list at once, whichever way it is set on one of them.',
	},
	keepMounted: {
		type: 'boolean',
		default: 'false',
		description:
			'A fold that is never in the layout cannot be animated between two heights, so the panel sets this for itself; a list only needs it to keep closed answers in the DOM for its own reasons.',
	},
	hiddenUntilFound: {
		type: 'boolean',
		default: 'false',
		description:
			'The browser’s own page search may open a folded answer — `hidden="until-found"` instead of taking it out of the layout.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(). The hairline between two rows is drawn from here, so a list that wants to be a card says so here.',
	},
};

const itemProps: Record<string, PropNode> = {
	value: {
		type: 'Value',
		required: true,
		description: 'Its name in the list’s state — what the array holds while it is open.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'One row that cannot be pressed, while the rest of the list still works.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn().',
	},
};

const panelProps: Record<string, PropNode> = {
	peek: {
		type: 'number',
		default: '0',
		description:
			'The height kept while folded, in pixels, so a closed answer can still show a line of itself. 0 takes it out of the layout rather than leaving it short.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(), so a Base UI state callback is not accepted. The clip lives here.',
	},
	'...props': {
		type: 'Base UI Accordion.Panel props',
		description:
			'Everything else goes to Base UI: keepMounted is already set, the id and aria-* follow the trigger.',
	},
};

const partRows = [
	[
		'Accordion.Root',
		'the list',
		'the value every row shares: one at a time, or several with `multiple`. It also draws the hairline between two rows and nothing at either end.',
	],
	[
		'Accordion.Item',
		'one fold',
		'a header and a panel, and the name the list knows it by. Its `disabled` takes one row out without touching the others.',
	],
	[
		'Accordion.Header',
		'the row’s heading',
		'an `h3`, which is a guess at where the list sits in the page — `render={<h2 />}` is how a call site says otherwise.',
	],
	[
		'Accordion.Trigger',
		'the row you press',
		'a button with `aria-expanded`, drawn exactly as a collapsible’s trigger — the same caret, the same tint, the same focus ring.',
	],
	['Accordion.Icon', 'the caret', 'turns on `group-data-panel-open`, read off that trigger.'],
	[
		'Accordion.Panel',
		'the answer',
		'mounted while folded so it has two heights to glide between, and `inert` meanwhile; `peek` is the height it keeps.',
	],
];

const hookRows = [
	[
		'data-slot="accordion" · "-item" · "-header" · "-trigger" · "-icon" · "-panel"',
		'the six parts',
		'one element each.',
	],
	['data-index', 'where the row sits', 'written by Base UI on the item and its trigger.'],
	['data-open', 'present on an open item', 'the fold itself.'],
	[
		'data-panel-open',
		'present on the trigger of an open item',
		'the attribute the caret reads — the same one a collapsible writes, which is why one rule draws both.',
	],
	['data-disabled', 'present while disabled', 'on the list and on any one item.'],
	[
		'aria-expanded · aria-controls',
		'—',
		'on the trigger, from Base UI: `aria-expanded` always, and `aria-controls` once the answer is in the layout. The panel is a `region`, labelled by its row.',
	],
	[
		'inert',
		'present while folded',
		'the panel stays in the DOM to be animated, and stays out of the way.',
	],
];

const usageImport = "import { Accordion } from '@/components/ui/accordion';";
const usageExample = `<Accordion.Root defaultValue={['install']}>
	<Accordion.Item value="install">
		<Accordion.Header>
			<Accordion.Trigger>
				how is it installed
				<Accordion.Icon />
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel>
			<p className="px-3 pb-3">one command per component.</p>
		</Accordion.Panel>
	</Accordion.Item>
</Accordion.Root>`;

export function AccordionPage() {
	return (
		<DocPage title="accordion" description="a list of folds that share one value">
			<DocPreview path="src/pages/Accordion/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and the <Mono>Transition</Mono> that folds it — the same box a
						collapsible glides with, so a row here and a lone fold open at the same
						speed.
					</>
				}
			>
				<DocInstall
					name="accordion"
					files={files}
					reaches={[
						'src/components/ui/transition.tsx',
						'src/lib/control.ts',
						'src/lib/motion.ts',
						'src/lib/measure.ts',
						'src/lib/utils.ts',
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						six parts, in the order they nest: a list, a fold with a name, the heading
						its row sits in, the row, the caret, and the answer. the caret is a part
						rather than an icon passed in, because it reads the open state off the row.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="one at a time"
				note={
					<>
						without <Mono>multiple</Mono>, opening a row closes the one before it: the
						list holds one value, and a fold is only open while it is that value. that
						is the whole difference between this and a stack of <Mono>Collapsible</Mono>
						s — the state is the list’s, not each row’s.
					</>
				}
			>
				<DocPreview path="src/pages/Accordion/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="more than one at a time"
				note={
					<>
						<Mono>multiple</Mono> lets several answers stand open — a reference page
						rather than a set of choices. the rows are the same either way; only what
						the value may hold changes.
					</>
				}
			>
				<DocPreview path="src/pages/Accordion/demos/multiple.tsx">
					<Multiple />
				</DocPreview>
			</DocSection>

			<DocSection
				title="folded, not gone"
				note={
					<>
						a folded panel can keep a height instead of leaving the layout —{' '}
						<Mono>peek</Mono> is how much of the answer stays visible, which is what
						turns a closed log from a heading into a heading with a line under it.
					</>
				}
			>
				<DocPreview path="src/pages/Accordion/demos/peek.tsx">
					<Peek />
				</DocPreview>
			</DocSection>

			<DocSection
				title="the same fold as a collapsible"
				note={
					<>
						a row here is a collapsible’s trigger, a collapsible’s caret and a
						collapsible’s panel, with the value moved up to the list. so the two are one
						appearance and one speed: what an accordion adds is not a look, it is the
						row knowing it is one of a set.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the height still belongs to <Mono>Transition</Mono> — the folded panel stays in
					the DOM so there are two heights to glide between, and is <Mono>inert</Mono>{' '}
					until it opens, rather than <Mono>hidden</Mono>.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the list takes the value; a fold takes its name in it."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Accordion.Root</Mono> — the list
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Accordion.Item</Mono> — one fold
						</p>
						<PropTable props={itemProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Accordion.Panel</Mono> — the answer
						</p>
						<PropTable props={panelProps} />
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
				note="the open state is on the row as an attribute, so the caret needs no prop to know it."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
