import { CodeDiff } from '@/components/ui/code-diff';

const before = [
	'export function greet(name: string) {',
	"\tconst parts = name.split(' ');",
	"\treturn 'hello, ' + parts[0];",
	'}',
	'',
	'export const version = 1;',
].join('\n');

const after = [
	'export function greet(name: string) {',
	"\tconst parts = name.trim().split(' ');",
	'\tconst first = parts[0] ?? name;',
	'\treturn `hello, ${first}`;',
	'}',
	'',
	'export const version = 2;',
].join('\n');

export default function Basic() {
	return (
		<CodeDiff
			oldContent={before}
			newContent={after}
			language="ts"
			fileName="greet.ts"
			className="w-full"
		/>
	);
}
