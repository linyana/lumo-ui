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

export default function Size() {
	const [value, setValue] = useState(notes[0]!.value);
	const note = notes.find((item) => item.value === value) ?? notes[0]!;

	return (
		<div className="w-full max-w-sm space-y-3">
			<div className="flex gap-1">
				{notes.map((item) => (
					<Button
						key={item.value}
						size="sm"
						// A filled step rather than a tint: the trigger row has to say which note is open
						// wherever the demo is drawn, and `secondary` only reads on a white page.
						variant={item.value === value ? 'default' : 'ghost'}
						onClick={() => setValue(item.value)}
					>
						{item.label}
					</Button>
				))}
			</div>
			<div className="rounded-md border p-3">
				<Transition>
					<p className="text-sm text-muted-foreground">{note.body}</p>
				</Transition>
			</div>
			<p className="text-sm text-muted-foreground">
				the content is replaced in place and the box is what moves: it measures what is
				inside it and eases to the new height.
			</p>
		</div>
	);
}
