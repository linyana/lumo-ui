import { Table } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';

const runs = Array.from({ length: 16 }, (_, index) => ({
	id: `run-${1041 + index}`,
	job: index % 2 === 0 ? 'production deploy' : 'integration suite',
	branch: index % 2 === 0 ? 'release/connection-pool-backpressure' : 'main',
	note:
		index % 3 === 0
			? 'Waiting for the previous deployment to finish before acquiring the production lock.'
			: 'All required checks have passed.',
	duration: `${24 + index * 7}s`,
}));

export default function Scroll() {
	return (
		<Tooltip.Provider>
			<div className="min-w-0 w-full space-y-3">
				<p className="text-sm text-muted-foreground">
					Scroll in either direction. The frame keeps the declared column widths rather
					than squeezing them, the header holds at its top, and branch names keep their
					width while notes can wrap.
				</p>
				<Table.Root
					variant="outlined"
					scroll={{ x: 928, y: 288 }}
					aria-label="deployment history"
				>
					<colgroup>
						<col className="w-32" />
						<col className="w-44" />
						<col className="w-56" />
						<col className="w-72" />
						<col className="w-28" />
					</colgroup>
					<Table.Header sticky>
						<Table.Row>
							<Table.Head rowSpan={2}>run</Table.Head>
							<Table.Head rowSpan={2}>job</Table.Head>
							<Table.Head scope="colgroup" colSpan={2} align="center">
								change
							</Table.Head>
							<Table.Head rowSpan={2} align="end">
								duration
							</Table.Head>
						</Table.Row>
						<Table.Row>
							<Table.Head>branch</Table.Head>
							<Table.Head>note</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{runs.map((run, index) => (
							<Table.Row key={run.id} data-selected={index === 2 || undefined}>
								<Table.Head scope="row">{run.id}</Table.Head>
								<Table.Cell>{run.job}</Table.Cell>
								<Table.Cell>
									<Tooltip.Root>
										<Tooltip.Trigger
											render={<button type="button" />}
											className="block w-48 truncate rounded-sm text-start"
										>
											{run.branch}
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Positioner>
												<Tooltip.Popup className="wrap-anywhere">
													{run.branch}
												</Tooltip.Popup>
											</Tooltip.Positioner>
										</Tooltip.Portal>
									</Tooltip.Root>
								</Table.Cell>
								<Table.Cell className="min-w-64 whitespace-normal">
									{run.note}
								</Table.Cell>
								<Table.Cell align="end">{run.duration}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>
		</Tooltip.Provider>
	);
}
