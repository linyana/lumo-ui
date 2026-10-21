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

/** The panel stays open while a body is replaced, so the box eases from one size to the other. */
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
						<Mono>Transition</Mono> — that keeps the height honest when a body changes
						size while the panel is open, and <Mono>transition={'{false}'}</Mono> opts
						out of it.
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
						changes size once the panel is open eases to the new size instead of
						jumping. replacing the body needs nothing else: the box measures what is
						inside it and glides from its own height to the new one.{' '}
						<Mono>transition={'{false}'}</Mono> opts out of the wrapper altogether.
					</>
				}
			>
				<SwappedBody />
			</DocSection>
		</DocPage>
	);
}
