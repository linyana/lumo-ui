import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/lumo/ui/Button';
import { Transition, type TransitionDirection } from '@/components/lumo/ui/Transition';

const steps = [
	{
		value: 'step-1',
		title: 'name the key',
		body: 'anything stable: a tab value, an id, a page number.',
	},
	{
		value: 'step-2',
		title: 'point it at a side',
		body: 'the new content arrives from `direction` and the old one leaves the other way, so a swap reads as movement rather than as a blink.',
	},
	{
		value: 'step-3',
		title: 'let the height follow',
		body: 'the box measures what is inside it and eases to the new height. done.',
	},
];

export default function Direction() {
	const [index, setIndex] = useState(0);
	const [direction, setDirection] = useState<TransitionDirection>('right');
	const step = steps[index]!;

	const go = (next: number) => {
		setDirection(next > index ? 'right' : 'left');
		setIndex(next);
	};

	return (
		<div className="w-full max-w-sm space-y-3">
			<div className="flex items-center justify-between">
				<Button
					size="icon"
					variant="secondary"
					className="size-8"
					aria-label="previous step"
					disabled={index === 0}
					onClick={() => go(index - 1)}
				>
					<ChevronLeft />
				</Button>
				<Button
					size="icon"
					variant="secondary"
					className="size-8"
					aria-label="next step"
					disabled={index === steps.length - 1}
					onClick={() => go(index + 1)}
				>
					<ChevronRight />
				</Button>
			</div>
			<div className="rounded-md border p-3">
				<Transition value={step.value} direction={direction} fade>
					<div className="space-y-1">
						<div className="text-sm font-medium">{step.title}</div>
						<p className="text-sm text-muted-foreground">{step.body}</p>
					</div>
				</Transition>
			</div>
		</div>
	);
}
