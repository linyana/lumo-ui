import { Inbox } from 'lucide-react';
import { Table } from '@/components/ui/table';

const runs = [
	{ id: 'run-1041', job: 'unit', duration: '12s' },
	{ id: 'run-1042', job: 'e2e', duration: '94s' },
	{ id: 'run-1043', job: 'docs', duration: '31s' },
];

export default function States() {
	return (
		<div className="grid min-w-0 w-full gap-6 lg:grid-cols-2">
			<div className="min-w-0 w-full">
				<Table.Root variant="outlined" hoverable={false} aria-label="runs, none yet">
					<Table.Header>
						<Table.Row>
							<Table.Head>job</Table.Head>
							<Table.Head align="end">duration</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Empty columns={2} icon={<Inbox />}>
							nothing has run since the last deploy.
						</Table.Empty>
					</Table.Body>
				</Table.Root>
			</div>
			<div className="min-w-0 w-full">
				<Table.Root
					variant="outlined"
					hoverable={false}
					loading
					aria-label="runs, arriving"
				>
					<Table.Header>
						<Table.Row>
							<Table.Head>job</Table.Head>
							<Table.Head align="end">duration</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{runs.map((run) => (
							<Table.Row key={run.id}>
								<Table.Cell>{run.job}</Table.Cell>
								<Table.Cell align="end">{run.duration}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	);
}
