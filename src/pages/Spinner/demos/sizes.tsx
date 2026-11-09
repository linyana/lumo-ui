import { Spinner } from '@/components/ui/spinner';

export default function Sizes() {
	return (
		<div className="flex flex-wrap items-center gap-6 text-foreground">
			<Spinner />
			<Spinner size={3} />
			<Spinner size="2.5rem" className="text-muted-foreground" label="saving" />
		</div>
	);
}
