import { Code } from '@/components/ui/code';
import { DocPage, DocSection, DocTable, Mono } from '@/pages/DocPage';

/**
 * Everything a caller needs to hand this library to an assistant, and nothing about how the files
 * are made: an address, where to put it in each tool, and the prompt that tells the model what to
 * do with it. The origin is read off the page so the copyable address is the one being read.
 */
export function LlmsPage() {
	const origin = window.location.origin;
	const prompt =
		`read ${origin}/llms-full.txt — the lumo-ui component library — and ` +
		'use it when writing UI: Base UI behaviour, render instead of asChild, ' +
		'token classes instead of colours.';
	const component = `read ${origin}/docs/button.md before using @lumo/button`;

	return (
		<DocPage
			title="use with ai"
			description="one address your assistant can read: the whole library, or a single component"
		>
			<DocSection
				title="what this is"
				note="no plugin, no local server: a plain text file served from the site, which any assistant can open once."
			>
				<p className="text-sm">
					The whole library is written down for a model to read — what each component is
					for, how it is installed, the source it copies and an example of it in use. Give
					your assistant the address and it can answer with your own install, instead of
					guessing at another library&rsquo;s API.
				</p>
			</DocSection>

			<DocSection
				title="what is available"
				note={
					<>
						the first one is the index and links the rest; add nothing else unless you
						want the whole library in one file.
					</>
				}
			>
				<DocTable
					head={['address', 'what it is']}
					mono={[0]}
					rows={[
						[
							'/llms.txt',
							<>
								the index — what this is, how an install works, the rules a
								component is written by, then every item by layer, each linking to
								its own markdown.
							</>,
						],
						[
							'/llms-full.txt',
							'the index and every item’s source and examples, in one file.',
						],
						[
							'/docs/<name>.md',
							<>
								one item — <Mono>/docs/button.md</Mono> for{' '}
								<Mono>@lumo/button</Mono> — the narrowest thing to give a model and
								the cheapest.
							</>,
						],
						[
							'/docs/agents.md',
							<>
								the rules this repository is written by, for an assistant that is
								adding a component rather than calling one.
							</>,
						],
					]}
				/>
			</DocSection>

			<DocSection
				title="in your tools"
				note={
					<>
						the file is the same everywhere — what changes is where a tool reads its
						standing instructions from. the prompt below is the one to paste.
					</>
				}
			>
				<DocTable
					head={['tool', 'how to add it']}
					rows={[
						[
							'Cursor',
							'Settings → Indexing & Docs → Add doc, or a line in .cursor/rules',
						],
						['Claude Code', 'CLAUDE.md, or /memory'],
						['Codex', 'AGENTS.md'],
						['Windsurf', '.windsurf/rules'],
						['Gemini CLI', 'GEMINI.md, or --context'],
						['a chat window', 'paste the address, or the file itself'],
					]}
				/>
				<Code code={prompt} language="text" header={false} />
			</DocSection>

			<DocSection
				title="one component at a time"
				note={
					<>
						a tight context window does not need the library, only the part it is about
						to call: every <Mono>/docs/&lt;name&gt;.md</Mono> is listed in the index,
						under the same name the CLI installs.
					</>
				}
			>
				<Code code={component} language="text" header={false} />
			</DocSection>

			<DocSection
				title="keep a copy"
				note="for an editor that will not fetch, or a machine with no network: one file in the project, in front of every prompt."
			>
				<Code
					code={`curl -o docs/lumo-ui.txt ${origin}/llms-full.txt`}
					language="bash"
					header={false}
				/>
			</DocSection>
		</DocPage>
	);
}
