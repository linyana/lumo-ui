import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Transition } from '@/components/ui/transition';

const notes = [
	{
		value: 'idle',
		label: 'idle',
		headline: 'waiting',
		detail: 'nothing is running.',
	},
	{
		value: 'running',
		label: 'running',
		headline: 'indexing 1,248 files',
		detail: 'three workers, no failures so far.',
	},
	{
		value: 'done',
		label: 'done',
		headline: 'indexed',
		detail: 'done in 4s.',
	},
];

export default function Width() {
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
				{/* `w-fit`: nothing else sizes this box, so the content does — in both directions. */}
				<Transition className="w-fit">
					<div className="space-y-0.5">
						<div className="text-sm font-medium">{note.headline}</div>
						<p className="text-sm text-muted-foreground">{note.detail}</p>
					</div>
				</Transition>
			</div>
			<p className="text-sm text-muted-foreground">
				the box is sized by its content here, so the width glides with the height.
			</p>
		</div>
	);
}
