import { CodeDiff } from '@/components/lumo/CodeDiff';
import { DocPage, DocSection } from '@/pages/DocPage';

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

const added = ['export function farewell(name: string) {', '\treturn `bye, ${name}`;', '}'].join(
	'\n',
);

export function CodeDiffPage() {
	return (
		<DocPage title="code diff" description="two revisions of one file, and what changed">
			<DocSection
				title="split"
				note="old on the left, new on the right, paired row by row so a rewritten line sits next to the one it replaced."
			>
				<CodeDiff
					oldContent={before}
					newContent={after}
					language="ts"
					fileName="greet.ts"
				/>
			</DocSection>
			<DocSection
				title="unified"
				note="one column with a sign, each side keeping its own line numbers."
			>
				<CodeDiff
					oldContent={before}
					newContent={after}
					language="ts"
					fileName="greet.ts"
					view="unified"
				/>
			</DocSection>
			<DocSection
				title="an added block"
				note="a change with no old side leaves the left column blank rather than misaligning it."
			>
				<CodeDiff oldContent={after} newContent={`${after}\n\n${added}`} language="ts" />
			</DocSection>
			<DocSection title="a removed block" note="and the mirror image.">
				<CodeDiff oldContent={`${before}\n\n${added}`} newContent={before} language="ts" />
			</DocSection>
			<DocSection
				title="three surfaces"
				note="the diff wears the same three backgrounds as a plain code block."
			>
				<div className="space-y-4">
					<CodeDiff
						oldContent={before}
						newContent={after}
						language="ts"
						fileName="filled.ts"
						variant="filled"
					/>
					<CodeDiff
						oldContent={before}
						newContent={after}
						language="ts"
						fileName="ghost.ts"
						variant="ghost"
					/>
				</div>
			</DocSection>
		</DocPage>
	);
}
