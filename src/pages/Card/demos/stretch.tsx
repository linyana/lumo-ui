import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Stretch() {
	return (
		<div className="flex w-full max-w-xl flex-wrap items-stretch gap-3">
			<Card.Root className="flex-1">
				<Card.Header>
					<Card.Title>api keys</Card.Title>
					<Card.Description>two of them, both read-only.</Card.Description>
				</Card.Header>
				<Card.Content className="text-sm text-muted-foreground">
					rotated 12 days ago
				</Card.Content>
				<Card.Footer className="justify-end">
					<Button variant="outline" size="sm">
						rotate
					</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root className="flex-1">
				<Card.Header>
					<Card.Title>webhooks</Card.Title>
					<Card.Description>
						one endpoint, retried three times before it is dropped.
					</Card.Description>
				</Card.Header>
				<Card.Content className="text-sm text-muted-foreground">
					last delivery: 4 minutes ago, 200 ok
				</Card.Content>
				<Card.Footer className="justify-end">
					<Button variant="outline" size="sm">
						edit
					</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	);
}
