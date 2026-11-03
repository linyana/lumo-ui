import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard } from '@/components/ui/hover-card';

export default function Basic() {
	return (
		<div className="flex flex-wrap items-center gap-3 text-sm">
			<Avatar.Root>
				<Avatar.Fallback>L</Avatar.Fallback>
			</Avatar.Root>
			<HoverCard.Root>
				<HoverCard.Trigger
					render={
						<button
							type="button"
							className="font-medium underline decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground"
						/>
					}
				>
					Linyana
				</HoverCard.Trigger>
				<HoverCard.Portal>
					<HoverCard.Positioner side="bottom" align="start">
						<HoverCard.Popup>
							<HoverCard.Arrow />
							<div className="flex items-center gap-3">
								<Avatar.Root size="lg">
									<Avatar.Fallback>L</Avatar.Fallback>
								</Avatar.Root>
								<div className="min-w-0">
									<p className="text-sm font-medium">Linyana</p>
									<p className="text-xs text-muted-foreground">@linyana</p>
								</div>
							</div>
							<p className="mt-3 text-sm text-muted-foreground">
								maintains lumo-ui. builds small tools that stay small, and writes
								the manual before the component.
							</p>
							<Button size="sm" className="mt-3 w-full">
								follow
							</Button>
						</HoverCard.Popup>
					</HoverCard.Positioner>
				</HoverCard.Portal>
			</HoverCard.Root>
			<span className="text-muted-foreground">rested on the name a moment ago</span>
		</div>
	);
}
