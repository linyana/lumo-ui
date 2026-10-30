import { Accordion } from '@/components/ui/accordion';

const faq = [
	{
		value: 'motion',
		question: 'does it animate',
		answer: 'the height of every fold is one spring, the same one Transition uses everywhere else.',
	},
	{
		value: 'less',
		question: 'what if I asked for less motion',
		answer: 'the spring becomes linear and one millisecond long, so the fold is simply there.',
	},
	{
		value: 'keys',
		question: 'can I reach it by keyboard',
		answer: 'every row is a button; tab walks them, enter and space open them.',
	},
];

/** `multiple` lets several answers stand open at once — a reference page rather than a set of choices. */
export default function Multiple() {
	return (
		<Accordion.Root multiple defaultValue={['motion', 'keys']} className="w-full max-w-md">
			{faq.map((entry) => (
				<Accordion.Item key={entry.value} value={entry.value}>
					<Accordion.Header>
						<Accordion.Trigger>
							{entry.question}
							<Accordion.Icon />
						</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>
						<p className="px-3 pb-3 text-sm text-muted-foreground">{entry.answer}</p>
					</Accordion.Panel>
				</Accordion.Item>
			))}
		</Accordion.Root>
	);
}
