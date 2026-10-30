import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';

const invoices = [
	{ id: 'INV-1041', date: 'Sep 28, 2026', amount: '$240.00' },
	{ id: 'INV-1040', date: 'Aug 28, 2026', amount: '$218.50' },
	{ id: 'INV-1039', date: 'Jul 28, 2026', amount: '$192.00' },
];

export default function Embedded() {
	return (
		<Card.Root className="min-w-0 w-full max-w-xl pb-0">
			<Card.Header>
				<Card.Title>recent invoices</Card.Title>
				<Card.Description>Monthly charges for the production workspace.</Card.Description>
				<Card.Action>
					<Button variant="ghost" size="sm">
						view all
					</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content className="min-w-0 px-0">
				<Table.Root
					className="rounded-b-xl [--table-surface:var(--card)] [&>table>tbody>tr:last-child>*]:border-b-0"
					aria-label="recent invoices"
				>
					<Table.Header>
						<Table.Row>
							<Table.Head>invoice</Table.Head>
							<Table.Head>issued</Table.Head>
							<Table.Head align="end">amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{invoices.map((invoice) => (
							<Table.Row key={invoice.id}>
								<Table.Head scope="row">{invoice.id}</Table.Head>
								<Table.Cell className="text-muted-foreground">{invoice.date}</Table.Cell>
								<Table.Cell align="end">{invoice.amount}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	);
}
