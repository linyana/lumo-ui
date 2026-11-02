import { Table } from '@/components/ui/table';

const runs = Array.from({ length: 9 }, (_, index) => ({
	id: `run-${1041 + index}`,
	job: index % 3 === 0 ? 'e2e' : index % 3 === 1 ? 'unit' : 'docs',
	branch: index % 2 === 0 ? 'main' : 'release/connection-pool-backpressure',
	commit: `5f${(0x3a9c + index * 977).toString(16)}`,
	note:
		index % 2 === 0
			? 'waiting for the previous deployment to release the production lock'
			: 'all required checks passed',
	owner: index % 2 === 0 ? 'grace' : 'ada',
	duration: `${12 + index * 7}s`,
}));

export default function Fixed() {
	return (
		<div className="min-w-0 w-full">
			<p className="mb-3 text-sm text-muted-foreground">
				Scroll sideways: the run and the duration stay where they are, and their edge
				shadows only appear once something has passed under them.
			</p>
			<Table.Root
				variant="outlined"
				layout="fixed"
				scroll={{ x: 1200, y: 232 }}
				aria-label="recent runs, pinned columns"
			>
				<Table.Header sticky>
					<Table.Row>
						<Table.Head fixed="start" className="w-32">
							run
						</Table.Head>
						<Table.Head className="w-32">job</Table.Head>
						<Table.Head className="w-64" ellipsis>
							branch
						</Table.Head>
						<Table.Head className="w-40">commit</Table.Head>
						<Table.Head className="w-72" ellipsis>
							note
						</Table.Head>
						<Table.Head className="w-32">owner</Table.Head>
						<Table.Head fixed="end" align="end" className="w-28">
							duration
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{runs.map((run) => (
						<Table.Row key={run.id}>
							<Table.Head scope="row" fixed="start">
								{run.id}
							</Table.Head>
							<Table.Cell>{run.job}</Table.Cell>
							<Table.Cell className="text-muted-foreground" ellipsis>
								{run.branch}
							</Table.Cell>
							<Table.Cell className="text-xs">{run.commit}</Table.Cell>
							<Table.Cell ellipsis>{run.note}</Table.Cell>
							<Table.Cell>{run.owner}</Table.Cell>
							<Table.Cell align="end" fixed="end">
								{run.duration}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
