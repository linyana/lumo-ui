import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { Check, ChevronRight, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/lumo/Button';
import { Collapsible } from '@/components/lumo/Collapsible';
import { Dialog } from '@/components/lumo/Dialog';
import { Menu } from '@/components/lumo/Menu';
import { Popover } from '@/components/lumo/Popover';
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

const panelHandle = Popover.createHandle<ReactNode>();
const panels: { label: string; content: ReactNode }[] = [
	{
		label: 'notifications',
		content: (
			<>
				<Popover.Title>notifications</Popover.Title>
				<Popover.Description>you are all caught up. good job!</Popover.Description>
			</>
		),
	},
	{
		label: 'activity',
		content: (
			<>
				<Popover.Title>activity</Popover.Title>
				<Popover.Description>nothing interesting happened recently.</Popover.Description>
			</>
		),
	},
	{
		label: 'account',
		content: (
			<>
				<Popover.Title>rika li</Popover.Title>
				<Popover.Description>pro plan</Popover.Description>
				<div className="flex flex-col gap-2 pt-2">
					<a href="#" className="w-fit underline underline-offset-2 hover:no-underline">
						account settings
					</a>
					<a href="#" className="w-fit underline underline-offset-2 hover:no-underline">
						log out
					</a>
				</div>
			</>
		),
	},
];

/** The docs' own example, kept verbatim as the reference the lumo menu is measured against. */
const docsMenus = {
	library: {
		heading: 'Library',
		groups: [
			['Add to library', 'Add to favorites'],
			['Create playlist', 'Create station'],
		],
	},
	playback: {
		heading: 'Playback',
		groups: [
			['Play now', 'Add to queue'],
			['Play next', 'Play last', 'Sleep timer'],
		],
	},
	share: {
		heading: 'Share',
		groups: [
			['Copy link', 'Copy embed code'],
			['Share to contacts', 'Share to social'],
		],
	},
} as const;

type DocsMenuKey = keyof typeof docsMenus;

const docsMenuKeys = Object.keys(docsMenus) as DocsMenuKey[];

const docsMenu = Menu.createHandle<DocsMenuKey>();

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
					<Button size="icon" aria-label="add">
						<Plus />
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
					<Button variant="outline" icon={<Plus />} loading>
						add
					</Button>
					<Button size="icon" loading aria-label="loading icon button">
						<Plus />
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
					also nudges the button down 1px, except where <code>aria-haspopup</code> says it
					opens a popup — an overlay is positioned against that trigger's rect; tab
					through to see the ring.
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
					<Button icon={<Plus />}>add</Button>
					<Button variant="outline" icon={<Pencil />}>
						edit
					</Button>
					<Button variant="outline" icon={<Trash2 />}>
						delete
					</Button>
					<Button variant="outline" icon={<Check />}>
						saved
					</Button>
					<Button size="icon" variant="ghost" aria-label="close">
						<X />
					</Button>
					<Button size="icon" variant="ghost" aria-label="search" icon={<Search />} />
				</div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center text-sm">
						<ChevronRight className="size-[1em]" />
					</span>
					<span className="inline-flex items-center text-lg">
						<ChevronRight className="size-[1em]" />
					</span>
					<span className="inline-flex items-center text-2xl">
						<ChevronRight className="size-[1em]" />
					</span>
					<span className="inline-flex items-center text-2xl text-muted-foreground">
						<Spinner label={null} />
					</span>
				</div>
				<p className="text-xs text-muted-foreground">
					one family, one source: a glyph arrives as itself — lucide by name, sized by the
					slot (<code className="rounded bg-muted px-1 py-0.5">[&_svg]:size-[1em]</code>),
					so nothing can drift in grid or stroke weight; outside a slot, size it like the
					carets above. loading is the one thing lucide cannot draw:{' '}
					<code className="rounded bg-muted px-1 py-0.5">Spinner</code>, with{' '}
					<code className="rounded bg-muted px-1 py-0.5">label={'{null}'}</code> inside a
					control that announces its own state.
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
				<h2 className="text-sm font-medium text-muted-foreground">popover</h2>
				<Popover.Root>
					<Popover.Trigger render={<Button variant="outline">open popover</Button>} />
					<Popover.Portal>
						<Popover.Positioner side="bottom" align="start">
							<Popover.Popup>
								<Popover.Arrow />
								<Popover.Title>deploy to production?</Popover.Title>
								<Popover.Description>
									the site rebuilds in about a minute. the previous build stays
									live until the new one answers.
								</Popover.Description>
								<div className="mt-3 flex justify-end gap-2">
									<Popover.Close
										render={
											<Button variant="ghost" size="sm">
												cancel
											</Button>
										}
									/>
									<Popover.Close render={<Button size="sm">deploy</Button>} />
								</div>
							</Popover.Popup>
						</Popover.Positioner>
					</Popover.Portal>
				</Popover.Root>
				<p className="text-xs text-muted-foreground">
					unlike a dialog the page stays interactive behind it, so a click outside
					dismisses it. the arrow reads the side Base UI chose and hangs off that edge,
					carrying the popup's own border and fill.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">
					popover — one popup, three detached triggers
				</h2>
				<div className="flex flex-wrap gap-2">
					{panels.map(({ label, content }) => (
						<Popover.Trigger
							key={label}
							handle={panelHandle}
							payload={content}
							render={
								<Button variant="outline" size="sm">
									{label}
								</Button>
							}
						/>
					))}
				</div>
				<Popover.Root handle={panelHandle}>
					{({ payload }) => (
						<Popover.Portal>
							<Popover.Positioner sideOffset={8}>
								<Popover.Popup>
									<Popover.Arrow />
									<Popover.Viewport>{payload}</Popover.Viewport>
								</Popover.Popup>
							</Popover.Positioner>
						</Popover.Portal>
					)}
				</Popover.Root>
				<p className="text-xs text-muted-foreground">
					no trigger owns the popup — one handle does, and each trigger hands it its own
					payload. the popup itself never unmounts, so moving between triggers slides the
					old panel out the way the new one came in.
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

			<section className="space-y-3">
				<h2 className="text-sm font-medium text-muted-foreground">
					menu — the same content, styled the way base ui's docs do it
				</h2>
				<div className="flex flex-wrap gap-2">
					{docsMenuKeys.map((key) => (
						<Menu.Trigger key={key} handle={docsMenu} payload={key}>
							{docsMenus[key].heading}
						</Menu.Trigger>
					))}
				</div>
				<Menu.Root handle={docsMenu} modal={false}>
					{({ payload }) => (
						<Menu.Portal>
							<Menu.Positioner sideOffset={8} align="start">
								<Menu.Popup>
									<Menu.Viewport>
										{payload &&
											docsMenus[payload].groups.map((group, groupIndex) => (
												<Fragment key={group[0]}>
													<Menu.Group>
														{groupIndex === 0 && (
															<Menu.GroupLabel>
																{docsMenus[payload].heading}
															</Menu.GroupLabel>
														)}
														{group.map((item) => (
															<Menu.Item key={item}>{item}</Menu.Item>
														))}
													</Menu.Group>
													{groupIndex <
														docsMenus[payload].groups.length - 1 && (
														<Menu.Separator />
													)}
												</Fragment>
											))}
									</Menu.Viewport>
								</Menu.Popup>
							</Menu.Positioner>
						</Menu.Portal>
					)}
				</Menu.Root>
				<p className="text-xs text-muted-foreground">
					the docs' own styling, straight from base ui's site: no radius, a hard shadow, a
					solid block behind the highlighted row. kept here as the reference — the lumo
					menu should switch triggers with the same rhythm, whatever it ends up looking
					like.
				</p>
			</section>
		</main>
	);
}
