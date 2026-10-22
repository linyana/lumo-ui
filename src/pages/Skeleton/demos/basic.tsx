import { Skeleton } from '@/components/lumo/ui/Skeleton';

export default function Basic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Skeleton className="h-4 w-2/3" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-4/5" />
		</div>
	);
}
