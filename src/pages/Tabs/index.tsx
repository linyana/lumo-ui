import { useState } from 'react';
import { Tabs } from '@/components/lumo/ui/Tabs';
import { DocPage, DocSection, Mono } from '@/pages/DocPage';

const items = [
	{ value: 'overview', label: 'overview', content: 'workspace stats and activity.' },
	{ value: 'activity', label: 'activity', content: 'whom changed what, and when.' },
	{ value: 'settings', label: 'settings', content: 'profile and preferences.' },
];

const notes = [
	{
		value: 'overview',
		body: 'nine members, three of them invited this week. the busiest hour is eleven, and nothing has failed since the last deploy.',
	},
	{
		value: 'activity',
		body: 'mira renamed the project, joe deleted two keys, and the nightly job ran late once.',
	},
	{ value: 'settings', body: 'profile and preferences.' },
];

/**
 * Every panel on one track: the one arriving and the one leaving travel together, and the box
 * holding them is only ever as tall as the lane on screen.
 */
function TrackedPanels() {
	return (
		<Tabs.Root defaultValue="overview" className="max-w-sm">
			<Tabs.List>
				{items.map(({ value, label }) => (
					<Tabs.Tab key={value} value={value}>
						{label}
					</Tabs.Tab>
				))}
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Panels>
				{notes.map(({ value, body }) => (
					<Tabs.Panel key={value} value={value} className="text-muted-foreground">
						{body}
					</Tabs.Panel>
				))}
			</Tabs.Panels>
		</Tabs.Root>
	);
}

/**
 * One panel, not one per tab: the panel stays open and its contents are replaced, so the box
 * eases to the size of what is now inside it.
 */
function SwappedPanel() {
	const [value, setValue] = useState(notes[0]!.value);
	const note = notes.find((item) => item.value === value) ?? notes[0]!;

	return (
		<Tabs.Root value={value} onValueChange={(next) => setValue(next)} className="max-w-sm">
			<Tabs.List>
				{notes.map(({ value: tab }) => (
					<Tabs.Tab key={tab} value={tab}>
						{tab}
					</Tabs.Tab>
				))}
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Panel value={value} className="text-muted-foreground">
				{note.body}
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export function TabsPage() {
	return (
		<DocPage title="tabs" description="one panel at a time, chosen from a row of tabs">
			<DocSection
				title="three indicators, one measurement"
				note={
					<>
						each variant is the same element wearing a different skin: a pill, a bar on
						the list's edge, or a dot. Base UI measures the active tab and hands the
						result over as{' '}
						<code className="rounded bg-muted px-1 py-0.5">--active-tab-*</code>, so
						nothing here is per-tab.
					</>
				}
			>
				<div className="space-y-6">
					{(['rounded', 'square', 'point'] as const).map((variant) => (
						<Tabs.Root
							key={variant}
							variant={variant}
							defaultValue="overview"
							className="max-w-sm"
						>
							<Tabs.List>
								{items.map(({ value, label }) => (
									<Tabs.Tab key={value} value={value}>
										{label}
									</Tabs.Tab>
								))}
								<Tabs.Indicator />
							</Tabs.List>
							{items.map(({ value, content }) => (
								<Tabs.Panel
									key={value}
									value={value}
									className="text-muted-foreground"
								>
									{content}
								</Tabs.Panel>
							))}
						</Tabs.Root>
					))}
				</div>
			</DocSection>
			<DocSection title="sizes" note="one size on the root reaches every part it wraps.">
				<div className="space-y-4">
					{(['sm', 'md', 'lg'] as const).map((size) => (
						<Tabs.Root
							key={size}
							size={size}
							defaultValue="overview"
							className="max-w-sm"
						>
							<Tabs.List>
								{items.map(({ value, label }) => (
									<Tabs.Tab key={value} value={value}>
										{label}
									</Tabs.Tab>
								))}
								<Tabs.Indicator />
							</Tabs.List>
						</Tabs.Root>
					))}
				</div>
			</DocSection>
			<DocSection
				title="vertical, with a disabled tab"
				note="orientation moves the whole control, and the same indicator follows it."
			>
				<Tabs.Root defaultValue="general" orientation="vertical" className="max-w-sm">
					<Tabs.List>
						<Tabs.Tab value="general">general</Tabs.Tab>
						<Tabs.Tab value="billing" disabled>
							billing
						</Tabs.Tab>
						<Tabs.Tab value="danger">danger zone</Tabs.Tab>
						<Tabs.Indicator />
					</Tabs.List>
					<Tabs.Panel value="general" className="text-muted-foreground">
						workspace name, url and icon.
					</Tabs.Panel>
					<Tabs.Panel value="danger" className="text-muted-foreground">
						deleting a workspace cannot be undone.
					</Tabs.Panel>
				</Tabs.Root>
			</DocSection>

			<DocSection
				title="one track, slid sideways"
				note={
					<>
						wrap the panels in <Mono>Tabs.Panels</Mono> and they stop taking turns: they
						sit side by side on one track, and the track is slid to the selected lane,
						so the panel arriving and the panel leaving travel together. the box holding
						the track is only as tall as the lane on screen and follows it as the track
						moves; the lanes out of sight are blurred and <Mono>inert</Mono>. everything
						inside a panel is clipped to it — nothing can hang out of the edge.
					</>
				}
			>
				<TrackedPanels />
			</DocSection>

			<DocSection
				title="one panel, swapped content"
				note={
					<>
						panels of their own already cross-fade, since Base UI keeps the one that is
						leaving mounted for the length of its transition. every panel also wraps its
						contents in <Mono>Transition</Mono>, so a body that changes eases to the new
						size instead of the panel re-measuring itself. when the content is what
						changes — one panel, whose body comes from somewhere else — nothing else is
						needed: the box follows the new size wherever it lands.{' '}
						<Mono>transition={'{false}'}</Mono> opts of the wrapper, which also drops
						that.
					</>
				}
			>
				<SwappedPanel />
			</DocSection>
		</DocPage>
	);
}
