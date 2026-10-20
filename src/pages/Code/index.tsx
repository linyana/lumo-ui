import { Code } from '@/components/lumo/ui/Code';
import { DocPage, DocSection } from '@/pages/DocPage';

const source = [
	"import { clsx, type ClassValue } from 'clsx';",
	"import { twMerge } from 'tailwind-merge';",
	'',
	'/** Merges class names, last one wins. */',
	'export function cn(...inputs: ClassValue[]) {',
	'\treturn twMerge(clsx(inputs));',
	'}',
].join('\n');

const long = [
	'const message =',
	"\t'every line here is longer than the block it sits in, which is the whole point of the demo';",
	'export default message;',
].join('\n');

export function CodePage() {
	return (
		<DocPage title="code" description="source, coloured, with a way to take it">
			<DocSection
				title="a file, its language, and a copy button"
				note="the grammar is fetched the first time a block asks for it; until then the same lines render unstyled, so nothing reflows."
			>
				<Code code={source} language="ts" fileName="cn.ts" />
			</DocSection>
			<DocSection
				title="with line numbers"
				note="numbers are a column, not part of the text."
			>
				<Code code={source} language="typescript" showLineNumbers />
			</DocSection>
			<DocSection
				title="three surfaces"
				note="the same block on a filled, an outlined and a bare background."
			>
				<div className="space-y-4">
					<Code code={source} language="ts" fileName="cn.ts" variant="filled" />
					<Code code={source} language="ts" fileName="cn.ts" variant="outlined" />
					<Code code={source} language="ts" fileName="cn.ts" variant="ghost" />
				</div>
			</DocSection>
			<DocSection
				title="wrapping"
				note="long lines scroll sideways by default; with `wrap` they fold and the block stays narrow."
			>
				<div className="space-y-4">
					<Code code={long} language="ts" fileName="scroll.ts" />
					<Code code={long} language="ts" fileName="wrap.ts" wrap />
				</div>
			</DocSection>
			<DocSection
				title="a language we do not ship"
				note="falls back to plain text rather than failing: the block still reads, just without colour."
			>
				<Code code={source} language="brainfuck" fileName="unknown.bf" />
			</DocSection>
		</DocPage>
	);
}
