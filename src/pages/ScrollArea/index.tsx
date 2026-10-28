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
import Both from './demos/both';

const files = ['src/components/lumo/ui/ScrollArea.tsx'];

const scrollbarProps: Record<string, PropNode> = {
	orientation: {
		type: '"vertical" | "horizontal"',
		default: '"vertical"',
		description: 'Which axis the track runs along. One bar per axis you actually scroll.',
	},
	children: {
		type: 'ReactNode',
		default: '<Thumb />',
		description:
			'A bar with nothing in it draws nothing, so the thumb is supplied unless you draw your own.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the width of the track is here (w-2.5).',
	},
};

const partRows = [
	[
		'ScrollArea.Root',
		'the box',
		'overflow-hidden, and the height the caller gives it — nothing here measures the content.',
	],
	[
		'ScrollArea.Viewport',
		'what scrolls',
		'size-full, so it fills the root exactly and takes no width from the bar.',
	],
	[
		'ScrollArea.Content',
		'the content column',
		'the element whose size the scroll position is computed against.',
	],
	[
		'ScrollArea.Scrollbar',
		'one track',
		'drawn over the content; fades in while scrolling or hovered, and takes no pointer events until then.',
	],
	[
		'ScrollArea.Thumb',
		'the handle',
		'its length comes from Base UI as a variable, never from a class.',
	],
	['ScrollArea.Corner', 'the corner', 'the square a two-way pane would otherwise gain.'],
];

const hookRows = [
	['data-slot="scroll-area-root"', 'the box', 'relative min-h-0 overflow-hidden.'],
	['data-slot="scroll-area-viewport"', 'what scrolls', 'the native bar is hidden by Base UI.'],
	[
		'data-slot="scroll-area-scrollbar"',
		'one track',
		'opacity-0 until data-hovering or data-scrolling.',
	],
	[
		'data-hovering · data-scrolling',
		'present while pointed at / moving',
		'which is also when the track takes the pointer.',
	],
	['orientation', 'vertical | horizontal', 'on the track, and what decides its shape.'],
	['data-slot="scroll-area-thumb"', 'the handle', 'bg-ring, rounded-full, sized by Base UI.'],
	[
		'--scroll-area-thumb-height · -width',
		'the handle’s length',
		'written by Base UI on every scroll.',
	],
];

const usageImport = "import { ScrollArea } from '@/components/lumo/ui/ScrollArea';";
const usageExample = `<ScrollArea.Root className="h-56">
	<ScrollArea.Viewport>
		<ScrollArea.Content>{paragraphs}</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar />
</ScrollArea.Root>`;

export function ScrollAreaPage() {
	return (
		<DocPage
			title="scroll area"
			description="a pane that scrolls under a bar it keeps out of sight"
		>
			<DocPreview path="src/pages/ScrollArea/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the native bar is hidden and the position is Base UI’s; what is
						here is a track drawn over the content, in the theme’s colours, with the
						platform’s own bargain about when it shows.
					</>
				}
			>
				<DocInstall
					name="scroll-area"
					packages={['@base-ui/react']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						give the root a height and the viewport fills it. a pane with two lines and
						a pane with two hundred look the same at rest — neither is measured to
						decide anything.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="both ways"
				note={
					<>
						one bar per axis, and a <Mono>Corner</Mono> for where the two meet — without
						it the corner of a pane that scrolls both ways would hold a native square.
					</>
				}
			>
				<DocPreview path="src/pages/ScrollArea/demos/both.tsx">
					<Both />
				</DocPreview>
			</DocSection>

			<DocSection
				title="no bar at all"
				note={
					<>
						the viewport scrolls whether or not a <Mono>Scrollbar</Mono> is there: a
						pane that should not show one simply does not render it, and the gesture
						still works.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the same is true of the box’s own bar — Base UI has already hidden it, so a
					scroll area without a track is a pane you cannot see the position of, which is
					fine for a phone and not for a desktop.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the parts are Base UI’s; the scrollbar adds one prop."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>ScrollArea.Scrollbar</Mono> — the track
						</p>
						<PropTable props={scrollbarProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the thumb’s length is a variable Base UI writes on every scroll, so nothing here re-renders to follow it."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
