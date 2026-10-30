import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Table } from '@/components/ui/table';

const runs = [
	{ id: 'run-1041', job: 'unit' },
	{ id: 'run-1042', job: 'e2e' },
	{ id: 'run-1043', job: 'docs' },
];

export default function Selection() {
	const [chosen, setChosen] = useState<string[]>(['run-1042']);
	const all = chosen.length === runs.length;
	const some = chosen.length > 0 && !all;

	function toggle(id: string) {
		setChosen((was) => (was.includes(id) ? was.filter((one) => one !== id) : [...was, id]));
	}

	return (
		<div className="w-full max-w-md">
			<Table.Root aria-label="runs to keep">
				<Table.Header>
					<Table.Row>
						<Table.Head className="w-10">
							<Checkbox.Root
								aria-label="every run"
								checked={all}
								indeterminate={some}
								onCheckedChange={(next) =>
									setChosen(next ? runs.map((run) => run.id) : [])
								}
							>
								<Checkbox.Indicator />
							</Checkbox.Root>
						</Table.Head>
						<Table.Head>run</Table.Head>
						<Table.Head align="end">artifacts</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{runs.map((run) => (
						<Table.Row
							key={run.id}
							data-selected={chosen.includes(run.id) || undefined}
						>
							<Table.Cell>
								<Checkbox.Root
									aria-label={run.id}
									checked={chosen.includes(run.id)}
									onCheckedChange={() => toggle(run.id)}
								>
									<Checkbox.Indicator />
								</Checkbox.Root>
							</Table.Cell>
							<Table.Head scope="row">{run.job}</Table.Head>
							<Table.Cell align="end">
								{chosen.includes(run.id) ? 'kept 90 days' : 'kept 7 days'}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
