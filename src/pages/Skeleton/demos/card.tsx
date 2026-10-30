import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** The same card twice: what arrives, and what stands in for it while it does. */
export default function CardPlaceholder() {
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
					<Skeleton className="h-7 w-16 rounded-md" />
				</Card.Footer>
			</Card.Root>
			<Card.Root className="flex-1">
				<Card.Header>
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-3 w-2/3" />
				</Card.Header>
				<Card.Content>
					<Skeleton className="h-3 w-1/3" />
				</Card.Content>
				<Card.Footer className="justify-end">
					<Skeleton className="h-7 w-16 rounded-md" />
				</Card.Footer>
			</Card.Root>
		</div>
	);
}
