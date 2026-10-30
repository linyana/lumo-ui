import { Card } from '@/components/ui/card';

export default function Flush() {
	return (
		<Card.Root className="w-full max-w-sm py-0">
			<Card.Content className="px-0 pt-6">
				<div className="h-24 rounded-t-[inherit] bg-muted" />
			</Card.Content>
			<Card.Content className="text-sm">
				an image sits flush against the card's top corners.
			</Card.Content>
			<Card.Footer className="border-t pt-4 pb-4 text-xs text-muted-foreground">
				footer with a divider
			</Card.Footer>
		</Card.Root>
	);
}
