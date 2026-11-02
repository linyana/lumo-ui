import { useState } from 'react';
import { Table, type TableFilterProps } from '@/components/ui/table';

const runs = [
	{ id: 'run-1041', job: 'unit', status: 'passed', owner: 'ada' },
	{ id: 'run-1042', job: 'e2e', status: 'failed', owner: 'grace' },
	{ id: 'run-1043', job: 'docs', status: 'skipped', owner: 'edsger' },
	{ id: 'run-1044', job: 'lint', status: 'passed', owner: 'grace' },
	{ id: 'run-1045', job: 'unit', status: 'failed', owner: 'barbara' },
];

const options = (values: string[]) => values.map((value) => ({ value, label: value }));

const statuses = options(['passed', 'failed', 'skipped']);
const owners = options(['ada', 'barbara', 'edsger', 'grace']);

export default function Filter() {
	const [status, setStatus] = useState<string[] | null>(['failed']);
	const [owner, setOwner] = useState<string[] | null>(null);
	// An unset column is `null`, so the clause composes without asking whether it is empty.
	const [sorted, setSorted] = useState<'ascending' | 'descending' | 'none'>('none');

	const rows = runs
		.filter((run) => status === null || status.includes(run.status))
		.filter((run) => owner === null || owner.includes(run.owner))
		.sort((a, b) =>
			sorted === 'ascending'
				? a.id.localeCompare(b.id)
				: sorted === 'descending'
					? b.id.localeCompare(a.id)
					: 0,
		);

	// Both filters are handed in as data: the panel, the draft, the empty state and the two
	// buttons are the table's, and the caller keeps the answer.
	const statusFilter: TableFilterProps = {
		options: statuses,
		value: status,
		searchable: true,
		onChange: setStatus,
	};
	const ownerFilter: TableFilterProps = {
		options: owners,
		value: owner,
		multiple: false,
		onChange: setOwner,
	};

	return (
		<div className="w-full">
			<Table.Root variant="outlined" layout="fixed" aria-label="recent runs">
				<colgroup>
					<col className="w-32" />
					<col className="w-24" />
					<col className="w-28" />
					<col className="w-28" />
				</colgroup>
				<Table.Header>
					<Table.Row>
						<Table.Head sort={sorted} onSort={(next) => setSorted(next ?? 'none')}>
							run
						</Table.Head>
						<Table.Head>job</Table.Head>
						<Table.Head filter={statusFilter}>status</Table.Head>
						<Table.Head filter={ownerFilter}>owner</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{rows.map((run) => (
						<Table.Row key={run.id}>
							<Table.Head scope="row">{run.id}</Table.Head>
							<Table.Cell>{run.job}</Table.Cell>
							<Table.Cell>{run.status}</Table.Cell>
							<Table.Cell>{run.owner}</Table.Cell>
						</Table.Row>
					))}
					{rows.length === 0 && (
						<Table.Empty columns={4}>no run matches both filters.</Table.Empty>
					)}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
