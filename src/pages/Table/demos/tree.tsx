import { useState, type ReactNode } from 'react';
import { Table } from '@/components/ui/table';

type Node = {
	id: string;
	name: string;
	kind: string;
	size?: string;
	children?: Node[];
};

const files: Node[] = [
	{
		id: 'src',
		name: 'src',
		kind: 'folder',
		children: [
			{
				id: 'src/components',
				name: 'components',
				kind: 'folder',
				children: [
					{
						id: 'src/components/table.tsx',
						name: 'table.tsx',
						kind: 'file',
						size: '31 kB',
					},
					{
						id: 'src/components/button.tsx',
						name: 'button.tsx',
						kind: 'file',
						size: '2 kB',
					},
				],
			},
			{ id: 'src/main.tsx', name: 'main.tsx', kind: 'file', size: '1.2 kB' },
		],
	},
	{ id: 'package.json', name: 'package.json', kind: 'file', size: '1.8 kB' },
	{
		id: 'public',
		name: 'public',
		kind: 'folder',
		children: [
			{
				id: 'public/r',
				name: 'r',
				kind: 'folder',
				children: [
					{ id: 'public/r/table.json', name: 'table.json', kind: 'file', size: '6 kB' },
				],
			},
		],
	},
];

/** A tree is the same rows one level in: the row carries the depth, the branch draws it. */
function rowsOf(
	nodes: Node[],
	depth: number,
	open: Set<string>,
	toggle: (id: string) => void,
): ReactNode[] {
	return nodes.flatMap((node) => {
		const children = node.children ?? [];
		const expanded = open.has(node.id);

		const row = (
			<Table.Row key={node.id} depth={depth}>
				<Table.Cell>
					<Table.Branch
						hasChildren={children.length > 0}
						open={expanded}
						onOpenChange={() => toggle(node.id)}
						label={node.name}
					>
						{node.name}
					</Table.Branch>
				</Table.Cell>
				<Table.Cell className="text-muted-foreground">{node.kind}</Table.Cell>
				<Table.Cell align="end">{node.size ?? '—'}</Table.Cell>
			</Table.Row>
		);

		if (!expanded) return [row];
		return [row, ...rowsOf(children, depth + 1, open, toggle)];
	});
}

export default function Tree() {
	const [open, setOpen] = useState<Set<string>>(() => new Set(['src', 'src/components']));

	const toggle = (id: string) =>
		setOpen((was) => {
			const next = new Set(was);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	return (
		<div className="min-w-0 w-full">
			<Table.Root variant="outlined" aria-label="project files">
				<Table.Header>
					<Table.Row>
						<Table.Head>name</Table.Head>
						<Table.Head>kind</Table.Head>
						<Table.Head align="end">size</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>{rowsOf(files, 0, open, toggle)}</Table.Body>
			</Table.Root>
		</div>
	);
}
