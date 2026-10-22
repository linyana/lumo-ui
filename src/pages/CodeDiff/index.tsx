import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import codeDiffSource from '@/components/lumo/ui/CodeDiff.tsx?raw';
import codeSource from '@/components/lumo/ui/Code.tsx?raw';
import buttonSource from '@/components/lumo/ui/Button.tsx?raw';
import spinnerSource from '@/components/lumo/ui/Spinner.tsx?raw';
import cnSource from '@/lib/cn.ts?raw';
import shikiSource from '@/lib/shiki.ts?raw';
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
import Added from './demos/added';
import addedSource from './demos/added.tsx?raw';
import Basic from './demos/basic';
import basicSource from './demos/basic.tsx?raw';
import Surfaces from './demos/surfaces';
import surfacesSource from './demos/surfaces.tsx?raw';
import Unified from './demos/unified';
import unifiedSource from './demos/unified.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/CodeDiff.tsx', code: codeDiffSource }];

const diffProps: Record<string, PropNode> = {
	oldContent: {
		required: true,
		type: 'string',
		description: 'The file as it was. Its line numbers are the left column and the deletions.',
	},
	newContent: {
		required: true,
		type: 'string',
		description:
			'The file as it is now — what the copy button takes, and what the additions count.',
	},
	language: {
		type: 'string',
		description:
			'Grammar for both sides. Anything we do not ship falls back to plain text, the same way Code does.',
	},
	fileName: {
		type: 'string',
		description: 'Shown in the header instead of the language, which then sits beside it.',
	},
	view: {
		type: '"split" | "unified"',
		default: '"split"',
		description:
			'Side by side, paired row by row; or one column with a sign, both numberings kept.',
	},
	variant: {
		type: '"filled" | "outlined" | "ghost"',
		default: '"outlined"',
		description: 'The surface, borrowed from Code: muted, bordered, or nothing.',
	},
	copyable: {
		type: 'boolean',
		default: 'true',
		description: 'The button in the header, which takes the new version.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(), onto the block itself.',
	},
	'...props': {
		type: 'HTMLDivElement props',
		description: 'The block is a div: id, data-*, aria-* all land on it.',
	},
};

const hookRows = [
	['data-slot="code-diff"', 'the block', 'shares Code’s surface classes and variant tokens.'],
	['data-view', 'split | unified', 'on the block; the body’s grid columns follow it.'],
	['data-slot="code-diff-additions"', '+n', 'counted from the diff, in --success.'],
	['data-slot="code-diff-deletions"', '−n', 'the mirror, in --destructive.'],
	[
		'data-slot="code-diff-gutter"',
		'one number column',
		'carries the change stripe as a left border, so no row needs a background to say it changed.',
	],
	['data-slot="code-diff-sign"', '+ or −', 'the unified view’s own column.'],
	[
		'data-slot="code-diff-line"',
		'one side of a row',
		'a missing side keeps the cell and fills it muted.',
	],
];

const usageImport = "import { CodeDiff } from '@/components/lumo/ui/CodeDiff';";
const usageExample = `<CodeDiff
	oldContent={before}
	newContent={after}
	language="ts"
	fileName="greet.ts"
	view="unified"
/>`;

export function CodeDiffPage() {
	return (
		<DocPage title="code diff" description="two revisions of one file, and what changed">
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						no highlighter of its own: the diff borrows <Mono>Code</Mono>’s header, copy
						button and tokens, so the half that colours anything comes along with it.
					</>
				}
			>
				<DocInstall
					name="code-diff"
					packages={['diff']}
					files={files}
					reaches={[
						{ path: 'src/components/lumo/ui/Code.tsx', code: codeSource },
						{ path: 'src/lib/shiki.ts', code: shikiSource },
						{ path: 'src/components/lumo/ui/Button.tsx', code: buttonSource },
						{ path: 'src/components/lumo/ui/Spinner.tsx', code: spinnerSource },
						{ path: 'src/lib/cn.ts', code: cnSource },
					]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="two strings, one grammar. the rest is how you want to read the change."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="unified"
				note={
					<>
						one column with a sign, each side keeping its own line numbers — the shape a
						patch has, for a change too small to be worth two columns.
					</>
				}
			>
				<DocPreview name="unified.tsx" source={unifiedSource}>
					<Unified />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a block with no old side"
				note={
					<>
						a change with no old side leaves the left column blank rather than
						misaligning it: whichever side runs out first is padded, so the row keeps
						its shape and the numbering stays true.
					</>
				}
			>
				<DocPreview name="added.tsx" source={addedSource}>
					<Added />
				</DocPreview>
			</DocSection>

			<DocSection
				title="surfaces"
				note="the diff wears the same three backgrounds as a plain code block."
			>
				<DocPreview name="surfaces.tsx" source={surfacesSource}>
					<Surfaces />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="both revisions are required; everything else has a default."
			>
				<PropTable props={diffProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note={
					<>
						the counts and the column grid both come from the diff, not from the caller:
						nothing here is asked to agree with anything.
					</>
				}
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
