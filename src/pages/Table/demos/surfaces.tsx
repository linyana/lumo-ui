import { Table } from '@/components/ui/table';

const regions = [
	{ name: 'Europe', requests: '18,420', latency: '124 ms' },
	{ name: 'North America', requests: '24,810', latency: '98 ms' },
	{ name: 'Asia Pacific', requests: '12,760', latency: '156 ms' },
];

const variants = ['borderless', 'outlined', 'filled'] as const;

export default function Surfaces() {
	return (
		<div className="grid min-w-0 w-full gap-6 xl:grid-cols-3">
			{variants.map((variant) => (
				<div key={variant} className="min-w-0 space-y-4">
					<h3 className="text-sm font-medium">{variant}</h3>
					<Table.Root
						variant={variant}
						hoverable={false}
						aria-label={`${variant} regional traffic`}
					>
						<Table.Header>
							<Table.Row>
								<Table.Head>region</Table.Head>
								<Table.Head align="end">requests</Table.Head>
								<Table.Head align="end">latency</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{regions.map((region) => (
								<Table.Row key={region.name}>
									<Table.Head scope="row">{region.name}</Table.Head>
									<Table.Cell align="end">{region.requests}</Table.Cell>
									<Table.Cell align="end">{region.latency}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</div>
			))}
		</div>
	);
}
