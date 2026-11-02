import { CodeDiff } from '@/components/ui/code-diff';

const fields = Array.from({ length: 16 }, (_, index) => `'field-${index + 1}'`).join(', ');
const before = `export const fields = [${fields}];`;
const after = before.replace('field-16', 'updated-field-16');

export default function Scroll() {
	return (
		<div className="w-full min-w-0 space-y-4">
			<CodeDiff oldContent={before} newContent={after} language="ts" fileName="fields.ts" />
			<CodeDiff
				oldContent={before}
				newContent={after}
				language="ts"
				fileName="fields.ts"
				view="unified"
			/>
		</div>
	);
}
