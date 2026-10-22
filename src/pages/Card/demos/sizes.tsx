import { Card } from '@/components/lumo/ui/Card';

const stats = [
	{ title: 'drafts', note: 'unsent replies', value: '12' },
	{ title: 'queued', note: 'waiting on the queue', value: '3' },
];

export default function Sizes() {
	return (
		<>
			{stats.map(({ title, note, value }) => (
				<Card.Root key={title} size="sm" className="w-56">
					<Card.Header>
						<Card.Title>{title}</Card.Title>
						<Card.Description>{note}</Card.Description>
					</Card.Header>
					<Card.Content className="text-2xl font-semibold">{value}</Card.Content>
				</Card.Root>
			))}
		</>
	);
}
