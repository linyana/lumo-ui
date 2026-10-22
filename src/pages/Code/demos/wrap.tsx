import { Code } from '@/components/lumo/ui/Code';

const source = [
	'const message =',
	"\t'every line here is longer than the block it sits in, which is the whole point of the demo';",
	'export default message;',
].join('\n');

export default function Wrap() {
	return (
		<div className="w-full space-y-3">
			<Code code={source} language="ts" fileName="scroll.ts" />
			<Code code={source} language="ts" fileName="wrap.ts" wrap />
		</div>
	);
}
