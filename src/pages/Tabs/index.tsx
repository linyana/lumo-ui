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
 * One panel, not one per tab: the panel stays open and its contents are swapped, so the height
 * follows the content. `fade` is all it takes — the root has already told the swap which way the
 * tabs moved.
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
			<Tabs.Panel value={value} transition={{ fade: true }} className="text-muted-foreground">
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
				title="one panel, swapped content"
				note={
					<>
						panels of their own already cross-fade, since Base UI keeps the one that is
						leaving mounted for the length of its transition. every panel also wraps its
						contents in <Mono>Transition</Mono>, so the height follows what is inside
						instead of the panel re-measuring itself. when the content is what changes —
						one panel, whose body comes from somewhere else — give it{' '}
						<Mono>transition={'{{ fade: true }}'}</Mono> and it swaps, travelling in the
						direction the tabs moved. <Mono>transition={'{false}'}</Mono> leaves the
						contents alone.
					</>
				}
			>
				<SwappedPanel />
			</DocSection>
		</DocPage>
	);
}
