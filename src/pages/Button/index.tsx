import { Code } from '@/components/lumo/ui/Code';
import { Steps } from '@/components/lumo/ui/Steps';
import { cn } from '@/lib/cn';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import buttonSource from '@/components/lumo/ui/Button.tsx?raw';
import spinnerSource from '@/components/lumo/ui/Spinner.tsx?raw';
import cnSource from '@/lib/cn.ts?raw';
import tokensSource from '@/styles/lumo-tokens.css?raw';
import {
	Command,
	DocPage,
	DocPreview,
	DocSection,
	DocTabs,
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
import Interaction from './demos/interaction';
import interactionSource from './demos/interaction.tsx?raw';
import Sizes from './demos/sizes';
import sizesSource from './demos/sizes.tsx?raw';
import States from './demos/states';
import statesSource from './demos/states.tsx?raw';
import Variants from './demos/variants';
import variantsSource from './demos/variants.tsx?raw';

/**
 * One file of the manual: the path it goes to in the header, its source below it, and a button
 * that takes the whole thing. A file taller than the cap scrolls inside its own box with the path
 * held at the top, so a 200-line token file does not push the next step off the page.
 */
function Source({ path, code }: { path: string; code: string }) {
	return (
		<Code
			code={code}
			language={path.split('.').pop()}
			fileName={path}
			showLineNumbers
			wrap
			className={cn(
				'max-h-100 overflow-y-auto',
				'[&_[data-slot=code-header]]:sticky [&_[data-slot=code-header]]:top-0',
				'[&_[data-slot=code-header]]:z-1 [&_[data-slot=code-header]]:bg-background',
			)}
		/>
	);
}

const installTabs = [
	{
		value: 'cli',
		label: 'Command',
		content: (
			<div className="space-y-3">
				<Command>bunx shadcn@latest add linyana/lumo-ui/button</Command>
				<p className="text-muted-foreground">
					copies <Mono>Button.tsx</Mono>, and the <Mono>cn()</Mono> and{' '}
					<Mono>Spinner</Mono> it imports. <Mono>@base-ui/react</Mono> and{' '}
					<Mono>tailwind-variants</Mono> come from the package manager.
				</p>
			</div>
		),
	},
	{
		value: 'manual',
		label: 'Manual',
		content: (
			<div className="space-y-4">
				<p className="text-muted-foreground">
					the command does four things, in order. by hand they are:
				</p>
				<Steps.Root orientation="vertical">
					<Steps.Item>
						<Steps.Title>install the packages</Steps.Title>
						<Steps.Description>
							Base UI carries the behaviour, tailwind-variants the variant API, and{' '}
							<Mono>cn()</Mono> its two halves.
						</Steps.Description>
						<Command>
							bun add @base-ui/react clsx tailwind-merge tailwind-variants
						</Command>
					</Steps.Item>
					<Steps.Item>
						<Steps.Title>copy the component</Steps.Title>
						<Steps.Description>
							its imports already read <Mono>@/…</Mono>, so it goes where they point.
						</Steps.Description>
						<Source path="src/components/lumo/ui/Button.tsx" code={buttonSource} />
					</Steps.Item>
					<Steps.Item>
						<Steps.Title>copy what it reaches for</Steps.Title>
						<Steps.Description>
							the spinner that takes its loading slot, and the class merge behind{' '}
							<Mono>className</Mono>.
						</Steps.Description>
						<div className="space-y-3">
							<Source
								path="src/components/lumo/ui/Spinner.tsx"
								code={spinnerSource}
							/>
							<Source path="src/lib/cn.ts" code={cnSource} />
						</div>
					</Steps.Item>
					<Steps.Item>
						<Steps.Title>bring the tokens</Steps.Title>
						<Steps.Description>
							skip this one if the project already defines <Mono>--primary</Mono>,{' '}
							<Mono>--radius</Mono> and the rest — the button then wears its colours.
						</Steps.Description>
						<Source path="src/styles/lumo-tokens.css" code={tokensSource} />
					</Steps.Item>
				</Steps.Root>
			</div>
		),
	},
];

const buttonProps: Record<string, PropNode> = {
	variant: {
		type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
		default: '"default"',
		description:
			'The appearance tier: default for the action a view is about, secondary and outline one step down, ghost where a button should not compete, destructive for the irreversible, link for a control that reads as text.',
	},
	size: {
		type: '"sm" | "md" | "lg" | "icon"',
		default: '"md"',
		description:
			'Height, and the type size that comes with it: 32 / 36 / 40. icon is the 36 square, for a button whose whole content is one glyph.',
	},
	icon: {
		type: 'ReactNode',
		default: 'null',
		description:
			'A leading graphic, passed as a rendered element. A spinner takes this slot while loading.',
	},
	loading: {
		type: 'boolean',
		default: 'false',
		description:
			'The label gives way to a spinner, the button disables, aria-busy goes on. The box keeps its size, and the focus stays on it.',
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
			'Merged last through cn(), so the Base UI state-callback form is not accepted here.',
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
	['data-slot', 'button 路 button-content', 'the button, and the grid holding the label.'],
	['data-variant', 'the current variant', 'mirrored onto the DOM for plain CSS.'],
	['data-size', 'the current size', 'same.'],
	['data-loading', 'present while loading', 'empty-valued, as Base UI writes its own flags.'],
	['aria-busy', 'true while loading', 'announced instead of a second label.'],
	[
		'data-disabled',
		'present while disabled',
		'written by Base UI, including the disable that loading adds.',
	],
	[':focus-visible', '—', 'the ring, declared once in lumo-tokens.css.'],
];

export function ButtonPage() {
	return (
		<DocPage
			title="Button"
			description="the reference component: tailwind-variants API, tokens, data-* hooks"
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
				<DocTabs tabs={installTabs} />
			</DocSection>

			<DocSection
				title="variants"
				note={
					<>
						one tier per intent, so the loudest thing on a page is the action it is
						about. the variant is also written onto the element as{' '}
						<Mono>data-variant</Mono>.
					</>
				}
			>
				<DocPreview name="variants.tsx" source={variantsSource}>
					<Variants />
				</DocPreview>
			</DocSection>

			<DocSection
				title="sizes"
				note={
					<>
						heights are 32 / 36 / 40 and the type grows with them — <Mono>text-sm</Mono>{' '}
						twice, then <Mono>text-base</Mono>. icons follow the type, so a size is
						never chosen twice.
					</>
				}
			>
				<DocPreview name="sizes.tsx" source={sizesSource}>
					<Sizes />
				</DocPreview>
			</DocSection>

			<DocSection
				title="states"
				note={
					<>
						<Mono>disabled</Mono> dims to half and stops taking the pointer.{' '}
						<Mono>loading</Mono> is not the same thing: the label stays in the grid at
						zero opacity so the width cannot jump, the spinner takes the icon slot when
						there is one, and the button stays focusable — a keyboard position has to
						survive. it is also the one state that is not dimmed, because the spinner
						already says so.
					</>
				}
			>
				<DocPreview name="states.tsx" source={statesSource}>
					<States />
				</DocPreview>
			</DocSection>

			<DocSection
				title="icon"
				note={
					<>
						one family, one source: a glyph arrives as itself — lucide by name — and the
						slot sizes it with <Mono>[&amp;_svg]:size-[1em]</Mono>, so grid and stroke
						weight cannot drift and a call site never passes a size. loading is the one
						thing lucide cannot draw: <Mono>Spinner</Mono>, with{' '}
						<Mono>label={'{null}'}</Mono> inside a control that announces its own state.
						a button with no text keeps its name in <Mono>aria-label</Mono>.
					</>
				}
			>
				<DocPreview name="icon.tsx" source={iconSource}>
					<Icon />
				</DocPreview>
			</DocSection>

			<DocSection
				title="interaction"
				note={
					<>
						hover and press are one state layer tinted by <Mono>currentColor</Mono>, so
						every variant reacts in the right direction without a hover rule of its own
						— filled tiers carry a darker pair, because a light tint on dark fill reads
						weaker than it does on a surface. press also nudges the button down{' '}
						<Mono>--press-offset</Mono>, except where <Mono>aria-haspopup</Mono> says it
						opens a popup: an overlay is positioned against that trigger&apos;s rect.
						the ring comes from <Mono>:focus-visible</Mono> in the token layer, and
						reduced motion zeroes every duration and the nudge without any component
						opting out.
					</>
				}
			>
				<DocPreview name="interaction.tsx" source={interactionSource}>
					<Interaction />
				</DocPreview>
			</DocSection>

			<DocSection
				title="in a composition"
				note={
					<>
						Base UI parts take a component through <Mono>render</Mono>, so this is how a
						dialog gets its trigger — no <Mono>asChild</Mono>, no wrapper props to
						learn. the trigger keeps <Mono>aria-haspopup</Mono>, which is exactly what
						stops it from moving while its overlay is measured.
					</>
				}
			>
				<DocPreview name="composition.tsx" source={compositionSource}>
					<Composition />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note={
					<>
						every prop is optional and the ones that matter say so on hover. everything
						not listed here is Base UI&apos;s, passed through untouched.
					</>
				}
			>
				<PropTable props={buttonProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note={
					<>
						the DOM is the API for styling: every variant and size is mirrored onto the
						element, so a consumer can target it from plain CSS without knowing a class
						name.
					</>
				}
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
