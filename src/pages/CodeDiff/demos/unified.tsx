import { CodeDiff } from '@/components/ui/code-diff';

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
