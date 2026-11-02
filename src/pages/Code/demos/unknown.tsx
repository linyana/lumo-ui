import { Card } from '@/components/ui/card';
import { Code, Copy } from '@/components/ui/code';

const source = '++[>+<-]\n// a grammar we do not ship';

export default function Unknown() {
	return (
		<Card.Root className="w-full gap-0 overflow-hidden py-0">
			<Card.Header className="min-h-9 border-b border-border/50 px-3 py-1">
				<Card.Title className="font-mono text-xs font-medium">hello.bf</Card.Title>
				<Card.Action>
					<Copy value={source} />
				</Card.Action>
			</Card.Header>
			<Card.Content className="min-w-0 px-0">
				<Code code={source} language="brainfuck" />
			</Card.Content>
		</Card.Root>
	);
}
