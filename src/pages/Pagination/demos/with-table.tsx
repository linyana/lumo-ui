import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';

const pageSize = 4;
const runs = Array.from({ length: 23 }, (_, index) => ({
	id: `run-${1041 + index}`,
	job: index % 3 === 0 ? 'e2e' : index % 3 === 1 ? 'unit' : 'docs',
	duration: `${12 + index * 7}s`,
}));

export default function WithTable() {
	const [page, setPage] = useState(1);

	const start = (page - 1) * pageSize;
	const visible = runs.slice(start, start + pageSize);

	return (
		<Table.Root variant="outlined" aria-label="recent runs, one page at a time">
			<Table.Header>
				<Table.Row>
					<Table.Head>run</Table.Head>
					<Table.Head>job</Table.Head>
					<Table.Head align="end">duration</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{visible.map((run) => (
					<Table.Row key={run.id}>
						<Table.Head scope="row">{run.id}</Table.Head>
						<Table.Cell className="text-muted-foreground">{run.job}</Table.Cell>
						<Table.Cell align="end">{run.duration}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colSpan={3} className="py-2">
						<Pagination.Root
							page={page}
							total={runs.length}
							pageSize={pageSize}
							onPageChange={setPage}
							size="sm"
							className="justify-between"
						>
							<Pagination.Range />
							<span className="flex items-center gap-1">
								<Pagination.Prev />
								<Pagination.Pages />
								<Pagination.Next />
							</span>
						</Pagination.Root>
					</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	);
}
