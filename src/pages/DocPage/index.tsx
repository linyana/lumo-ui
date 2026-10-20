import type { ReactNode } from 'react';

export type DocPageProps = {
	title: string;
	description?: string;
	children: ReactNode;
};

/**
 * The shell a doc page draws inside `Layout.Content`: its own header, then the sections. The
 * header belongs to the page, not to the shell, which is why this exists rather than Layout
 * holding one.
 */
export function DocPage({ title, description, children }: DocPageProps) {
	return (
		<>
			<header
				data-slot="doc-page-header"
				className="sticky top-0 z-10 flex min-h-14 items-center gap-4 border-b bg-inherit px-6 py-3"
			>
				<div className="flex min-w-0 flex-col gap-0.5">
					<h1 className="truncate text-sm font-semibold">{title}</h1>
					{description !== undefined && (
						<p className="truncate text-xs text-muted-foreground">{description}</p>
					)}
				</div>
			</header>
			<div data-slot="doc-page-body" className="mx-auto max-w-3xl space-y-10 p-6">
				{children}
			</div>
		</>
	);
}

export type DocSectionProps = {
	title: string;
	/** The prose under the example. Kept as a node so a section can mark up its own words. */
	note?: ReactNode;
	children: ReactNode;
};

/** One heading, one demo, one explanation — the rhythm every page in these docs follows. */
export function DocSection({ title, note, children }: DocSectionProps) {
	return (
		<section data-slot="doc-section" className="space-y-3">
			<h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
			{children}
			{note !== undefined && <p className="text-xs text-muted-foreground">{note}</p>}
		</section>
	);
}
