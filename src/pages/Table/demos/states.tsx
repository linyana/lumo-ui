import { Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table } from '@/components/ui/table';

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
					aria-busy
					aria-label="runs, arriving"
				>
					<Table.Header>
						<Table.Row>
							<Table.Head>job</Table.Head>
							<Table.Head align="end">duration</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{[0, 1, 2].map((row) => (
							<Table.Row key={row}>
								<Table.Cell>
									<Skeleton className="h-4 w-24" />
								</Table.Cell>
								<Table.Cell align="end">
									<div className="flex justify-end">
										<Skeleton className="h-4 w-12" />
									</div>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	);
}
