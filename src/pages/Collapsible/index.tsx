import { Collapsible } from '@/components/lumo/Collapsible';
import { DocPage, DocSection } from '@/pages/DocPage';

export function CollapsiblePage() {
	return (
		<DocPage title="collapsible" description="a disclosure region that expands one panel">
			<DocSection
				title="recovery keys"
				note={
					<>
						Base UI animates the panel from its own measured height, so the content
						needs no fixed size. the caret reads{' '}
						<code className="rounded bg-muted px-1 py-0.5">data-panel-open</code> off
						the trigger and turns with it.
					</>
				}
			>
				<Collapsible.Root className="max-w-sm rounded-lg border">
					<Collapsible.Trigger>
						recovery keys
						<Collapsible.Icon />
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<div className="flex flex-col gap-1 px-3 pb-3 text-sm text-muted-foreground">
							<div>alien-bean-pasta</div>
							<div>wild-irish-burrito</div>
							<div>horse-battery-staple</div>
						</div>
					</Collapsible.Panel>
				</Collapsible.Root>
			</DocSection>
		</DocPage>
	);
}
