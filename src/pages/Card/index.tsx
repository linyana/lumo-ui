import { CalendarClock, Plus } from 'lucide-react';
import { Button } from '@/components/lumo/Button';
import { Card } from '@/components/lumo/Card';
import { DocPage, DocSection } from '@/pages/DocPage';

export function CardPage() {
	return (
		<DocPage
			title="card"
			description="one surface, one subject, with its own header and footer"
		>
			<DocSection
				title="anatomy"
				note={
					<>
						parts, not props: a header holds the title, the description and an action
						that moves itself to the opposite column, so nothing has to be positioned by
						hand.
					</>
				}
			>
				<Card.Root className="max-w-sm">
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
			</DocSection>

			<DocSection
				title="small"
				note={
					<>
						<code>size</code> is set once on the root and read back by every part, so a
						dense list of cards only changes at the top.
					</>
				}
			>
				<div className="flex flex-wrap gap-4">
					<Card.Root size="sm" className="w-64">
						<Card.Header>
							<Card.Title>drafts</Card.Title>
							<Card.Description>unsent replies</Card.Description>
						</Card.Header>
						<Card.Content className="text-2xl font-semibold">12</Card.Content>
					</Card.Root>
					<Card.Root size="sm" className="w-64">
						<Card.Header>
							<Card.Title>queued</Card.Title>
							<Card.Description>waiting on the queue</Card.Description>
						</Card.Header>
						<Card.Content className="text-2xl font-semibold">3</Card.Content>
					</Card.Root>
				</div>
			</DocSection>

			<DocSection
				title="contents are yours"
				note={
					<>
						the card draws no divider and no padding of its own between parts — a footer
						that needs one adds <code>border-t pt-6</code>, and a table or an image goes
						edge to edge by cancelling the horizontal padding.
					</>
				}
			>
				<Card.Root className="max-w-sm py-0">
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
			</DocSection>
		</DocPage>
	);
}
