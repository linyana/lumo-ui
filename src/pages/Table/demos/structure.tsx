import { Table } from '@/components/ui/table';

export default function Structure() {
	return (
		<Table.Root variant="outlined" hoverable={false} aria-label="storage by workspace">
			<Table.Caption>Storage at the end of September. Usage is measured in GB.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head rowSpan={2}>workspace</Table.Head>
					<Table.Head rowSpan={2}>region</Table.Head>
					<Table.Head scope="colgroup" colSpan={2} align="center">
						storage
					</Table.Head>
				</Table.Row>
				<Table.Row>
					<Table.Head align="end">used</Table.Head>
					<Table.Head align="end">limit</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Head scope="row">production</Table.Head>
					<Table.Cell rowSpan={2}>Europe</Table.Cell>
					<Table.Cell align="end">240</Table.Cell>
					<Table.Cell align="end">500</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head scope="row">staging</Table.Head>
					<Table.Cell align="end">64</Table.Cell>
					<Table.Cell align="end">100</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head scope="row">development</Table.Head>
					<Table.Cell>North America</Table.Cell>
					<Table.Cell align="end">32</Table.Cell>
					<Table.Cell align="end">100</Table.Cell>
				</Table.Row>
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Head scope="row" colSpan={2}>
						total
					</Table.Head>
					<Table.Cell align="end">336</Table.Cell>
					<Table.Cell align="end">700</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	);
}
