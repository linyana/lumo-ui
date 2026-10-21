import {
	Command,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	DocTabs,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Direction from './demos/direction';
import directionSource from './demos/direction.tsx?raw';
import Fade from './demos/fade';
import fadeSource from './demos/fade.tsx?raw';
import Size from './demos/size';
import sizeSource from './demos/size.tsx?raw';

const REPO = 'https://github.com/linyana/lumo-ui/blob/main';

const files = [
	'src/components/lumo/ui/Transition.tsx',
	'src/lib/cn.ts',
	'src/styles/lumo-tokens.css',
];

const installTabs = [
	{
		value: 'cli',
		label: 'Command',
		content: (
			<div className="space-y-3">
				<Command>bunx shadcn@latest add linyana/lumo-ui/transition</Command>
				<p className="text-muted-foreground">
					copies <Mono>Transition.tsx</Mono>, and the <Mono>cn()</Mono> it imports.{' '}
					<Mono>motion</Mono> comes from the package manager.
				</p>
			</div>
		),
	},
	{
		value: 'manual',
		label: 'Manual',
		content: (
			<div className="space-y-3">
				<Command>bun add motion</Command>
				<ul className="space-y-1.5">
					{files.map((path) => (
						<li key={path}>
							<a
								href={`${REPO}/${path}`}
								target="_blank"
								rel="noreferrer noopener"
								className="font-mono underline underline-offset-4 hover:text-foreground"
							>
								{path}
							</a>
						</li>
					))}
				</ul>
			</div>
		),
	},
];

const transitionProps: Record<string, PropNode> = {
	value: {
		type: 'string | number',
		description:
			'The identity of the content. Changing it swaps it, which is what the fade, the travel and the blur hang off. Leave it out and the box only follows the size of one block.',
	},
	fade: {
		type: 'boolean',
		default: 'false',
		description:
			'Cross-fades the swap: the old one leaves in 150ms while the new one arrives over 300ms. Off by default — the height is the whole show.',
	},
	direction: {
		type: '"left" | "right" | "up" | "down"',
		description:
			'The side the new content arrives from; the old one leaves the other way. Needs `fade`, because a slide alone is two texts passing each other.',
	},
	blur: {
		type: 'boolean',
		default: 'false',
		description:
			'Softens what leaves, so it reads as motion and not as a second text underneath. Needs `fade`. Leave it off when the new content shares lines with the old: a shared line is drawn twice during the swap, and softening one of the two copies reads as a focus pull on it.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(), onto the box that holds the child.',
	},
	children: {
		type: 'ReactNode',
		required: true,
		description:
			'One block of content. Keep its root a block element — the box measures it to ease the height.',
	},
};

export function TransitionPage() {
	return (
		<DocPage
			title="Transition"
			description="a box that follows its content's size, and swaps it if asked"
		>
			<DocPreview name="size.tsx" source={sizeSource}>
				<Size />
			</DocPreview>

			<DocSection
				title="size is the whole default"
				note={
					<>
						the box measures what is inside it and eases to that height, continuously —
						so a body that changes size once it is open, or a swap between two blocks of
						different length, does not move the page beneath it. the height is measured,
						not guessed, and a reflow inside the content re-targets the glide instead of
						snapping. nothing fades unless you say so.
					</>
				}
			>
				<DocTabs tabs={installTabs} />
			</DocSection>

			<DocSection
				title="fade"
				note={
					<>
						both children are on stage at once, but not for the same length of time: the
						old one is gone in <Mono>--duration-swap-out</Mono> (150ms, on{' '}
						<Mono>--ease-leave</Mono>, already moving) while the new one arrives over{' '}
						<Mono>--duration-swap-in</Mono> (300ms, on <Mono>--ease-arrive</Mono>, slow
						to start and resolving after the old has gone). two fades at one speed read
						as two texts; this reads as one movement. <Mono>blur</Mono> adds{' '}
						<Mono>--blur-swap</Mono> to the side that leaves, which is the difference
						between a ghost and a motion trail.
					</>
				}
			>
				<DocPreview name="fade.tsx" source={fadeSource}>
					<Fade />
				</DocPreview>
			</DocSection>

			<DocSection
				title="direction"
				note={
					<>
						a swap that only fades reads as a blink. naming the side the content comes
						from turns it into movement, and a tab panel already knows it:{' '}
						<Mono>Tabs.Root</Mono> keeps the activation direction and{' '}
						<Mono>Tabs.Panel</Mono> hands it to the swap, so a panel with{' '}
						<Mono>fade</Mono> travels with the tabs on its own.
					</>
				}
			>
				<DocPreview name="direction.tsx" source={directionSource}>
					<Direction />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what drives it"
				note={
					<>
						every number is a token: <Mono>--duration-swap-out</Mono>/{' '}
						<Mono>--ease-leave</Mono> for what leaves, <Mono>--duration-swap-in</Mono>/
						<Mono>--ease-arrive</Mono> for what arrives, the box settling on{' '}
						<Mono>--ease-overlay</Mono> inside <Mono>--duration-swap-out</Mono>,
						<Mono>--shift-content</Mono> for the distance and <Mono>--blur-swap</Mono>{' '}
						for the softening. the tokens file zeroes all of it under{' '}
						<Mono>prefers-reduced-motion</Mono>, and the component re-reads them on
						every swap, so a change reaches the next one.
					</>
				}
			>
				<DocTable
					head={['part', 'carries', 'note']}
					mono={[0]}
					rows={[
						[
							'data-slot="transition"',
							'the box',
							'the element whose height glides; it holds both children for the length of a fade.',
						],
						[
							'data-slot="transition-content"',
							'each child',
							'keyed by value, so React mounts the new one and unmounts the old one.',
						],
						[
							'data-value',
							'the child\u2019s own value',
							'what the box looks up when it has to know which child is the current one.',
						],
						[
							'data-swapping',
							'the box, while it moves',
							'present only while the box glides, which is when it has to clip.',
						],
					]}
				/>
			</DocSection>

			<DocSection title="props">
				<PropTable props={transitionProps} />
			</DocSection>
		</DocPage>
	);
}
