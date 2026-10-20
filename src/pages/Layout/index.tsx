import { DocPage, DocSection } from '@/pages/DocPage';

export function LayoutPage() {
	return (
		<DocPage title="layout" description="the shell: a rail, and the surface a page scrolls in">
			<DocSection
				title="the shell around this page"
				note={
					<>
						the shell reports the fold; where it is remembered is the app's business, so
						this app writes a cookie and Layout never does. cmd/ctrl+b and the button in
						the rail's corner both fold it.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					one <code className="rounded bg-muted px-1 py-0.5">menu</code> array draws the
					rail. each row carries its own{' '}
					<code className="rounded bg-muted px-1 py-0.5">href</code> and is handed to{' '}
					<code className="rounded bg-muted px-1 py-0.5">react-router</code> through{' '}
					<code className="rounded bg-muted px-1 py-0.5">render</code>, so the shell never
					imports a router and still navigates without a reload.
				</p>
			</DocSection>

			<DocSection title="variants">
				<p className="text-sm text-muted-foreground">
					<strong>default</strong> insets the surface as a card on every edge;{' '}
					<strong>plain</strong> lets the content be the page. this app renders both at
					once — the card on the left, edge to edge on the right — to show that the
					surface, not the rail, is what changes.
				</p>
				<div className="grid gap-3 md:grid-cols-2">
					<div className="rounded-xl border bg-card p-4 text-sm text-card-foreground">
						<div className="text-xs text-muted-foreground">variant=default</div>
						<div className="pt-1">a card inset on every edge</div>
					</div>
					<div className="rounded-xl border bg-background p-4 text-sm">
						<div className="text-xs text-muted-foreground">variant=plain</div>
						<div className="pt-1">the page is the surface</div>
					</div>
				</div>
			</DocSection>

			<DocSection title="the header belongs to the page">
				<p className="text-sm text-muted-foreground">
					the bar above this text is written by this page, not by the shell. it sticks to
					the top of the scroll container and carries that container's own fill, so a page
					can drop it anywhere in its content and still keep it in place.
				</p>
			</DocSection>
		</DocPage>
	);
}
