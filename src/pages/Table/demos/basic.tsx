import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';

const runs = [
	{ job: 'unit', branch: 'main', duration: '42s', note: 'passed', variant: 'success' as const },
	{
		job: 'e2e',
		branch: 'main',
		duration: '3m 08s',
		note: 'failed',
		variant: 'destructive' as const,
	},
	{
		job: 'docs',
		branch: 'next',
		duration: '24s',
		note: 'skipped',
		variant: 'secondary' as const,
	},
	{ job: 'deploy', branch: 'main', duration: '1m 12s', note: 'queued', variant: 'info' as const },
];

export default function Basic() {
	return (
		<div className="w-full max-w-md">
			<Table.Root aria-label="recent runs">
				<Table.Header>
					<Table.Row>
						<Table.Head>job</Table.Head>
						<Table.Head>branch</Table.Head>
						<Table.Head align="end">duration</Table.Head>
						<Table.Head>outcome</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{runs.map((run) => (
						<Table.Row key={run.job}>
							<Table.Cell className="font-medium">{run.job}</Table.Cell>
							<Table.Cell className="text-muted-foreground">{run.branch}</Table.Cell>
							<Table.Cell align="end">{run.duration}</Table.Cell>
							<Table.Cell>
								<Badge variant={run.variant}>{run.note}</Badge>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
