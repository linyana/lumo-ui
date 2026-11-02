import { useState } from 'react';
import { Table, type TableSelection } from '@/components/ui/table';

const runs = [
	{ id: 'run-1041', job: 'unit', artifacts: 12 },
	{ id: 'run-1042', job: 'e2e', artifacts: 48 },
	{ id: 'run-1043', job: 'docs', artifacts: 3 },
	{ id: 'run-1044', job: 'lint', artifacts: 1 },
	{ id: 'run-1045', job: 'unit', artifacts: 12 },
];

export default function Selection() {
	const [chosen, setChosen] = useState<string[]>(['run-1042']);

	// One object, handed to the header and to every box: the keys are the rows in view, the value is
	// what the caller keeps, and the table writes nothing but that list back.
	const selection: TableSelection = {
		keys: runs.map((run) => run.id),
		value: chosen,
		onChange: setChosen,
		menu: true,
	};

	return (
		<div className="w-full max-w-lg">
			<Table.Root aria-label="runs to keep">
				<Table.Header>
					<Table.Row>
						<Table.SelectionHead selection={selection} />
						<Table.Head className="w-full">run</Table.Head>
						<Table.Head align="end">artifacts</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{runs.map((run) => (
						<Table.Row
							key={run.id}
							data-selected={chosen.includes(run.id) || undefined}
						>
							<Table.SelectionCell
								selection={selection}
								value={run.id}
								label={run.id}
							/>
							<Table.Head scope="row">{run.job}</Table.Head>
							<Table.Cell align="end">{run.artifacts}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
