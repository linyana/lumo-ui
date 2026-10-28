import { CodeTree } from '@/components/lumo/blocks/CodeTree';

const paths = [
	'src/components/lumo/ui/CodeTree.tsx',
	'src/components/lumo/ui/Code.tsx',
	'src/components/lumo/ui/CodeDiff.tsx',
	'src/components/lumo/ui/Button.tsx',
	'src/lib/cn.ts',
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
