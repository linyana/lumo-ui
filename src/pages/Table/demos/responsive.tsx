import { Table } from '@/components/ui/table';

const runs = Array.from({ length: 6 }, (_, index) => ({
	id: `run-${1041 + index}`,
	job: index % 3 === 0 ? 'e2e' : index % 3 === 1 ? 'unit' : 'docs',
	owner: index % 2 === 0 ? 'grace' : 'ada',
	commit: `5f${(0x3a9c + index * 977).toString(16)}`,
	duration: `${12 + index * 7}s`,
	branch: index % 2 === 0 ? 'main' : 'next',
}));

/** Each column names the width it needs, and the name goes on its title and on every cell of it. */
export default function Responsive() {
	return (
		<div className="min-w-0 w-full">
			<p className="mb-3 text-sm text-muted-foreground">
				Narrow the window: duration goes first, then owner, then branch. The job stays,
				because every table has to say something.
			</p>
			<Table.Root variant="outlined" aria-label="recent runs, columns by width">
				<Table.Header>
					<Table.Row>
						<Table.Head>job</Table.Head>
						<Table.Head responsive={['sm']} align="end">
							duration
						</Table.Head>
						<Table.Head responsive={['md']}>owner</Table.Head>
						<Table.Head responsive={['lg']}>branch</Table.Head>
						<Table.Head responsive={['xl']}>commit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{runs.map((run) => (
						<Table.Row key={run.id}>
							<Table.Head scope="row">{run.job}</Table.Head>
							<Table.Cell responsive={['sm']} align="end">
								{run.duration}
							</Table.Cell>
							<Table.Cell responsive={['md']}>{run.owner}</Table.Cell>
							<Table.Cell responsive={['lg']} className="text-muted-foreground">
								{run.branch}
							</Table.Cell>
							<Table.Cell responsive={['xl']} className="text-xs">
								{run.commit}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
