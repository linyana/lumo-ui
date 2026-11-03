import { HoverCard } from '@/components/ui/hover-card';

export default function Link() {
	return (
		<p className="max-w-md text-sm leading-relaxed text-muted-foreground">
			the manifest is not written by hand — it is read off{' '}
			<HoverCard.Root>
				{/* The trigger is an anchor, which is what Base UI renders without a `render` prop. */}
				<HoverCard.Trigger
					href="#registry.json"
					className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
				>
					registry.json
				</HoverCard.Trigger>
				<HoverCard.Portal>
					<HoverCard.Positioner side="top" align="start">
						<HoverCard.Popup>
							<p className="text-sm font-medium">registry.json</p>
							<p className="mt-1.5 text-sm text-muted-foreground">
								one item per component, one file per item, and no target: where a
								file lands is the cli&rsquo;s decision, from its type and the
								consumer&rsquo;s own aliases.
							</p>
						</HoverCard.Popup>
					</HoverCard.Positioner>
				</HoverCard.Portal>
			</HoverCard.Root>{' '}
			and the code it points at.
		</p>
	);
}
