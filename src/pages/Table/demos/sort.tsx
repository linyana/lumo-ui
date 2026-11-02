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
	// One column at a time. `null` is the unsorted table, which the third press asks for.
	const [sorted, setSorted] = useState<{ by: Column; order: TableSort } | null>({
		by: 'commits',
		order: 'descending',
	});

	// The header hands over the state the press leads to: a direction, or `undefined` to stop.
	function sort(by: Column, next: TableSort | undefined) {
		setSorted(next === undefined ? null : { by, order: next });
	}

	const rows =
		sorted === null
			? members
			: [...members].sort((a, b) => {
					const step =
						sorted.by === 'name' ? a.name.localeCompare(b.name) : a.commits - b.commits;
					return sorted.order === 'ascending' ? step : -step;
				});

	const sortOf = (column: Column) => (sorted?.by === column ? sorted.order : ('none' as const));

	return (
		<div className="w-full max-w-md">
			<Table.Root aria-label="members">
				<Table.Header>
					<Table.Row>
						<Table.Head sort={sortOf('name')} onSort={(next) => sort('name', next)}>
							member
						</Table.Head>
						<Table.Head
							align="end"
							sort={sortOf('commits')}
							onSort={(next) => sort('commits', next)}
						>
							commits
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{rows.map((member) => (
						<Table.Row key={member.name}>
							<Table.Cell sort={sortOf('name')}>{member.name}</Table.Cell>
							<Table.Cell align="end" sort={sortOf('commits')}>
								{member.commits}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
