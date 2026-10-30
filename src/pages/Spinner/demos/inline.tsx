import { Spinner } from '@/components/ui/spinner';

/** The same spinner in the type size of the control it sits in: it is one em across. */
export default function Inline() {
	return (
		<div className="space-y-3 text-sm">
			<div className="flex items-center gap-2">
				<Spinner label={null} />
				<span className="text-muted-foreground">next to text-sm, it is text-sm wide</span>
			</div>
			<div className="flex items-center gap-3 text-2xl">
				<Spinner label={null} />
				<span className="text-muted-foreground text-sm">next to text-2xl, it grows</span>
			</div>
		</div>
	);
}
