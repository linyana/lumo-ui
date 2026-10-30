import { useState } from 'react';
import { CodeTree } from '@/components/blocks/code-tree';

const paths = [
	'src/components/ui/codeTree.tsx',
	'src/components/ui/button.tsx',
	'src/components/ui/spinner.tsx',
	'src/lib/utils.ts',
	'src/styles/lumo-tokens.css',
];

export default function Basic() {
	const [selected, setSelected] = useState(paths[0]!);

	return (
		<div className="w-full max-w-xs space-y-2">
			<div className="max-h-56 overflow-y-auto rounded-lg border p-2">
				<CodeTree paths={paths} selected={selected} onSelect={setSelected} />
			</div>
			<p className="truncate font-mono text-xs text-muted-foreground">{selected}</p>
		</div>
	);
}
