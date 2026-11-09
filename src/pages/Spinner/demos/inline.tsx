import { Spinner } from '@/components/ui/spinner';

/** A number is ems of the text around it, so the ring follows the type it sits in. */
export default function Inline() {
	return (
		<div className="space-y-3 text-sm">
			<div className="flex items-center gap-2">
				<Spinner size={1} label={null} />
				<span className="text-muted-foreground">size={1}, next to text-sm</span>
			</div>
			<div className="flex items-center gap-3 text-2xl">
				<Spinner size={1} label={null} />
				<span className="text-muted-foreground text-sm">
					the same size={1}, next to text-2xl
				</span>
			</div>
		</div>
	);
}
