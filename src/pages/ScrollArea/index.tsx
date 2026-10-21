import { ScrollArea } from '@/components/lumo/ui/ScrollArea';
import { DocPage, DocSection } from '@/pages/DocPage';

const paragraphs = [
	'A pane is scrollable only once it has a height to run out of: the root takes it from its parent, and the viewport fills the root. Nothing measures the content to decide that, so a pane with two lines and a pane with two hundred look the same at rest.',
	'The bar is not the box’s own. It is drawn over the content on the inline end, which is why the pane never changes width when the content starts to overflow, and why the corner of a pane that scrolls both ways stays empty instead of gaining a square.',
	'It stays out of sight until it is needed — until the pane is scrolled, or the pointer comes to rest over it — and by then the thumb is where the position is. That is the same bargain the platform makes with its own overlay bar, so a pane here feels like a pane anywhere else on the machine.',
	'Dragging it works, and so does clicking the track: those are the parts worth keeping from a native bar, and the reason this is not a rectangle that merely follows the scroll position.',
];

export function ScrollAreaPage() {
	return (
		<DocPage
			title="scroll area"
			description="a pane that scrolls under a bar it keeps out of sight"
		>
			<DocSection
				title="overlay bar"
				note={
					<>
						give the root a height and the viewport fills it. the bar appears while the
						pane is scrolled or hovered, and takes no width from the content.
					</>
				}
			>
				<div className="max-w-md rounded-lg border bg-muted/40">
					<ScrollArea.Root className="h-56">
						<ScrollArea.Viewport>
							<ScrollArea.Content className="flex flex-col gap-3 p-4 text-sm leading-relaxed">
								{paragraphs.map((paragraph) => (
									<p key={paragraph.slice(0, 24)}>{paragraph}</p>
								))}
							</ScrollArea.Content>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar />
					</ScrollArea.Root>
				</div>
			</DocSection>
		</DocPage>
	);
}
