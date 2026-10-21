import { DocPage, DocSection } from '@/pages/DocPage';

export function OverviewPage() {
	return (
		<DocPage title="overview" description="base ui behaviour + token-driven styling">
			<DocSection title="lumo-ui">
				<p className="text-sm text-muted-foreground">
					one directory per component, Base UI for behaviour, tokens for appearance, and
					nothing hardcoded in between. the rail on the left is a real{' '}
					<code className="rounded bg-muted px-1 py-0.5">react-router</code> menu: every
					row is a <code className="rounded bg-muted px-1 py-0.5">NavLink</code>, so the
					url is what selects a page and reloading one lands you back on it.
				</p>
			</DocSection>

			<DocSection title="what is here">
				<ul className="space-y-2 text-sm text-muted-foreground">
					<li>
						<code className="rounded bg-muted px-1 py-0.5">src/components/lumo/ui</code>{' '}
						— the primitives, each one copyable on its own.
					</li>
					<li>
						<code className="rounded bg-muted px-1 py-0.5">
							src/components/lumo/blocks
						</code>{' '}
						— the shell: a rail drawn from data, and the surface a page scrolls in.
					</li>
					<li>
						<code className="rounded bg-muted px-1 py-0.5">src/pages</code> — these
						docs, one page per component, each one its own file.
					</li>
				</ul>
			</DocSection>

			<DocSection title="the rules">
				<ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
					<li>No hardcoded visual values — tokens only.</li>
					<li>Focus is defined once, in :focus-visible.</li>
					<li>Base UI supplies behaviour; we supply appearance.</li>
					<li>The consumer's className merges last, through cn().</li>
				</ol>
				<div className="flex items-center gap-2 pt-2 text-sm">
					<img src="/logo.svg" alt="" className="size-4 shrink-0" />
					<span className="text-muted-foreground">lumo-ui 0.1.0</span>
				</div>
			</DocSection>
		</DocPage>
	);
}
