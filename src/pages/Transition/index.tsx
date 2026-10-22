import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import transitionSource from '@/components/lumo/ui/Transition.tsx?raw';
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
import Size from './demos/size';
import sizeSource from './demos/size.tsx?raw';
import Width from './demos/width';
import widthSource from './demos/width.tsx?raw';

const files: DocFile[] = [
	{ path: 'src/components/lumo/ui/Transition.tsx', code: transitionSource },
];

const transitionProps: Record<string, PropNode> = {
	children: {
		required: true,
		type: 'ReactNode',
		description:
			'One block of content. Keep its root a block element — the box measures it, and the size it measured is what it becomes.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(), onto the box whose size glides. A width set here (w-fit) makes the content the thing that sizes it.',
	},
};

const hookRows = [
	[
		'data-slot="transition"',
		'the box',
		'the element whose size glides; it holds the content in flow, so it has a size to move from.',
	],
	[
		'data-slot="transition-content"',
		'the child',
		'what is measured. flow-root, so the margins of what is inside stay inside — and max-content when the content is what sizes the box.',
	],
	[
		'data-swapping',
		'the box, while it moves',
		'present only while it glides, which is when it clips.',
	],
	[
		'--duration-size · --ease-overlay',
		'200ms, ease-out with a long tail',
		'read when a glide starts rather than on mount, so the tokens file can zero them for reduced motion.',
	],
];

const usageImport = "import { Transition } from '@/components/lumo/ui/Transition';";
const usageExample = `<div className="rounded-md border p-3">
	<Transition>
		<p className="text-sm">{body}</p>
	</Transition>
</div>`;

export function TransitionPage() {
	return (
		<DocPage
			title="transition"
			description="a box that holds one block of content and keeps its size to what is inside it"
		>
			<DocPreview name="size.tsx" source={sizeSource}>
				<Size />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file and one dependency: <Mono>motion</Mono> runs the glide, but the
						size it glides to is measured here rather than asked of it — a browser knows
						how tall its own content is, and nothing else does.
					</>
				}
			>
				<DocInstall
					name="transition"
					packages={['motion']}
					files={files}
					reaches={[{ path: 'src/lib/cn.ts', code: cnSource }]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						wrap the block whose size changes and let it change. the box measures what
						is inside, eases to that, and re-measures when the content reflows — a swap,
						a late font, a line that wraps at a new width.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="one measurement, one glide"
				note={
					<>
						the height is measured, not guessed, and a reflow inside the content
						re-targets the glide instead of snapping. nothing fades, nothing travels,
						nothing is drawn twice: the content is replaced in place and a clip holds it
						while the box moves.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					that is what makes it useful under a body that changes for reasons the box does
					not know about — an answer that arrives, a tab that swaps its text, a panel that
					stays open while its contents grow.
				</p>
			</DocSection>

			<DocSection
				title="width, when the content is what sizes the box"
				note={
					<>
						a box the page sizes — a block filling its parent, a grid cell — keeps the
						width the page gives it, and only the height is the box’s to ease. a box
						that sizes itself is measured in both directions: it asks the content how
						wide it wants to be, free of the width it is pinned at now, and glides to
						that too. nothing to configure — a <Mono>w-fit</Mono> is the whole switch.
					</>
				}
			>
				<DocPreview name="width.tsx" source={widthSource}>
					<Width />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="one block in, one size out. the content is measured, so it has to be a block."
			>
				<PropTable props={transitionProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="its own state is one attribute long, and the tokens it reads are the theme’s."
			>
				<DocTable head={['part', 'carries', 'notes']} mono={[0]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
