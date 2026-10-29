import { Badge } from '@/components/lumo/ui/Badge';
import { Separator } from '@/components/lumo/ui/Separator';

const runs = [
	{ name: 'unit tests', outcome: 'passed', variant: 'success' as const, note: '1m 04s' },
	{ name: 'deploy', outcome: 'waiting', variant: 'warning' as const, note: 'needs review' },
	{ name: 'e2e', outcome: 'failed', variant: 'destructive' as const, note: '3 specs' },
	{ name: 'docs', outcome: 'queued', variant: 'info' as const, note: 'in 2 runs' },
];

export default function Rows() {
	return (
		<div className="w-full max-w-sm rounded-lg border px-3">
			{runs.map((run, index) => (
				<div key={run.name}>
					{index > 0 && <Separator />}
					<div className="flex items-center justify-between gap-3 py-2 text-sm">
						<span className="truncate">{run.name}</span>
						<div className="flex shrink-0 items-center gap-2">
							<span className="text-muted-foreground">{run.note}</span>
							<Badge variant={run.variant}>{run.outcome}</Badge>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
