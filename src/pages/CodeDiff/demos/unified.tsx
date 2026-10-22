import { CodeDiff } from '@/components/lumo/ui/CodeDiff';

const before = ['const retries = 1;', 'export { retries };'].join('\n');
const after = ['const retries = 3;', 'export { retries };'].join('\n');

export default function Unified() {
	return (
		<CodeDiff
			oldContent={before}
			newContent={after}
			language="ts"
			fileName="retries.ts"
			view="unified"
			className="w-full"
		/>
	);
}
