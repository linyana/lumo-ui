import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import skeletonSource from '@/components/lumo/ui/Skeleton.tsx?raw';
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
import CardPlaceholder from './demos/card';
import cardSource from './demos/card.tsx?raw';
import Swap from './demos/swap';
import swapSource from './demos/swap.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Skeleton.tsx', code: skeletonSource }];

const skeletonProps: Record<string, PropNode> = {
	className: {
		type: 'string',
		description:
			'The size, and that is the whole API: h-4 w-2/3 for a line, size-10 rounded-full for an avatar. It merges last through cn().',
	},
	'...props': {
		type: 'HTMLDivElement props',
		description: 'The placeholder is a div; aria-hidden and data-* all land on it.',
	},
};

const hookRows = [
	['data-slot="skeleton"', 'the placeholder', 'a div, sized by the call site and nothing else.'],
	[
		'bg-muted',
		'its fill',
		'the same token every empty surface uses, so it reads as absence rather than as content.',
	],
	['animate-pulse', 'its breath', 'CSS, not JavaScript: no timer, and nothing to clean up.'],
	[
		'motion-reduce:animate-none',
		'held still',
		'for a reader who asked for less motion — the box stays, the pulse goes.',
	],
	[
		'rounded-md',
		'its corners',
		'overridden by the call site when the thing it stands in for is not a box.',
	],
];

const usageImport = "import { Skeleton } from '@/components/lumo/ui/Skeleton';";
const usageExample = `<div className="flex flex-col gap-2">
	<Skeleton className="h-4 w-2/3" />
	<Skeleton className="h-4 w-full" />
</div>`;

export function SkeletonPage() {
	return (
		<DocPage title="skeleton" description="a placeholder for content that has not arrived">
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one element and one dependency, <Mono>cn()</Mono>: there is no behaviour to
						borrow here, only a box that breathes. <Mono>Menu</Mono> borrows it for a
						rail that is still loading.
					</>
				}
			>
				<DocInstall
					name="skeleton"
					packages={[]}
					files={files}
					reaches={[{ path: 'src/lib/cn.ts', code: cnSource }]}
				/>
			</DocSection>

			<DocSection title="usage" note="a div with a size on it. nothing else to configure.">
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="the stand-in has the answer’s shape"
				note={
					<>
						a placeholder's only job is to be the size of what is coming, so it is
						assembled out of the same layout the answer uses — header, body, a control
						in the corner. three bars of equal width would be easier and would still
						move the page when the answer lands.
					</>
				}
			>
				<DocPreview name="card.tsx" source={cardSource}>
					<CardPlaceholder />
				</DocPreview>
			</DocSection>

			<DocSection
				title="and then the answer"
				note={
					<>
						because the two are the same height, the swap is a swap and not a reflow:
						the rows below stay where they are. <Mono>Tabs</Mono>' request demo is the
						same bargain at a larger scale — the panel opens at the placeholder's height
						and glides to the answer's.
					</>
				}
			>
				<DocPreview name="swap.tsx" source={swapSource}>
					<Swap />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what it is not"
				note={
					<>
						not a spinner: a spinner says work is happening somewhere, a skeleton says
						this space is spoken for. not a delay either — a placeholder that flashes
						for one frame is worse than the empty space it replaced, so a fast answer
						should never show one.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					it is also <Mono>aria-hidden</Mono> by being empty: there is nothing in it to
					announce, and the loading state belongs on the control that started the request
					— <Mono>Button</Mono>'s <Mono>loading</Mono>, or <Mono>Spinner</Mono>'s label.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="there are no props of its own; the size is the API."
			>
				<PropTable props={skeletonProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the breath is CSS, so a placeholder costs no timer and gives nothing back to clean up."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
