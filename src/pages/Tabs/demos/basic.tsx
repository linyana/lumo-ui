import { Tabs } from '@/components/lumo/ui/Tabs';

const items = [
	{ value: 'overview', label: 'overview', content: 'workspace stats and activity.' },
	{ value: 'activity', label: 'activity', content: 'who changed what, and when.' },
	{ value: 'settings', label: 'settings', content: 'profile and preferences.' },
];

export default function Basic() {
	return (
		<Tabs.Root defaultValue="overview" className="w-full max-w-sm">
			<Tabs.List>
				{items.map(({ value, label }) => (
					<Tabs.Tab key={value} value={value}>
						{label}
					</Tabs.Tab>
				))}
				<Tabs.Indicator />
			</Tabs.List>
			{items.map(({ value, content }) => (
				<Tabs.Panel key={value} value={value} className="text-muted-foreground">
					{content}
				</Tabs.Panel>
			))}
		</Tabs.Root>
	);
}
