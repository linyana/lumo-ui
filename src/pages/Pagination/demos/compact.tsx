import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export default function Compact() {
	const [page, setPage] = useState(9);

	return (
		<div className="space-y-4">
			<Pagination.Root page={page} pageCount={12} onPageChange={setPage} size="sm">
				<Pagination.Prev />
				<Pagination.Range />
				<Pagination.Next />
			</Pagination.Root>
			<Pagination.Root page={page} pageCount={12} onPageChange={setPage}>
				<Pagination.Prev />
				<Pagination.Range />
				<Pagination.Next />
			</Pagination.Root>
			<Pagination.Root page={page} pageCount={12} onPageChange={setPage} size="lg">
				<Pagination.Prev />
				<Pagination.Range />
				<Pagination.Next />
			</Pagination.Root>
		</div>
	);
}
