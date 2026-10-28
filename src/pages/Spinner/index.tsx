import { Button } from '@/components/lumo/ui/Button';
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
import Inline from './demos/inline';
import Sizes from './demos/sizes';

const files = ['src/components/lumo/ui/Spinner.tsx'];

const spinnerProps: Record<string, PropNode> = {
	dots: {
		type: 'number',
		default: '8',
		description:
			'How many dots go round. Floored at 4: below that the ring stops reading as a ring.',
	},
	dotScale: {
		type: 'number',
		default: '0.2',
		description:
			'A dot’s width, as a share of the spinner’s box. Clamped to 0.2–0.4 so the dots can neither vanish nor merge.',
	},
	radiusScale: {
		type: 'number',
		default: '0.34',
		description:
			'The ring’s radius, as a share of the box. Clamped so a ring can never cross its own edge.',
	},
	label: {
		type: 'ReactNode',
		default: '"Loading"',
		description:
			'Visually hidden status text. null where the surrounding control already announces its own state, which drops the status role with it.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the size and the ink live here.',
	},
	'...props': {
		type: 'HTMLSpanElement props',
		description:
			'style, id, data-* — the dot positions are inline styles and stay the spinner’s.',
	},
};

const hookRows = [
	[
		'data-slot="spinner"',
		'the box',
		'one em square, an inline-flex, so it sits on the text’s baseline.',
	],
	['data-slot="spinner-dot"', 'each dot', 'bg-current, with its own animation delay.'],
	['role="status"', 'present when label is set', 'with the label as visually hidden text.'],
	['aria-hidden', 'on the ring', 'the dots are decoration; the label is the announcement.'],
	['--duration', '1s', 'one turn of the ring; the delay is the turn divided by the dot count.'],
	[
		'container-type: size',
		'on the box',
		'the dots are placed in cqmin, so the ring scales with its own size.',
	],
];

const usageImport = "import { Spinner } from '@/components/lumo/ui/Spinner';";
const usageExample = `<p className="flex items-center gap-2 text-sm">
	<Spinner label={null} />
	saving
</p>`;

export function SpinnerPage() {
	return (
		<DocPage title="spinner" description="the one loading indicator, sized in em">
			<DocPreview path="src/pages/Spinner/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file and no dependency but <Mono>cn()</Mono>: the ring is eight spans
						placed in container units, so there is no SVG and no image to carry.
					</>
				}
			>
				<DocInstall
					name="spinner"
					packages={[]}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						pass <Mono>label={'{null}'}</Mono> inside a control that already announces
						its own state — a button that says it is busy does not need to say it twice.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="sizes, and ink"
				note={
					<>
						it is <Mono>size-[1em]</Mono> and <Mono>bg-current</Mono>: a size class
						chooses the box, and the colour is whatever the text around it is.
					</>
				}
			>
				<DocPreview path="src/pages/Spinner/demos/sizes.tsx">
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in the text’s own size"
				note="the point of sizing in em: a control loads at exactly the size of the icon it replaces."
			>
				<DocPreview path="src/pages/Spinner/demos/inline.tsx">
					<Inline />
				</DocPreview>
			</DocSection>

			<DocSection
				title="where it is used"
				note={
					<>
						<Mono>Button</Mono> defaults its <Mono>loadingIcon</Mono> to this element,
						so <Mono>loading</Mono> and a leading icon cannot disagree about size.
					</>
				}
			>
				<div className="flex flex-wrap items-center gap-3">
					<Button loading>saving</Button>
					<Button variant="outline" loading>
						outline
					</Button>
					<Button size="icon" loading aria-label="saving" />
				</div>
			</DocSection>

			<DocSection
				title="api reference"
				note="every prop has a default; the ring works untouched."
			>
				<PropTable props={spinnerProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the ring is placed in container units, so one size class is the whole of the geometry a call site has to think about."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
