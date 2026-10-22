import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import separatorSource from '@/components/lumo/ui/Separator.tsx?raw';
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
import BetweenRows from './demos/between-rows';
import betweenRowsSource from './demos/between-rows.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Separator.tsx', code: separatorSource }];

const separatorProps: Record<string, PropNode> = {
	orientation: {
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description:
			'Which way the line runs. A vertical one stretches to its row and is one pixel wide, so give it a height and a row that has one.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the margin and the height live here.',
	},
	'...props': {
		type: 'Base UI Separator props',
		description:
			'render and the element’s own attributes; the role and the aria value are Base UI’s.',
	},
};

const hookRows = [
	['role="separator"', '—', 'announced, not merely drawn.'],
	[
		'aria-orientation',
		'horizontal | vertical',
		'from the same prop, so a screen reader hears the direction.',
	],
	['data-slot="separator"', 'the line', 'h-px w-full, or w-px self-stretch.'],
	[
		'aria-hidden',
		'—',
		'what to set on a line that is only a decoration; Base UI leaves that to you.',
	],
];

const usageImport = "import { Separator } from '@/components/lumo/ui/Separator';";
const usageExample = `<div>
	project settings
	<Separator className="my-3" />
	<div className="flex items-center gap-3">
		3 members
		<Separator orientation="vertical" className="h-4" />
		updated today
	</div>
</div>`;

export function SeparatorPage() {
	return (
		<DocPage title="separator" description="a line between two regions, announced as one">
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file, and barely that: the element, its role and its orientation are
						Base UI’s, and the whole of the appearance is <Mono>bg-border</Mono> in the
						given direction.
					</>
				}
			>
				<DocInstall
					name="separator"
					packages={['@base-ui/react']}
					files={files}
					reaches={[{ path: 'src/lib/cn.ts', code: cnSource }]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						a real <Mono>role=&quot;separator&quot;</Mono> with an orientation, so it is
						announced rather than merely drawn.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="between rows"
				note={
					<>
						inside a list the line is the item’s own top border and nothing else: no
						margin to collapse, no last-child rule to remember, because the row that
						draws it is the row that needs it.
					</>
				}
			>
				<DocPreview name="between-rows.tsx" source={betweenRowsSource}>
					<BetweenRows />
				</DocPreview>
			</DocSection>

			<DocSection
				title="a decoration is not a separator"
				note={
					<>
						the role is a promise that the two sides are two regions. a line that is
						only ruling — under a heading, inside a card — is a <Mono>border</Mono>, and
						wrapping it in a separator tells a screen reader about a structure that is
						not there.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					where the line is drawn but the meaning is not wanted, <Mono>aria-hidden</Mono>{' '}
					takes the promise back.
				</p>
			</DocSection>

			<DocSection title="api reference" note="one prop of its own; the rest is Base UI’s.">
				<PropTable props={separatorProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the orientation is written twice — once for the eye, once for the reader — from the same prop."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
