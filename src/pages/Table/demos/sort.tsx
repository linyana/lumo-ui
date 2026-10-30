import { useState } from 'react';
import { Table, type TableSort } from '@/components/ui/table';

type Column = 'name' | 'commits';

const members = [
	{ name: 'ada', commits: 148 },
	{ name: 'grace', commits: 96 },
	{ name: 'edsger', commits: 121 },
	{ name: 'barbara', commits: 74 },
];

export default function Sort() {
	const [by, setBy] = useState<Column>('commits');
	const [order, setOrder] = useState<TableSort>('descending');

	// Pressing the column already sorted turns it around; pressing another starts it from the
	// beginning, which is the order a reader expects to see a new column in.
	function sort(column: Column) {
		if (column === by) {
			setOrder(order === 'ascending' ? 'descending' : 'ascending');
			return;
		}

		setBy(column);
		setOrder('ascending');
	}

	const rows = [...members].sort((a, b) => {
		const step = by === 'name' ? a.name.localeCompare(b.name) : a.commits - b.commits;
		return order === 'ascending' ? step : -step;
	});

	return (
		<div className="w-full max-w-md">
			<Table.Root aria-label="members">
				<Table.Header>
					<Table.Row>
						<Table.Head
							sort={by === 'name' ? order : 'none'}
							onSort={() => sort('name')}
						>
							member
						</Table.Head>
						<Table.Head
							align="end"
							sort={by === 'commits' ? order : 'none'}
							onSort={() => sort('commits')}
						>
							commits
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{rows.map((member) => (
						<Table.Row key={member.name}>
							<Table.Cell>{member.name}</Table.Cell>
							<Table.Cell align="end">{member.commits}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
