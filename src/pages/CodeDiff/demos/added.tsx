import { CodeDiff } from '@/components/ui/code-diff';

const before = ['export const name =', "\t'lumo-ui';"].join('\n');

const added = ['export function farewell(name: string) {', '\treturn `bye, ${name}`;', '}'].join(
	'\n',
);

export default function Added() {
	return (
		<CodeDiff
			oldContent={before}
			newContent={`${before}\n\n${added}`}
			language="ts"
			fileName="name.ts"
			className="w-full"
		/>
	);
}
