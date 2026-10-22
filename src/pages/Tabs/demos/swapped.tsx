import { useState } from 'react';
import { Tabs } from '@/components/lumo/ui/Tabs';

const notes = [
	{ value: 'overview', body: 'nine members, three of them invited this week.' },
	{
		value: 'activity',
		body: 'mira renamed the project, joe deleted two keys, and the nightly job ran late once, twice, three times, and then it stopped.',
	},
	{ value: 'settings', body: 'profile and preferences.' },
];

/** One panel, whose contents are replaced — the box eases to the size of what is inside it now. */
export default function Swapped() {
	const [value, setValue] = useState(notes[0]!.value);
	const note = notes.find((item) => item.value === value) ?? notes[0]!;

	return (
		<Tabs.Root
			value={value}
			onValueChange={(next) => setValue(next)}
			className="w-full max-w-sm"
		>
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
