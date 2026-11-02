import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export default function Basic() {
	const [page, setPage] = useState(3);

	return (
		<Pagination.Root
			page={page}
			total={240}
			pageSize={20}
			onPageChange={setPage}
			className="min-w-0 w-full max-w-xl justify-between"
		>
			<Pagination.Range />
			<span className="flex items-center gap-1">
				<Pagination.Prev />
				<Pagination.Pages />
				<Pagination.Next />
			</span>
		</Pagination.Root>
	);
}
