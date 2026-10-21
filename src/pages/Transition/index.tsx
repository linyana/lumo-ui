import {
	Command,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	DocTabs,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Size from './demos/size';
import sizeSource from './demos/size.tsx?raw';
import Width from './demos/width';
import widthSource from './demos/width.tsx?raw';

const REPO = 'https://github.com/linyana/lumo-ui/blob/main';

const files = [
	'src/components/lumo/ui/Transition.tsx',
	'src/lib/cn.ts',
	'src/styles/lumo-tokens.css',
];

const installTabs = [
	{
		value: 'cli',
		label: 'Command',
		content: (
			<div className="space-y-3">
				<Command>bunx shadcn@latest add linyana/lumo-ui/transition</Command>
				<p className="text-muted-foreground">
					copies <Mono>Transition.tsx</Mono>, the <Mono>cn()</Mono> it imports, and{' '}
					<Mono>motion</Mono> as a dependency of the box, not of the measurement.
				</p>
			</div>
		),
	},
	{
		value: 'manual',
		label: 'Manual',
		content: (
			<div className="space-y-3">
				<ul className="space-y-1.5">
					{files.map((path) => (
						<li key={path}>
							<a
								href={`${REPO}/${path}`}
								target="_blank"
								rel="noreferrer noopener"
								className="font-mono underline underline-offset-4 hover:text-foreground"
							>
								{path}
							</a>
						</li>
					))}
				</ul>
			</div>
		),
	},
];

const transitionProps: Record<string, PropNode> = {
	className: {
		type: 'string',
		description:
			'Merged last through cn(), onto the box whose size glides. A width set here (`w-fit`) makes the content the thing that sizes it.',
	},
	children: {
		required: true,
		type: 'ReactNode',
		description:
			'One block of content. Keep its root a block element — the box measures it, and the size it measured is what it becomes.',
	},
};

export function TransitionPage() {
	return (
		<DocPage
			title="Transition"
			description="a box that holds one block of content and keeps its size to what is inside it"
		>
			<DocPreview name="size.tsx" source={sizeSource}>
				<Size />
			</DocPreview>

			<DocSection
				title="one measurement, one glide"
				note={
					<>
						the box measures what is inside it and eases to that size, continuously — so
						content that changes, wraps at a new width, or arrives late does not move
						the page beneath it. the height is measured, not guessed, and a reflow
						inside the content re-targets the glide instead of snapping. nothing fades,
						nothing travels, nothing is drawn twice: the content is replaced in place
						and a clip holds it while the box moves.
					</>
				}
			>
				<DocTabs tabs={installTabs} />
			</DocSection>

			<DocSection
				title="width, when the content is what sizes the box"
				note={
					<>
						a box the page sizes — a block filling its parent, a grid cell — keeps the
						width the page gives it, and only the height is the box's to ease. a box
						that sizes itself is measured in both directions: it asks the content how
						wide it wants to be (free of the width it is pinned at now, which would only
						wrap what it measured) and glides to that too. nothing to configure — a{' '}
						<Mono>w-fit</Mono> is the whole switch. content that wants more room than
						there is wraps in the room the page gives it, exactly as <Mono>w-fit</Mono>{' '}
						would have computed it.
					</>
				}
			>
				<DocPreview name="width.tsx" source={widthSource}>
					<Width />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what drives it"
				note={
					<>
						one token pair: <Mono>--duration-size</Mono> (200ms) on{' '}
						<Mono>--ease-overlay</Mono>, an ease-out with a long tail so the box arrives
						without overshooting. it is read when a glide starts, not once on mount, so
						the tokens file zeroing it under <Mono>prefers-reduced-motion</Mono> reaches
						the next one.
					</>
				}
			>
				<DocTable
					head={['part', 'carries', 'note']}
					mono={[0]}
					rows={[
						[
							'data-slot="transition"',
							'the box',
							'the element whose size glides; it holds the content in flow, so it has a size to move from.',
						],
						[
							'data-slot="transition-content"',
							'the child',
							'what is measured. flow-root, so the margins of what is inside stay inside and the measurement is honest — and max-content, when the content is what sizes the box, so a change of content changes this element and nothing else.',
						],
						[
							'data-swapping',
							'the box, while it moves',
							'present only while the box glides, which is when it clips.',
						],
					]}
				/>
			</DocSection>

			<DocSection title="props">
				<PropTable props={transitionProps} />
			</DocSection>
		</DocPage>
	);
}
