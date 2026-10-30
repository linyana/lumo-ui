import { Code } from '@/components/ui/code';

const source = [
	'export function clamp(value: number, min: number, max: number) {',
	'\treturn Math.min(Math.max(value, min), max);',
	'}',
].join('\n');

export default function LineNumbers() {
	return (
		<Code code={source} language="ts" fileName="clamp.ts" showLineNumbers className="w-full" />
	);
}
