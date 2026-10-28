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
import Flush from './demos/flush';
import Sizes from './demos/sizes';
import Stretch from './demos/stretch';

const files = ['src/components/lumo/ui/Card.tsx'];

const rootProps: Record<string, PropNode> = {
	size: {
		type: '"sm" | "md"',
		default: '"md"',
		description:
			'The padding and the gap between parts. Set once on the root: every part reads it back off the root, so a dense list of cards changes at one place.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(), onto the surface itself.',
	},
	'...props': {
		type: 'HTMLDivElement props',
		description: 'The root is a plain div: onClick, aria-*, data-* all land on it.',
	},
};

const partRows = [
	[
		'Card.Header',
		'a grid of its own',
		'one column, or two once an action is present — the action then sits opposite the title and its description.',
	],
	[
		'Card.Title',
		'a div, not a heading',
		'the level that is right for a card is the page’s to know.',
	],
	['Card.Description', 'muted text', 'one line under the title, in the same column.'],
	[
		'Card.Action',
		'the corner slot',
		'spans both rows, so it hangs beside the title and the description rather than under them.',
	],
	[
		'Card.Content',
		'the body',
		'takes the slack in a stretched card, which keeps footers aligned.',
	],
	[
		'Card.Footer',
		'a row at the bottom',
		'flex, gap-2, no divider — a footer that wants one adds border-t.',
	],
];

const hookRows = [
	['data-slot="card"', 'the surface', 'a div; the card adds the look, nothing else.'],
	['data-size', 'sm | md', 'on the root, and read by every part through group-data-[size=…].'],
	[
		'data-slot="card-header"',
		'the top block',
		'a grid; two columns only when an action is there.',
	],
	['data-slot="card-title"', 'its name', 'text-base font-semibold, overridable like any div.'],
	['data-slot="card-description"', 'the line under it', 'text-sm text-muted-foreground.'],
	['data-slot="card-action"', 'the corner slot', 'column two, rows one to two.'],
	['data-slot="card-content"', 'the body', 'flex-1, so a stretched card keeps its footer down.'],
	['data-slot="card-footer"', 'the bottom row', 'flex items-center gap-2.'],
];

const usageImport = "import { Card } from '@/components/lumo/ui/Card';";
const usageExample = `<Card.Root>
	<Card.Header>
		<Card.Title>scheduled reports</Card.Title>
		<Card.Description>weekly snapshots.</Card.Description>
		<Card.Action>
			<Button variant="ghost" size="sm">edit</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>every monday at 09:00</Card.Content>
	<Card.Footer className="justify-end">
		<Button size="sm">new report</Button>
	</Card.Footer>
</Card.Root>`;

export function CardPage() {
	return (
		<DocPage
			title="card"
			description="one surface, one subject, with its own header and footer"
		>
			<DocPreview path="src/pages/Card/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, every part a function in it. no Base UI here: a card has nothing
						to announce and nothing to trap, so what is left is layout.
					</>
				}
			>
				<DocInstall
					name="card"
					packages={['tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						parts, not props: a header holds the title, the description and an action
						that moves itself to the opposite column, so nothing is positioned by hand.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="sizes"
				note={
					<>
						<Mono>size</Mono> is set once on the root and read back by every part, so a
						dense list of cards only changes at the top.
					</>
				}
			>
				<DocPreview path="src/pages/Card/demos/sizes.tsx">
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="contents are yours"
				note={
					<>
						the card draws no divider and no padding of its own between parts — a footer
						that needs one adds <Mono>border-t pt-6</Mono>, and a table or an image goes
						edge to edge by cancelling the horizontal padding.
					</>
				}
			>
				<DocPreview path="src/pages/Card/demos/flush.tsx">
					<Flush />
				</DocPreview>
			</DocSection>

			<DocSection
				title="equal heights"
				note={
					<>
						<Mono>Content</Mono> grows into the slack of a stretched card, so a footer
						stays on the bottom edge however short the body is and two cards in one row
						share an outline.
					</>
				}
			>
				<DocPreview path="src/pages/Card/demos/stretch.tsx">
					<Stretch />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root is where the one prop lives; every other part is a div with an opinion about layout."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Card.Root</Mono> — the surface
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
				note="each part names itself, so a stylesheet can reach one without a class of its own."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
