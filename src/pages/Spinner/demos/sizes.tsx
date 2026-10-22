import { Spinner } from '@/components/lumo/ui/Spinner';

export default function Sizes() {
	return (
		<div className="flex flex-wrap items-center gap-6 text-foreground">
			<Spinner />
			<Spinner className="size-6" />
			<Spinner className="size-10 text-muted-foreground" label="saving" />
		</div>
	);
}
