import { Card } from '@/components/ui/card';
import { Code, Copy } from '@/components/ui/code';

const source = ['export const name =', "\t'lumo-ui';"].join('\n');

export default function Surfaces() {
	return (
		<div className="w-full space-y-3">
			<Card.Root className="gap-0 overflow-hidden bg-muted py-0 shadow-none">
				<Card.Header className="min-h-9 border-b border-border/50 px-3 py-1">
					<Card.Title className="font-mono text-xs font-medium">filled</Card.Title>
					<Card.Action>
						<Copy value={source} />
					</Card.Action>
				</Card.Header>
				<Card.Content className="min-w-0 px-0">
					<Code code={source} language="ts" />
				</Card.Content>
			</Card.Root>
			<Card.Root className="gap-0 overflow-hidden py-0">
				<Card.Header className="min-h-9 border-b border-border/50 px-3 py-1">
					<Card.Title className="font-mono text-xs font-medium">card</Card.Title>
					<Card.Action>
						<Copy value={source} />
					</Card.Action>
				</Card.Header>
				<Card.Content className="min-w-0 px-0">
					<Code code={source} language="ts" />
				</Card.Content>
			</Card.Root>
			<Code code={source} language="ts" />
		</div>
	);
}
