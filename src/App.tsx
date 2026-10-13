import { useEffect, useState } from 'react';
import { Button } from '@/components/lumo/Button';
import { Dialog } from '@/components/lumo/Dialog';
import { Spinner } from '@/components/lumo/Spinner';

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export default function App() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
	}, [dark]);

	return (
		<main className="mx-auto max-w-3xl space-y-10 p-10">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">lumo-ui</h1>
					<p className="text-sm text-muted-foreground">
						reference components, Base UI behaviour + token-driven styling
					</p>
				</div>
				<Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
					{dark ? 'light' : 'dark'}
				</Button>
			</header>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">variants</h2>
				<div className="flex flex-wrap gap-3">
					{variants.map((variant) => (
						<Button key={variant} variant={variant}>
							{variant}
						</Button>
					))}
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">sizes</h2>
				<div className="flex flex-wrap items-center gap-3">
					{sizes.map((size) => (
						<Button key={size} size={size}>
							{size}
						</Button>
					))}
					<Button size="icon" aria-label="icon button">
						+
					</Button>
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">states</h2>
				<div className="flex flex-wrap gap-3">
					<Button disabled>disabled</Button>
					<Button variant="outline" disabled>
						disabled outline
					</Button>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Button loading>loading</Button>
					<Button variant="outline" icon={<span aria-hidden="true">+</span>} loading>
						add
					</Button>
					<Button size="icon" loading aria-label="loading icon button">
						+
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					tab through the buttons: focus is a 1px ring defined once in
					<code className="mx-1 rounded bg-muted px-1 py-0.5">lumo-tokens.css</code>
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">spinners</h2>
				<div className="flex flex-wrap items-center gap-4 text-foreground">
					<Spinner />
					<Spinner className="size-6" />
					<Spinner className="size-10 text-muted-foreground" label="saving" />
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">dialog</h2>
				<Dialog.Root>
					<Dialog.Trigger render={<Button variant="outline">open dialog</Button>} />
					<Dialog.Portal>
						<Dialog.Backdrop />
						<Dialog.Viewport>
							<Dialog.Popup>
								<Dialog.Title>lumo-ui dialog</Dialog.Title>
								<Dialog.Description>
									behaviour from Base UI, appearance from tokens. nothing about
									this look is hardcoded.
								</Dialog.Description>
								<div className="mt-6 flex justify-end gap-2">
									<Dialog.Close
										render={<Button variant="ghost">cancel</Button>}
									/>
									<Dialog.Close render={<Button>confirm</Button>} />
								</div>
							</Dialog.Popup>
						</Dialog.Viewport>
					</Dialog.Portal>
				</Dialog.Root>
			</section>
		</main>
	);
}
