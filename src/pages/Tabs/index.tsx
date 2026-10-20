import { Tabs } from '@/components/lumo/ui/Tabs';
import { DocPage, DocSection } from '@/pages/DocPage';

const items = [
	{ value: 'overview', label: 'overview', content: 'workspace stats and activity.' },
	{ value: 'activity', label: 'activity', content: 'whom changed what, and when.' },
	{ value: 'settings', label: 'settings', content: 'profile and preferences.' },
];

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
		</DocPage>
	);
}
