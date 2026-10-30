import { useState } from 'react';
import { CodeTree } from '@/components/blocks/code-tree';

/** The demo, and the component it shows: what the reader opened the tree for. */
const primary = [
	'src/pages/CodeTree/demos/primary.tsx',
	'src/components/blocks/code-tree/index.tsx',
	'src/components/blocks/code-tree/tree.ts',
	'src/components/blocks/code-tree/glyph.tsx',
];

/** What that component installs around itself. */
const dependencies = [
	'src/components/ui/nav.tsx',
	'src/components/ui/collapsible.tsx',
	'src/lib/utils.ts',
	'src/styles/lumo-tokens.css',
];

export default function Primary() {
	const [selected, setSelected] = useState(primary[0]!);

	return (
		<div className="w-full max-w-xs space-y-2">
			<div className="max-h-64 overflow-y-auto rounded-lg border p-2">
				<CodeTree
					paths={[...primary, ...dependencies]}
					primary={primary}
					selected={selected}
					onSelect={setSelected}
				/>
			</div>
			<p className="truncate font-mono text-xs text-muted-foreground">{selected}</p>
		</div>
	);
}
