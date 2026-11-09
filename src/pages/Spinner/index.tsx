import { Button } from '@/components/ui/button';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	DocUsage,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Basic from './demos/basic';
import Inline from './demos/inline';
import Sizes from './demos/sizes';

const files = ['src/components/ui/spinner.tsx'];

const spinnerProps: Record<string, PropNode> = {
	size: {
		type: 'number | string',
		default: '2',
		description:
			'The box. A number is ems of the text around it, so the ring still follows the type; a string is any CSS length, which stops it following. A size-* class loses to it.',
	},
	label: {
		type: 'ReactNode',
		default: '"Loading"',
		description:
			'Visually hidden status text. null where the surrounding control already announces its own state, which drops the status role with it.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(); the ink lives here, and a size class where no size is set.',
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
		'a square of 2em, an inline-flex, so it sits on the text’s baseline.',
	],
	['data-slot="spinner-dot"', 'each dot', 'bg-current, with its own animation delay.'],
	['role="status"', 'present when label is set', 'with the label as visually hidden text.'],
	['aria-hidden', 'on the ring', 'the dots are decoration; the label is the announcement.'],
	['--duration', '1s', 'one turn of the ring; the delay is the turn divided by the eight dots.'],
	[
		'container-type: size',
		'on the box',
		'the dots are placed in cqmin, so the ring scales with its own size.',
	],
];

const usageImport = "import { Spinner } from '@/components/ui/spinner';";
const usageExample = `<p className="flex items-center gap-2 text-sm">
	<Spinner size={1} label={null} />
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
				<DocInstall name="spinner" files={files} reaches={['src/lib/utils.ts']} />
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
				<DocUsage snippets={[usageImport, usageExample]} />
			</DocSection>

			<DocSection
				title="sizes, and ink"
				note={
					<>
						<Mono>size</Mono> chooses the box — a number is ems, so the default{' '}
						<Mono>2</Mono> sits the ring at twice the text around it — and{' '}
						<Mono>bg-current</Mono> takes the colour from that text.
					</>
				}
			>
				<DocPreview path="src/pages/Spinner/demos/sizes.tsx">
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in the text’s own size"
				note="the point of sizing in em: a control loads at the size its text sets. A call site that stands the ring in for a glyph pins it back with size={1}."
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
						pinned back with <Mono>size={'{1}'}</Mono> so <Mono>loading</Mono> and a
						leading icon cannot disagree about size. <Mono>Table</Mono> pins it the same
						way, and
						<Mono>Toast</Mono> to a rem.
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
