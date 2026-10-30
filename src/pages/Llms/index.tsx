import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Code } from '@/components/ui/code';
import { useCopy } from '@/lib/clipboard';
import { Command, DocLink, DocPage, DocSection, DocTable, DocTabs, Mono } from '@/pages/DocPage';

function CopyAction({ value, label }: { value: string; label: string }) {
	const { copied, copy } = useCopy();

	return (
		<Button
			variant="secondary"
			size="sm"
			icon={copied ? <Check /> : <Copy />}
			onClick={() => copy(value)}
		>
			<span data-slot="ai-copy-label" aria-live="polite">
				{copied ? 'Copied' : label}
			</span>
		</Button>
	);
}

function Prompt({ value }: { value: string }) {
	return (
		<div data-slot="ai-prompt" className="overflow-hidden rounded-lg border">
			<p
				data-slot="ai-prompt-text"
				className="p-5 text-sm leading-relaxed whitespace-pre-wrap break-words select-text"
			>
				{value}
			</p>
			<div
				data-slot="ai-prompt-actions"
				className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/50 px-4 py-3"
			>
				<span data-slot="ai-prompt-hint" className="text-xs text-muted-foreground">
					Paste into your assistant, then make the request your own.
				</span>
				<CopyAction value={value} label="Copy prompt" />
			</div>
		</div>
	);
}

export function LlmsPage() {
	const origin = window.location.origin;
	const instruction =
		`Use lumo-ui for this project's UI. Read ${origin}/llms.txt first, then fetch the ` +
		'relevant component docs linked in that index before writing code. Resolve documentation ' +
		`paths against ${origin}. Follow the documented APIs, use Base UI's render prop instead ` +
		'of asChild, and style with the existing theme tokens. Reuse components already in the project. ' +
		'If you cannot read the docs, ask me to attach them instead of guessing.';
	const pagePrompt =
		`Read ${origin}/llms.txt to learn how to use lumo-ui, then read the docs for the ` +
		`components you need. Resolve documentation paths against ${origin}.\n\n` +
		'Build a settings page with a profile form and a save button using lumo-ui. ' +
		'Follow the documented component APIs and theme tokens, and reuse components already ' +
		'in my project. If setup is missing, explain what needs to be installed before changing files.\n\n' +
		'If you cannot open the documentation links, ask me to attach the files instead of guessing.';
	const componentPrompt =
		`Read ${origin}/docs/button.md before using @lumo/button.\n\n` +
		'Add a save button with a loading state to my form using the documented API. ' +
		'Reuse the Button already in my project, or explain the installation steps if it is missing.\n\n' +
		'If you cannot open the documentation link, ask me to attach the file instead of guessing.';
	const resources = [
		{
			title: 'Start with the index',
			path: '/llms.txt',
			description:
				'The setup guide and component list. Give this to an assistant that can follow links; it can read only the components it needs.',
		},
		{
			title: 'Just one component',
			path: '/docs/button.md',
			description:
				'Installation, source and examples for Button. Find other component documents in the index.',
		},
		{
			title: 'The full library',
			path: '/llms-full.txt',
			description:
				'All component docs, source and examples in one larger file. Useful as an attachment when your assistant cannot follow links.',
		},
	];

	return (
		<DocPage
			title="AI Guide"
			description="Give your assistant the right docs, then tell it what you want to build."
			className="px-4 sm:px-8"
		>
			<DocSection title="Start with a prompt">
				<p className="text-sm leading-relaxed text-muted-foreground">
					Copy an example into your AI chat or coding assistant. Replace the example
					request with your own. No plugin or local server is needed to read the docs.
				</p>
				<DocTabs
					tabs={[
						{
							value: 'page',
							label: 'Build a page',
							content: <Prompt value={pagePrompt} />,
						},
						{
							value: 'component',
							label: 'Use a component',
							content: <Prompt value={componentPrompt} />,
						},
					]}
				/>
				<p className="text-sm leading-relaxed text-muted-foreground">
					This shares documentation, not an installation. Starting a new project? Follow
					the <DocLink to="/install">installation guide</DocLink> to set up the registry
					and required theme. Review your assistant&rsquo;s proposed changes before
					applying them.
				</p>
			</DocSection>

			<DocSection title="Keep it in your project">
				<p className="text-sm leading-relaxed text-muted-foreground">
					Optional: add this instruction to your assistant&rsquo;s project rules so you
					don&rsquo;t have to paste the introduction each time. Append it to existing
					rules rather than replacing them.
				</p>
				<Code code={instruction} language="text" fileName="Project instruction" wrap />
				<DocTable
					head={['Where you work', 'Where to put it']}
					rows={[
						['Claude Code', <Mono key="claude">CLAUDE.md</Mono>],
						['Codex', <Mono key="codex">AGENTS.md</Mono>],
						[
							'Cursor',
							<>
								A project rule in <Mono>.cursor/rules</Mono>.
							</>,
						],
						[
							'Windsurf',
							<>
								A workspace rule in <Mono>.windsurf/rules</Mono>.
							</>,
						],
						['Gemini CLI', <Mono key="gemini">GEMINI.md</Mono>],
						['Other coding assistants', 'Your tool’s project rules or instructions.'],
						['A chat app', 'Paste it into the conversation or project instructions.'],
					]}
				/>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Saved instructions do not give a tool web access. If it cannot read URLs, attach
					the docs using the fallback below.
				</p>
			</DocSection>

			<DocSection title="Choose the right docs">
				<p className="text-sm leading-relaxed text-muted-foreground">
					You don&rsquo;t need to send the whole library for every task. Start with the
					index, or send one component&rsquo;s docs when you already know what you need.
				</p>
				<div data-slot="ai-resources" className="divide-y rounded-lg border px-4 sm:px-5">
					{resources.map((resource) => {
						const url = `${origin}${resource.path}`;

						return (
							<div
								key={resource.path}
								data-slot="ai-resource"
								className="space-y-3 py-5"
							>
								<div data-slot="ai-resource-description" className="space-y-1">
									<h3
										data-slot="ai-resource-title"
										className="text-sm font-medium"
									>
										{resource.title}
									</h3>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{resource.description}
									</p>
								</div>
								<div
									data-slot="ai-resource-actions"
									className="flex flex-wrap items-center justify-between gap-3"
								>
									<a
										href={url}
										target="_blank"
										rel="noreferrer"
										className="inline-flex min-w-0 items-center gap-2 text-sm underline underline-offset-4 hover:text-muted-foreground"
									>
										<span className="min-w-0 font-mono break-all">{url}</span>
										<ExternalLink
											aria-hidden="true"
											className="size-3.5 shrink-0"
										/>
										<span className="sr-only"> (opens in a new tab)</span>
									</a>
									<CopyAction value={url} label="Copy URL" />
								</div>
							</div>
						);
					})}
				</div>
			</DocSection>

			<DocSection title="If your assistant cannot open links">
				<p className="text-sm leading-relaxed text-muted-foreground">
					Download the docs and attach the file to your conversation, or add it as context
					in your editor. Ask your assistant to read the attachment before building your
					UI. A file sitting in your project is not automatically included in a
					conversation.
				</p>
				<a
					href={`${origin}/llms-full.txt`}
					download="lumo-ui.txt"
					className={buttonVariants({ variant: 'outline' })}
				>
					<Download aria-hidden="true" />
					Download full docs
				</a>
				<div data-slot="ai-download-command" className="space-y-2">
					<p className="text-sm text-muted-foreground">
						Or save a local copy from your terminal:
					</p>
					<Command>{`curl -fL -o lumo-ui.txt ${origin}/llms-full.txt`}</Command>
				</div>
			</DocSection>

			<DocSection title="Contributing to lumo-ui?">
				<p className="text-sm leading-relaxed text-muted-foreground">
					Building components for this library is different from using them in your app.
					Give your assistant the{' '}
					<a
						href={`${origin}/docs/agents.md`}
						target="_blank"
						rel="noreferrer"
						className="underline underline-offset-2 hover:text-foreground"
					>
						repository authoring guide
						<span className="sr-only"> (opens in a new tab)</span>
					</a>{' '}
					for the library&rsquo;s structure, naming and registry rules. You don&rsquo;t
					need these contributor instructions to use components in your project.
				</p>
			</DocSection>
		</DocPage>
	);
}
