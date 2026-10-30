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
import States from './demos/states';

const files = ['src/components/ui/progress.tsx'];

const rootProps: Record<string, PropNode> = {
	value: {
		type: 'number | null',
		description:
			'How far the task has come, between `min` and `max`. `null` is the third state: nothing is known, and the bar says so by sweeping instead of filling.',
	},
	min: {
		type: 'number',
		default: '0',
		description: 'The bottom of the range.',
	},
	max: {
		type: 'number',
		default: '100',
		description: 'The top of it. Reaching it is what makes the bar complete.',
	},
	format: {
		type: 'Intl.NumberFormatOptions',
		description:
			'How `Value` writes the number. Left out, it is the percentage — which is not always what the reader needs: bytes, files, seconds.',
	},
	getAriaValueText: {
		type: '(formatted: string, value: number | null) => string',
		description: 'The sentence a screen reader hears in place of the bare number.',
	},
	locale: {
		type: 'Intl.LocalesArgument',
		description: 'The locale the number is formatted in; the browser’s by default.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the width of the whole block lives here.',
	},
};

const valueProps: Record<string, PropNode> = {
	children: {
		type: '(formatted: string | null, value: number | null) => ReactNode',
		description:
			'Optional. Left out, it prints Base UI’s formatted value; given, it can put the word beside the number.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); right-aligned, tabular figures, muted.',
	},
};

const partRows = [
	[
		'Progress.Root',
		'the whole bar',
		'a two-column grid: label and value on the first line, the track under both. It also carries `role="progressbar"`.',
	],
	['Progress.Label', 'the name', 'what the task is; Base UI wires it to the bar’s own id.'],
	[
		'Progress.Value',
		'the number',
		'formatted by Base UI from the same value, so the word and the fill cannot disagree.',
	],
	[
		'Progress.Track',
		'the groove',
		'spans both columns; its height is the one thing worth overriding per call site.',
	],
	[
		'Progress.Indicator',
		'the fill',
		'its width is Base UI’s percentage, eased; a null value turns it into a sweeping segment.',
	],
];

const hookRows = [
	[
		'data-slot="progress" · "-label" · "-value" · "-track" · "-indicator"',
		'the five parts',
		'one element each.',
	],
	[
		'data-progressing · data-complete · data-indeterminate',
		'where it is',
		'written on every part, so the whole bar can answer one state from plain CSS.',
	],
	[
		'role="progressbar" · aria-valuenow · aria-valuetext',
		'what is heard',
		'Base UI’s: clamped to the range, and worded rather than counted when `getAriaValueText` is given.',
	],
	[
		'width: <percentage>%',
		'the fill',
		'an inline style, transitioned over `--duration-overlay` — a step from 20 to 60 is a move, not a jump.',
	],
	[
		'--animate-progress-sweep',
		'an unknown end',
		'a 40% segment travelling one groove, edge to edge; the keyframe is in the theme, because its distances are what make it land.',
	],
	[
		'h-1.5 · rounded-full · bg-muted',
		'the groove',
		'the empty surface every placeholder uses, with the fill drawn in `primary` over it.',
	],
];

const usageImport = "import { Progress } from '@/components/ui/progress';";
const usageExample = `<Progress.Root value={uploaded} max={total} format={{ style: 'percent' }}>
	<Progress.Label>uploading</Progress.Label>
	<Progress.Value />
	<Progress.Track>
		<Progress.Indicator />
	</Progress.Track>
</Progress.Root>`;

export function ProgressPage() {
	return (
		<DocPage
			title="progress"
			description="how far a task has come, and whether that is knowable"
		>
			<DocPreview path="src/pages/Progress/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file and Base UI’s progress, which owns the arithmetic: it clamps the
						value to the range, computes the percentage once, and writes the number, the
						fill and the spoken text from that one result.
					</>
				}
			>
				<DocInstall name="progress" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the label, the number and the groove are three parts of one thing, so the
						bar is only ever correct when all three are given the same value — which is
						why they come from the root and not from each other.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="three states, one bar"
				note={
					<>
						<Mono>null</Mono> is not zero. zero is a task that has not started, and it
						draws an empty groove; <Mono>null</Mono> is a task whose length nobody
						knows, and it draws a segment sweeping the groove instead. a bar that sat at
						zero while it was working would be a bar telling a lie.
					</>
				}
			>
				<DocPreview path="src/pages/Progress/demos/states.tsx">
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="when it has nowhere to go"
				note={
					<>
						the sweep stops for a reader who asked for less motion, and the segment is
						held at the start of its travel. that is the honest still frame: it is still
						not a length.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the same rule the rest of the library follows — <Mono>Skeleton</Mono> keeps its
					box and drops its breath, <Mono>Spinner</Mono> keeps its dots and drops their
					pulse. nothing here is a timer, so there is nothing to cancel when the motion
					goes.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes the numbers; the parts take a class name."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Progress.Root</Mono> — the whole bar
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Progress.Value</Mono> — the number
						</p>
						<PropTable props={valueProps} />
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
				note="one value, three readings of it: the width, the number and the words."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
