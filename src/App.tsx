import { useEffect, useState } from 'react';
import { Button } from '@/components/lumo/Button';
import { Collapsible } from '@/components/lumo/Collapsible';
import { Dialog } from '@/components/lumo/Dialog';
import { Icon } from '@/components/lumo/Icon';
import { Spinner } from '@/components/lumo/Spinner';
import { Tooltip } from '@/components/lumo/Tooltip';

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const hintHandle = Tooltip.createHandle<string>();

const hints = [
	{ label: 'play', hint: 'Listen to audio preview' },
	{ label: 'timer', hint: 'Set a timer' },
	{ label: 'delete', hint: 'Delete: this action cannot be undone' },
];

export default function App() {
	const [dark, setDark] = useState(false);
	const [saving, setSaving] = useState(false);

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
				<h2 className="text-sm font-medium text-muted-foreground">interaction</h2>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						loading={saving}
						onClick={() => {
							setSaving(true);
							setTimeout(() => setSaving(false), 1200);
						}}
					>
						save draft
					</Button>
					<Button variant="outline">hover me</Button>
					<Button variant="ghost">press me</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					hover and press are one state layer tinted by <code>currentColor</code>, so
					every variant reacts in the right direction without its own hover rule. press
					scales to <code>var(--press-scale)</code> on an 80ms curve; tab through to see
					the ring.
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
				<h2 className="text-sm font-medium text-muted-foreground">tooltip</h2>
				<Tooltip.Provider delay={300}>
					<div className="flex flex-wrap items-center gap-3">
						<Tooltip.Root>
							<Tooltip.Trigger render={<Button variant="outline">hover me</Button>} />
							<Tooltip.Portal>
								<Tooltip.Positioner>
									<Tooltip.Popup>
										behaviour from Base UI, appearance from tokens
										<Tooltip.Arrow />
									</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger render={<Button variant="ghost">bottom</Button>} />
							<Tooltip.Portal>
								<Tooltip.Positioner side="bottom" align="start">
									<Tooltip.Popup>
										with an arrow, aligned to the start edge
										<Tooltip.Arrow />
									</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						</Tooltip.Root>
					</div>
				</Tooltip.Provider>
				<p className="text-xs text-muted-foreground">
					one <code className="rounded bg-muted px-1 py-0.5">Provider</code> shares the
					delay, so moving between triggers shows the next hint instantly. hovering only
					ever previews; the same hint is announced on keyboard focus.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">
					tooltip — one popup, three triggers
				</h2>
				<Tooltip.Provider delay={300}>
					<div className="flex">
						{hints.map(({ label, hint }) => (
							<Tooltip.Trigger
								key={label}
								handle={hintHandle}
								payload={hint}
								render={
									<Button variant="outline" size="sm">
										{label}
									</Button>
								}
							/>
						))}
					</div>
					<Tooltip.Root handle={hintHandle}>
						{({ payload }) => (
							<Tooltip.Portal>
								<Tooltip.Positioner>
									<Tooltip.Popup>
										<Tooltip.Arrow />
										<Tooltip.Viewport>{payload}</Tooltip.Viewport>
									</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						)}
					</Tooltip.Root>
				</Tooltip.Provider>
				<p className="text-xs text-muted-foreground">
					hover straight across the row: the popup glides to the next trigger, its content
					slides out the way it came, and the width animates instead of jumping. that is{' '}
					<code className="rounded bg-muted px-1 py-0.5">Viewport</code>.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">icon</h2>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						icon={
							<Icon>
								<path d="M7.25 2.5h1.5v4.75h4.75v1.5H8.75v4.75h-1.5V8.75H2.5v-1.5h4.75z" />
							</Icon>
						}
					>
						add
					</Button>
					<Button
						variant="outline"
						icon={
							<Icon>
								<path d="M6.5 11.6 3.4 8.5l-1.1 1.1 4.2 4.2 8-8-1.1-1.1z" />
							</Icon>
						}
					>
						saved
					</Button>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-sm">
						<Icon>
							<path d="M6 12V4l4.5 4z" />
						</Icon>
					</span>
					<span className="text-lg">
						<Icon>
							<path d="M6 12V4l4.5 4z" />
						</Icon>
					</span>
					<span className="text-2xl">
						<Icon>
							<path d="M6 12V4l4.5 4z" />
						</Icon>
					</span>
				</div>
				<p className="text-xs text-muted-foreground">
					lumo ships no icon set:{' '}
					<code className="rounded bg-muted px-1 py-0.5">Icon</code> is only a shell, so a
					glyph arrives as a path or as any element. it measures itself in{' '}
					<code className="rounded bg-muted px-1 py-0.5">em</code>, the same three paths
					above one text size apart.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">collapsible</h2>
				<Collapsible.Root className="max-w-sm rounded-lg border">
					<Collapsible.Trigger>
						recovery keys
						<Collapsible.Icon />
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<div className="flex flex-col gap-1 px-3 pb-3 text-sm text-muted-foreground">
							<div>alien-bean-pasta</div>
							<div>wild-irish-burrito</div>
							<div>horse-battery-staple</div>
						</div>
					</Collapsible.Panel>
				</Collapsible.Root>
				<p className="text-xs text-muted-foreground">
					Base UI animates the panel from its own measured height, so the content needs no
					fixed size. the caret reads <code>data-panel-open</code> off the trigger and
					turns with it.
				</p>
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
