import { Separator } from '@/components/lumo/ui/Separator';

const rows = [
	{ label: 'name', value: 'lumo-ui' },
	{ label: 'layer', value: 'ui' },
	{ label: 'behaviour', value: 'Base UI' },
];

export default function BetweenRows() {
	return (
		<div className="w-full max-w-sm rounded-lg border text-sm">
			{rows.map(({ label, value }, index) => (
				<div key={label}>
					{index > 0 && <Separator />}
					<div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
						<span className="text-muted-foreground">{label}</span>
						<span className="font-mono">{value}</span>
					</div>
				</div>
			))}
		</div>
	);
}
