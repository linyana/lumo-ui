import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/lumo/ui/Skeleton';

const rows = ['alien-bean-pasta.md', 'wild-irish-burrito.md', 'horse-battery-staple.md'];

/** The placeholder is the answer's own shape, so nothing under it moves when the answer lands. */
export default function Swap() {
	const [arrived, setArrived] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setArrived(true), 1400);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="w-full max-w-sm space-y-3">
			<div className="rounded-lg border p-3">
				{arrived ? (
					<ul className="divide-y">
						{rows.map((row) => (
							<li
								key={row}
								className="flex items-baseline justify-between gap-3 py-1.5 font-mono text-sm first:pt-0 last:pb-0"
							>
								{row}
								<span className="text-xs text-muted-foreground">4 kb</span>
							</li>
						))}
					</ul>
				) : (
					<div className="divide-y">
						{rows.map((row) => (
							<div
								key={row}
								className="flex items-center justify-between gap-3 py-1.5 first:pt-0 last:pb-0"
							>
								<Skeleton className="h-4 w-40" />
								<Skeleton className="h-3 w-8" />
							</div>
						))}
					</div>
				)}
			</div>
			<p className="text-sm text-muted-foreground">
				three rows in, three rows out: the box is the same height before and after.
			</p>
		</div>
	);
}
