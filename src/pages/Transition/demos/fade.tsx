import { useState } from 'react';
import { Button } from '@/components/lumo/ui/Button';
import { Transition } from '@/components/lumo/ui/Transition';

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

export default function Fade() {
	const [value, setValue] = useState(notes[0]!.value);
	const note = notes.find((item) => item.value === value) ?? notes[0]!;

	return (
		<div className="w-full max-w-sm space-y-3">
			<div className="flex gap-1">
				{notes.map((item) => (
					<Button
						key={item.value}
						size="sm"
						variant={item.value === value ? 'secondary' : 'ghost'}
						onClick={() => setValue(item.value)}
					>
						{item.label}
					</Button>
				))}
			</div>
			<div className="rounded-md border p-3">
				<Transition value={value} fade blur>
					<p className="text-sm text-muted-foreground">{note.body}</p>
				</Transition>
			</div>
			<p className="text-sm text-muted-foreground">
				the old text leaves in 150ms and is softened on the way out, so it never sits behind
				the new one as a second text.
			</p>
		</div>
	);
}
