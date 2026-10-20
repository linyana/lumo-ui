import { Separator } from '@/components/lumo/Separator';
import { DocPage, DocSection } from '@/pages/DocPage';

export function SeparatorPage() {
	return (
		<DocPage title="separator" description="a line between two regions, announced as one">
			<DocSection
				title="horizontal and vertical"
				note={
					<>
						a real <code>role="separator"</code> with an orientation, so it is announced
						rather than merely drawn.
					</>
				}
			>
				<div className="max-w-sm rounded-lg border p-4 text-sm">
					<div>project settings</div>
					<Separator className="my-3" />
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span>3 members</span>
						<Separator orientation="vertical" className="h-4" />
						<span>updated today</span>
					</div>
				</div>
			</DocSection>
		</DocPage>
	);
}
