import { CodeTree } from '@/components/blocks/code-tree';

const paths = [
	'src/components/ui/codeTree.tsx',
	'src/components/ui/code.tsx',
	'src/components/ui/code-diff.tsx',
	'src/components/ui/button.tsx',
	'src/lib/utils.ts',
	'src/lib/shiki.ts',
	'package.json',
	'tsconfig.json',
];

export default function Collapsed() {
	return (
		<div className="w-full max-w-xs rounded-lg border p-2">
			<CodeTree paths={paths} size="md" defaultCollapsed={['src/components']} />
		</div>
	);
}
