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
import Dots from './demos/dots';
import Failed from './demos/failed';
import Vertical from './demos/vertical';

const files = ['src/components/lumo/ui/Steps.tsx'];

const rootProps: Record<string, PropNode> = {
	current: {
		type: 'number',
		description:
			'The index of the item that is happening now. The items before it are finish, it is process and marks itself aria-current="step", the ones after are wait. Leave it out and every item rests as wait, which is the plain guide list.',
	},
	orientation: {
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description:
			'Which way the sequence runs. The connector is placed differently in each, because it leaves the circle at a fixed point either way.',
	},
	size: {
		type: '"sm" | "md"',
		default: '"md"',
		description:
			'Sets the circle’s box and the type. Both are read back through CSS, so every part measures from the same two numbers.',
	},
	variant: {
		type: '"numbered" | "dot"',
		default: '"numbered"',
		description:
			'A number, a check or a caller’s glyph — or a bare dot for a list where the position is enough and the count is not the point.',
	},
};

const itemProps: Record<string, PropNode> = {
	status: {
		type: '"wait" | "process" | "finish" | "error"',
		description:
			'Overrides what current says about this one item, and the only way to reach error. The item writes it to data-status, and the parts inside colour themselves from there.',
	},
	icon: {
		type: 'ReactNode',
		description:
			'A rendered element in place of the number, sized by the text around it — the same slot rule as Button. finish draws a check on its own unless one is given here.',
	},
};

const hookRows = [
	['data-slot="steps"', 'the list', 'an <ol>, so the order is announced rather than drawn.'],
	['data-orientation', 'horizontal | vertical', 'on the list.'],
	['data-size', 'sm | md', 'on the list.'],
	['data-variant', 'numbered | dot', 'on the list and on each indicator.'],
	['data-slot="steps-item"', 'one step', 'an <li>. The current one carries aria-current="step".'],
	[
		'data-status',
		'wait | process | finish | error',
		'on the item and its indicator — the title and the connector read it off the item.',
	],
	[
		'data-slot="steps-separator"',
		'the line to the next step',
		'aria-hidden; hidden on the last item by CSS, so no caller has to place one.',
	],
	[
		'data-slot="steps-content"',
		'the text of a step',
		'holds the title, the description, or both.',
	],
	[
		'data-slot="steps-title"',
		'its name',
		'body colour in every status, destructive when the step failed.',
	],
	['data-slot="steps-description"', 'the detail under it', 'always muted.'],
];

const usageImport = "import { Steps } from '@/components/lumo/ui/Steps';";
const usageExample = `<Steps.Root current={1}>
	<Steps.Item>
		<Steps.Title>account</Steps.Title>
		<Steps.Description>email and password</Steps.Description>
	</Steps.Item>
	<Steps.Item>
		<Steps.Title>workspace</Steps.Title>
	</Steps.Item>
</Steps.Root>`;

export function StepsPage() {
	return (
		<DocPage title="steps" description="a sequence of steps, with the one you are on marked">
			<DocPreview path="src/pages/Steps/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, no Base UI: there is no behaviour to borrow beyond an{' '}
						<Mono>{'<ol>'}</Mono>, so what is left is a list that reads its own order
						and colours itself from it.
					</>
				}
			>
				<DocInstall
					name="steps"
					packages={['lucide-react', 'tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						items have to be direct children of the root: that is where each one reads
						its position from, so no caller states an index.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="vertical"
				note={
					<>
						the gap between two vertical steps is padding inside the item, not a gap
						between them — that is what lets the connector above it run all the way to
						the next circle, whatever height the text turns out to be.
					</>
				}
			>
				<DocPreview path="src/pages/Steps/demos/vertical.tsx">
					<Vertical />
				</DocPreview>
			</DocSection>

			<DocSection
				title="one that failed"
				note={
					<>
						<Mono>status</Mono> on an item wins over <Mono>current</Mono>, and{' '}
						<Mono>error</Mono> is the one status only a caller can reach — the item
						lands in <Mono>--destructive</Mono> instead of the primary colour, and its
						title follows.
					</>
				}
			>
				<DocPreview path="src/pages/Steps/demos/failed.tsx">
					<Failed />
				</DocPreview>
			</DocSection>

			<DocSection
				title="dots, and glyphs"
				note={
					<>
						<Mono>variant=&quot;dot&quot;</Mono> keeps the circle’s box and paints a dot
						in it, because the connector is positioned from that box. an{' '}
						<Mono>icon</Mono> is a rendered element in the same slot as the number, so
						it grows with the type — no size to pass.
					</>
				}
			>
				<DocPreview path="src/pages/Steps/demos/dots.tsx">
					<Dots />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note={
					<>
						every part takes the props of the element it renders, so{' '}
						<Mono>className</Mono>, <Mono>aria-label</Mono> and{' '}
						<Mono>aria-labelledby</Mono> go where you expect. <Mono>Steps.Title</Mono>{' '}
						and <Mono>Steps.Description</Mono> have no props of their own beyond that.
					</>
				}
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Steps.Root</Mono> — the list
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Steps.Item</Mono> — one step
						</p>
						<PropTable props={itemProps} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note={
					<>
						the status lives on the DOM rather than in every part, so an item set to{' '}
						<Mono>error</Mono> recolours its own title, description and connector
						without any of them knowing why.
					</>
				}
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
