import { CalendarClock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Basic() {
	return (
		<Card.Root className="w-full max-w-sm">
			<Card.Header>
				<Card.Title>scheduled reports</Card.Title>
				<Card.Description>weekly snapshots, no manual exports.</Card.Description>
				<Card.Action>
					<Button variant="ghost" size="sm">
						edit
					</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content className="text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<CalendarClock className="size-4 shrink-0" />
					<span>every monday at 09:00 · 4 recipients</span>
				</div>
			</Card.Content>
			<Card.Footer className="justify-end">
				<Button variant="outline" size="sm">
					preview
				</Button>
				<Button size="sm" icon={<Plus />}>
					new report
				</Button>
			</Card.Footer>
		</Card.Root>
	);
}
