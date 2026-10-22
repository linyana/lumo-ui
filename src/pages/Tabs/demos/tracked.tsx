import { Tabs } from '@/components/lumo/ui/Tabs';

const notes = [
	{ value: 'overview', body: 'nine members, three of them invited this week.' },
	{
		value: 'activity',
		body: 'mira renamed the project, joe deleted two keys, and the nightly job ran late once.',
	},
	{ value: 'settings', body: 'profile and preferences.' },
];

/** Every panel on one track: the one arriving and the one leaving travel together. */
export default function Tracked() {
	return (
		<Tabs.Root defaultValue="overview" className="w-full max-w-sm">
			<Tabs.List>
				{notes.map(({ value }) => (
					<Tabs.Tab key={value} value={value}>
						{value}
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
