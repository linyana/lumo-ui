import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible } from '@/components/ui/collapsible';

const bodies = {
	short: { label: 'one key', lines: ['alien-bean-pasta'] },
	long: {
		label: 'all of them',
		lines: [
			'alien-bean-pasta',
			'wild-irish-burrito',
			'horse-battery-staple',
			'quiet-ceramic-lamp',
		],
	},
};

/** The panel stays open while the body is replaced, so the box eases from one size to the other. */
export default function Swapped() {
	const [mode, setMode] = useState<keyof typeof bodies>('short');
	const body = bodies[mode];

	return (
		<div className="w-full max-w-sm space-y-2">
			<div className="flex gap-1">
				{(Object.keys(bodies) as (keyof typeof bodies)[]).map((key) => (
					<Button
						key={key}
						size="sm"
						variant={key === mode ? 'secondary' : 'ghost'}
						onClick={() => setMode(key)}
					>
						{bodies[key].label}
					</Button>
				))}
			</div>
			<Collapsible.Root defaultOpen className="rounded-lg border">
				<Collapsible.Trigger>
					recovery keys
					<Collapsible.Icon />
				</Collapsible.Trigger>
				<Collapsible.Panel>
					<div className="flex flex-col gap-1 px-3 pt-3 pb-3 font-mono text-sm text-muted-foreground">
						{body.lines.map((line) => (
							<div key={line}>{line}</div>
						))}
					</div>
				</Collapsible.Panel>
			</Collapsible.Root>
		</div>
	);
}
