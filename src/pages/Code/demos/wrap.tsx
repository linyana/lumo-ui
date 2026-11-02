import { Card } from '@/components/ui/card';
import { Code, Copy } from '@/components/ui/code';

const source = [
	'const message =',
	"\t'every line here is longer than the block it sits in, which is the whole point of the demo';",
	'export default message;',
].join('\n');

export default function Wrap() {
	return (
		<div className="w-full space-y-3">
			{[false, true].map((wrap) => (
				<Card.Root key={String(wrap)} className="gap-0 overflow-hidden py-0">
					<Card.Header className="min-h-9 border-b border-border/50 px-3 py-1">
						<Card.Title className="font-mono text-xs font-medium">
							{wrap ? 'wrap.ts' : 'scroll.ts'}
						</Card.Title>
						<Card.Action>
							<Copy value={source} />
						</Card.Action>
					</Card.Header>
					<Card.Content className="min-w-0 px-0">
						<Code code={source} language="ts" wrap={wrap} />
					</Card.Content>
				</Card.Root>
			))}
		</div>
	);
}
