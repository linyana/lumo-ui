import { ScrollArea } from '@/components/lumo/ui/ScrollArea';

const paragraphs = [
	'A pane is scrollable only once it has a height to run out of: the root takes it from its parent, and the viewport fills the root.',
	'The bar is not the box’s own. It is drawn over the content on the inline end, which is why the pane never changes width when the content starts to overflow.',
	'It stays out of sight until it is needed — until the pane is scrolled, or the pointer comes to rest over it — and by then the thumb is where the position is.',
	'Dragging it works, and so does clicking the track: those are the parts worth keeping from a native bar.',
];

export default function Basic() {
	return (
		<div className="w-full max-w-md rounded-lg border bg-muted/40">
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
	);
}
