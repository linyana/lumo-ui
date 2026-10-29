import { Card } from '@/components/lumo/ui/Card';

const tiles = [
	{ title: 'usage', note: 'this month', value: '1,284' },
	{ title: 'storage', note: 'of 10 gb', value: '3.6 gb' },
];

export default function Hoverable() {
	return (
		<>
			{tiles.map(({ title, note, value }) => (
				<Card.Root key={title} hoverable className="w-56">
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
