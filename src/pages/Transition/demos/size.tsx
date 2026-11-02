import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Transition } from '@/components/ui/transition';

const notes = [
	{
		value: 'draft',
		label: 'draft',
		body: 'nothing is published yet. the editor writes here, and the page stays private until you say otherwise — no feeds, no search, no sitemap entry, and no way for anyone outside the workspace to reach it.',
	},
	{
		value: 'review',
		label: 'review',
		body: 'two readers at a time can comment, and their names stay hidden until the note is accepted.',
	},
	{ value: 'published', label: 'published', body: 'live.' },
];

export default function Size() {
	const [value, setValue] = useState(notes[0]!.value);
	const note = notes.find((item) => item.value === value) ?? notes[0]!;

	return (
		<div className="w-full max-w-sm space-y-3">
			<Tabs.Root
				variant="pill"
				value={value}
				onValueChange={(next) => setValue(next)}
				className="gap-3"
			>
				<Tabs.List aria-label="Publication status">
					{notes.map((item) => (
						<Tabs.Tab key={item.value} value={item.value}>
							{item.label}
						</Tabs.Tab>
					))}
					<Tabs.Indicator />
				</Tabs.List>
				<Tabs.Panel value={value} transition={false} className="rounded-md border p-3">
					<Transition>
						<p className="text-sm text-muted-foreground">{note.body}</p>
					</Transition>
				</Tabs.Panel>
			</Tabs.Root>
			<p className="text-sm text-muted-foreground">
				the content is replaced in place and the box is what moves: it measures what is
				inside it and eases to the new height.
			</p>
		</div>
	);
}
