import { ArrowRight, CodeXml, Layers, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Command } from '@/pages/DocPage';
import { GitHub } from '@/pages/icons';
import { Gallery } from './gallery';
import { installCommand, Onboarding } from './onboarding';
import { Showcase } from './showcase';

const foundations = [
	{
		Icon: MousePointer2,
		title: 'Behavior, already considered.',
		description:
			'Base UI handles keyboard navigation, focus management, and accessibility. Compose the parts without rebuilding the behavior.',
	},
	{
		Icon: Layers,
		title: 'Your theme, throughout.',
		description:
			'Tailwind v4 and shared CSS variables keep colors, surfaces, and interaction states consistent. Light and dark come together.',
	},
	{
		Icon: CodeXml,
		title: 'Source in your project.',
		description:
			'Install through the shadcn registry. Components land in your own aliases, ready to read, compose, and change.',
	},
];

export default function Home() {
	return (
		<div data-slot="home" className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
			<section
				aria-labelledby="home-title"
				className="grid items-center gap-10 py-12 sm:py-16 xl:grid-cols-2 xl:gap-12 xl:py-20"
			>
				<div className="min-w-0">
					<div className="mb-6 flex items-center gap-3">
						<img src="/logo.svg" alt="" className="size-9" />
						<span className="text-lg font-semibold tracking-tight">Lumo UI</span>
					</div>
					<h1
						id="home-title"
						className="max-w-lg text-4xl leading-tight font-semibold tracking-tight sm:text-5xl xl:text-6xl"
					>
						Good parts.
						<br />
						Your interface.
					</h1>
					<p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
						Composable React components built on Base UI and Tailwind v4.
						Thoughtful defaults, editable source, and a theme that stays yours.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button size="lg" nativeButton={false} render={<Link to="/installation" />}>
							<span className="inline-flex items-center gap-2">
								Get started
								<ArrowRight aria-hidden="true" />
							</span>
						</Button>
						<Button
							size="lg"
							variant="outline"
							icon={<GitHub aria-hidden="true" />}
							nativeButton={false}
							render={
								<a href="https://github.com/linyana/lumo-ui" target="_blank" rel="noreferrer" />
							}
						>
							GitHub
						</Button>
					</div>
				</div>
				<Onboarding />
			</section>

			<section aria-labelledby="home-components" className="border-t py-10 sm:py-14">
				<div className="mb-7 flex flex-wrap items-end justify-between gap-4">
					<div className="max-w-lg space-y-2">
						<h2 id="home-components" className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Not pictures. Components.
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Type, toggle, and try them out. These are the same components you install.
						</p>
					</div>
					<Link to="/overview" className="inline-flex items-center gap-2 text-sm hover:underline">
						Browse components
						<ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</div>
				<Gallery />
			</section>

			<section aria-labelledby="home-code" className="border-t py-10 sm:py-14">
				<div className="mb-7 max-w-lg space-y-2">
					<h2 id="home-code" className="text-2xl font-semibold tracking-tight sm:text-3xl">
						What you write is what you see.
					</h2>
					<p className="text-sm leading-relaxed text-muted-foreground">
						A few parts, composed your way. Each example renders the source beside it.
					</p>
				</div>
				<Showcase />
			</section>

			<section
				aria-label="Design foundations"
				className="grid gap-8 border-t py-10 sm:py-14 xl:grid-cols-3"
			>
				{foundations.map(({ Icon, title, description }) => (
					<div key={title} className="min-w-0 space-y-3">
						<Icon aria-hidden="true" className="size-5 text-muted-foreground" />
						<h2 className="text-base font-semibold">{title}</h2>
						<p className="max-w-md text-sm leading-relaxed text-muted-foreground">
							{description}
						</p>
					</div>
				))}
			</section>

			<section aria-labelledby="home-install" className="space-y-5 border-t py-10 sm:py-14">
				<h2 id="home-install" className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Start with one component.
				</h2>
				<p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
					Set up the registry namespace and theme once. Then add only what you need.
				</p>
				<div className="max-w-2xl">
					<Command bordered>{installCommand}</Command>
				</div>
				<Link to="/installation" className="inline-flex items-center gap-2 text-sm hover:underline">
					Set up your project
					<ArrowRight aria-hidden="true" className="size-4" />
				</Link>
			</section>
		</div>
	);
}
