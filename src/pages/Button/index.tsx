import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import buttonSource from '@/components/lumo/ui/Button.tsx?raw';
import spinnerSource from '@/components/lumo/ui/Spinner.tsx?raw';
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
import Composition from './demos/composition';
import compositionSource from './demos/composition.tsx?raw';
import Icon from './demos/icon';
import iconSource from './demos/icon.tsx?raw';
import Sizes from './demos/sizes';
import sizesSource from './demos/sizes.tsx?raw';
import States from './demos/states';
import statesSource from './demos/states.tsx?raw';
import Variants from './demos/variants';
import variantsSource from './demos/variants.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Button.tsx', code: buttonSource }];

const buttonProps: Record<string, PropNode> = {
	variant: {
		type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
		default: '"default"',
		description:
			'The appearance tier: default for the action a view is about, secondary and outline a step down, ghost where nothing should compete, destructive for the irreversible, link for text that acts.',
	},
	size: {
		type: '"sm" | "md" | "lg" | "icon"',
		default: '"md"',
		description: '32 / 36 / 40 tall, with the type to match. icon is the 36 square.',
	},
	icon: {
		type: 'ReactNode',
		default: 'null',
		description:
			'A leading graphic, as a rendered element. The spinner takes this slot while loading.',
	},
	loading: {
		type: 'boolean',
		default: 'false',
		description: 'The label gives way to a spinner, the button disables, aria-busy goes on.',
	},
	loadingIcon: {
		type: 'ReactNode',
		default: '<Spinner label={null} />',
		description: 'Replaces the built-in spinner.',
	},
	disabled: {
		type: 'boolean',
		default: 'false',
		description: 'Base UI’s disabled state. loading disables as well.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(), so the Base UI state-callback form is not accepted.',
	},
	children: {
		type: 'ReactNode',
		description: 'The label.',
	},
	'...props': {
		type: 'Base UI ButtonProps',
		description: 'Everything else goes to Base UI: onClick, render, type.',
	},
};

const hookRows = [
	['data-slot', 'button · button-content', 'the button, and the grid holding the label.'],
	['data-variant', 'the current variant', 'mirrored onto the DOM for plain CSS.'],
	['data-size', 'the current size', 'same.'],
	['data-loading', 'present while loading', 'empty-valued, as Base UI writes its own flags.'],
	['aria-busy', 'true while loading', 'announced instead of a second label.'],
	['data-disabled', 'present while disabled', 'written by Base UI, loading included.'],
	[':focus-visible', '—', 'the ring, declared once in lumo-tokens.css.'],
];

const usageImport = "import { Button } from '@/components/lumo/ui/Button';";
const usageExample = `<Button variant="outline" icon={<Plus />}>
	add
</Button>`;

export function ButtonPage() {
	return (
		<DocPage
			title="button"
			description="a control that starts an action: Base UI inside, tokens outside"
		>
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one component, one file, no barrel: the import carries the path. there is no{' '}
						<Mono>Button.Root</Mono> — a button has no parts, so it is the function.
						without the theme yet, take <Mono>lumo-tokens.css</Mono> as well.
					</>
				}
			>
				<DocInstall
					name="button"
					packages={['@base-ui/react', 'tailwind-variants']}
					files={files}
					reaches={[
						{ path: 'src/components/lumo/ui/Spinner.tsx', code: spinnerSource },
						{ path: 'src/lib/cn.ts', code: cnSource },
					]}
				/>
			</DocSection>

			<DocSection title="usage" note="one import, one element. everything else is Base UI's.">
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="variants"
				note="one tier per intent, so the loudest thing on a page is the action it is about."
			>
				<DocPreview name="variants.tsx" source={variantsSource}>
					<Variants />
				</DocPreview>
			</DocSection>

			<DocSection
				title="sizes"
				note="32 / 36 / 40, the type growing with them. icons follow the type, so a size is never chosen twice."
			>
				<DocPreview name="sizes.tsx" source={sizesSource}>
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="icon"
				note={
					<>
						a glyph arrives as a rendered element — lucide by name — and the slot sizes
						it in <Mono>em</Mono>. an icon-only button keeps its name in{' '}
						<Mono>aria-label</Mono>.
					</>
				}
			>
				<DocPreview name="icon.tsx" source={iconSource}>
					<Icon />
				</DocPreview>
			</DocSection>

			<DocSection
				title="states"
				note={
					<>
						<Mono>disabled</Mono> dims to half and stops taking the pointer.{' '}
						<Mono>loading</Mono> keeps the label at zero opacity so the width cannot
						jump, swaps in the spinner, and stays focusable.
					</>
				}
			>
				<DocPreview name="states.tsx" source={statesSource}>
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in a composition"
				note={
					<>
						Base UI parts take a component through <Mono>render</Mono> — no{' '}
						<Mono>asChild</Mono>, no wrapper props.
					</>
				}
			>
				<DocPreview name="composition.tsx" source={compositionSource}>
					<Composition />
				</DocPreview>
			</DocSection>

			<DocSection title="api reference" note="every prop is optional; the rest is Base UI's.">
				<PropTable props={buttonProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the DOM is the API for styling: variant and size are mirrored onto the element."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
