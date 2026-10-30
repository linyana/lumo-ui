import { Code } from '@/components/ui/code';
import {
	Command,
	DocLink,
	DocPage,
	DocSection,
	DocTable,
	Mono,
	registryUrl,
} from '@/pages/DocPage';

/**
 * What a project does once, on the way in: the namespace, the theme, and the first component.
 *
 * Everything a component page says about installing is the same three steps, so they are said here
 * instead — a page under Components only has to name its own item.
 */
export function InstallPage() {
	const namespace = `{
	"registries": {
		"@lumo": "${registryUrl()}"
	}
}`;

	return (
		<DocPage
			title="Install"
			description="one namespace, one theme, then a component at a time."
		>
			<DocSection
				title="what this is"
				note={
					<>
						the site is the registry: <Mono>/r/button.json</Mono> beside this page is
						what the CLI downloads. there is no npm package — a component arrives as
						source, in your project, where you can read it.
					</>
				}
			>
				<p className="text-sm">
					Every item is addressed <Mono>@lumo/&lt;name&gt;</Mono>, and its dependencies
					are addressed the same way, so one declaration covers the whole graph: adding{' '}
					<Mono>table</Mono> brings the files it needs, and a file you already have is
					left alone.
				</p>
			</DocSection>

			<DocSection
				title="before you start"
				note={
					<>
						Tailwind v4 and a <Mono>components.json</Mono> — <Mono>shadcn init</Mono>{' '}
						writes both, and its aliases are what the files are copied into. npm
						packages are installed for you; nothing else is required.
					</>
				}
			>
				<Command>bunx shadcn@latest init</Command>
			</DocSection>

			<DocSection
				title="declare the namespace"
				note={
					<>
						once per project, in <Mono>components.json</Mono> —{' '}
						<Mono>package.json</Mono> takes the same map under a <Mono>registries</Mono>{' '}
						key. the <Mono>{'{name}'}</Mono> is the CLI's placeholder, not something to
						fill in.
					</>
				}
			>
				<Code code={namespace} language="json" header={false} />
			</DocSection>

			<DocSection
				title="the theme"
				note={
					<>
						not a file to copy: the CLI merges it into the stylesheet{' '}
						<Mono>components.json</Mono> names — <Mono>:root</Mono>, <Mono>.dark</Mono>{' '}
						and the <Mono>@theme inline</Mono> block, plus the base layer.
					</>
				}
			>
				<div className="space-y-3">
					<Command>bunx shadcn@latest add @lumo/theme</Command>
					<Command>bunx shadcn@latest add @lumo/palette</Command>
					<DocTable
						head={['item', 'what it adds']}
						mono={[0]}
						rows={[
							[
								'@lumo/theme',
								<>
									everything a component cannot draw without, and a shadcn theme
									does not define: the <Mono>@theme</Mono> mappings, the
									interaction and motion tokens, the radius scale, the outcome
									colours, the shadows, the focus ring. required. it asks before
									writing — a style is the one thing allowed to overwrite.
								</>,
							],
							[
								'@lumo/palette',
								<>
									the default page colours and <Mono>--radius</Mono>, added only
									where the project has none of its own. optional, and safe on a
									project that already has a theme: your <Mono>--primary</Mono>{' '}
									stays your <Mono>--primary</Mono>.
								</>,
							],
						]}
					/>
				</div>
			</DocSection>

			<DocSection
				title="add a component"
				note={
					<>
						the npm packages its files import are installed, and so is every item it
						reaches for. the next component reuses them.
					</>
				}
			>
				<Command>bunx shadcn@latest add @lumo/button</Command>
			</DocSection>

			<DocSection
				title="where the files land"
				note={
					<>
						the manifest names no path for any of them. the file's type and your own
						aliases decide, which is what puts a second install on the first copy
						instead of beside it.
					</>
				}
			>
				<DocTable
					head={['type', 'goes to', 'example']}
					mono={[0, 2]}
					rows={[
						['registry:ui', 'the ui alias', '@/components/ui/button.tsx'],
						['registry:lib', 'the lib alias', '@/lib/utils.ts'],
						['registry:block', 'the components alias', '@/components/blocks/layout/'],
					]}
				/>
			</DocSection>

			<DocSection
				title="adding again"
				note={
					<>
						a file that is already there is compared before it is written. identical
						content is skipped without a word; content you changed is not thrown away
						without asking. <Mono>--overwrite</Mono> is how a fix reaches a component
						you edited, and <Mono>--dry-run</Mono> is how you see the paths first.
					</>
				}
			>
				<Code
					code={`$ bunx shadcn@latest add @lumo/code-diff
✔ Created 4 files:
  - src/lib/shiki.ts
  - src/lib/clipboard.ts
  - src/components/ui/code.tsx
  - src/components/ui/code-diff.tsx
ℹ Skipped 4 files: (files might be identical, use --overwrite to overwrite)
  - src/lib/utils.ts      - src/components/ui/spinner.tsx
  - src/lib/control.ts    - src/components/ui/button.tsx`}
					language="bash"
					header={false}
				/>
			</DocSection>

			<DocSection
				title="by hand"
				note={
					<>
						every component page has a <Mono>manual</Mono> tab: the files the command
						would copy, each one readable and copyable, and the same set as a zip. the
						theme is the one part a manual has to import itself —{' '}
						<Mono>lumo-tokens.css</Mono> always, <Mono>lumo-palette.css</Mono> only
						without colours of your own.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					see <DocLink to="/button">button</DocLink> for the shape of it, or{' '}
					<DocLink to="/overview">the overview</DocLink> for what there is to install.
				</p>
			</DocSection>
		</DocPage>
	);
}
