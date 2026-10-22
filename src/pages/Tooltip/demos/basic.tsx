import { Button } from '@/components/lumo/ui/Button';
import { Tooltip } from '@/components/lumo/ui/Tooltip';

export default function Basic() {
	return (
		<Tooltip.Provider delay={300}>
			<Tooltip.Root>
				<Tooltip.Trigger render={<Button variant="outline">hover me</Button>} />
				<Tooltip.Portal>
					<Tooltip.Positioner>
						<Tooltip.Popup>
							a hint, on hover and on focus
							<Tooltip.Arrow />
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger render={<Button variant="ghost">underneath</Button>} />
				<Tooltip.Portal>
					<Tooltip.Positioner side="bottom" align="start">
						<Tooltip.Popup>
							with an arrow, aligned to the start edge
							<Tooltip.Arrow />
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
