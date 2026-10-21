import { useState } from 'react';
import { Button } from '@/components/lumo/ui/Button';
import { Collapsible } from '@/components/lumo/ui/Collapsible';
import { DocPage, DocSection, Mono } from '@/pages/DocPage';

const bodies = {
	short: {
		label: 'one key',
		lines: ['alien-bean-pasta'],
	},
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

/** The panel keeps its value while open, so a body that changes is swapped and not re-rendered. */
function SwappedBody() {
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
				<Collapsible.Panel transition={{ value: mode }}>
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

export function CollapsiblePage() {
	return (
		<DocPage title="collapsible" description="a disclosure region that expands one panel">
			<DocSection
				title="recovery keys"
				note={
					<>
						Base UI animates the panel from its own measured height, so the content
						needs no fixed size. the caret reads{' '}
						<code className="rounded bg-muted px-1 py-0.5">data-panel-open</code> off
						the trigger and turns with it. every panel wraps its contents in a{' '}
						<Mono>Transition</Mono> — with nothing enabled, as here, that only keeps the
						height honest; the fade and the swap are opt-in, below.
					</>
				}
			>
				<Collapsible.Root className="max-w-sm rounded-lg border">
					<Collapsible.Trigger>
						recovery keys
						<Collapsible.Icon />
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<div className="flex flex-col gap-1 px-3 pt-3 pb-3 text-sm text-muted-foreground">
							<div>alien-bean-pasta</div>
							<div>wild-irish-burrito</div>
							<div>horse-battery-staple</div>
						</div>
					</Collapsible.Panel>
				</Collapsible.Root>
			</DocSection>

			<DocSection
				title="a body that changes"
				note={
					<>
						the contents of every panel sit in a <Mono>Transition</Mono>, so a body that
						changes size once the panel is open eases to the new height instead of
						jumping. give it a <Mono>value</Mono> and the body is swapped when that
						value changes — <Mono>fade</Mono> sends the old one out as the new one
						arrives, and <Mono>transition={'{false}'}</Mono> opts out of the wrapper
						altogether. no <Mono>blur</Mono> here on purpose: these bodies share their
						first line, and softening a line that is drawn twice reads as a flicker.
					</>
				}
			>
				<SwappedBody />
			</DocSection>
		</DocPage>
	);
}
