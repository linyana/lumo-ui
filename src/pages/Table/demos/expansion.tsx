import { Fragment, useState } from 'react';
import { Table } from '@/components/ui/table';

const runs = [
	{
		id: 'run-1043',
		outcome: 'failed',
		duration: '3m 08s',
		log: 'connection pool exhausted after 400 attempts: the previous deployment still holds every lease, so the suite gave up waiting rather than reporting a flake.',
	},
	{
		id: 'run-1042',
		outcome: 'passed',
		duration: '42s',
		log: 'all 318 checks passed, including the two that were skipped on the previous run.',
	},
	{ id: 'run-1041', outcome: 'passed', duration: '39s', log: 'all 316 checks passed.' },
];

export default function Expansion() {
	const [open, setOpen] = useState<string | null>('run-1043');

	return (
		<div className="min-w-0 w-full">
			<Table.Root variant="outlined" aria-label="deploys, one of them open">
				<Table.Header>
					<Table.Row>
						<Table.Head>run</Table.Head>
						<Table.Head>outcome</Table.Head>
						<Table.Head align="end">duration</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{runs.map((run) => (
						<Fragment key={run.id}>
							<Table.Row>
								<Table.Cell>
									<Table.Branch
										open={open === run.id}
										onOpenChange={() =>
											setOpen(open === run.id ? null : run.id)
										}
										label={run.id}
									>
										{run.id}
									</Table.Branch>
								</Table.Cell>
								<Table.Cell className="text-muted-foreground">
									{run.outcome}
								</Table.Cell>
								<Table.Cell align="end">{run.duration}</Table.Cell>
							</Table.Row>
							{open === run.id && (
								<Table.ExpandedRow columns={3}>
									<p className="max-w-prose text-sm text-muted-foreground">
										{run.log}
									</p>
								</Table.ExpandedRow>
							)}
						</Fragment>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
