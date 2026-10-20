import { Spinner } from '@/components/lumo/ui/Spinner';
import { DocPage, DocSection } from '@/pages/DocPage';

export function SpinnerPage() {
	return (
		<DocPage title="spinner" description="the one loading indicator, sized in em">
			<DocSection
				title="sizes"
				note={
					<>
						it sizes itself in <code>em</code>, so a control loads at exactly the size
						of the icon it replaces. pass <code>label={'{null}'}</code> inside a control
						that already announces its own state.
					</>
				}
			>
				<div className="flex flex-wrap items-center gap-4 text-foreground">
					<Spinner />
					<Spinner className="size-6" />
					<Spinner className="size-10 text-muted-foreground" label="saving" />
				</div>
			</DocSection>

			<DocSection title="where it is used">
				<p className="text-sm text-muted-foreground">
					<code className="rounded bg-muted px-1 py-0.5">Button</code> defaults its{' '}
					<code className="rounded bg-muted px-1 py-0.5">loadingIcon</code> to this
					element, so <code className="rounded bg-muted px-1 py-0.5">loading</code> and a
					leading icon cannot disagree about size.
				</p>
			</DocSection>
		</DocPage>
	);
}
