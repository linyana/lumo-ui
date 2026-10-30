import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

const handle = Tooltip.createHandle<string>();

const hints = [
	{ label: 'play', hint: 'listen to audio preview' },
	{ label: 'timer', hint: 'set a timer' },
	{ label: 'delete', hint: 'delete: this cannot be undone' },
];

export default function Detached() {
	return (
		<Tooltip.Provider delay={300}>
			<div className="flex">
				{hints.map(({ label, hint }) => (
					<Tooltip.Trigger
						key={label}
						handle={handle}
						payload={hint}
						render={
							<Button variant="outline" size="sm">
								{label}
							</Button>
						}
					/>
				))}
			</div>
			<Tooltip.Root handle={handle}>
				{({ payload }) => (
					<Tooltip.Portal>
						<Tooltip.Positioner>
							<Tooltip.Popup>
								<Tooltip.Arrow />
								<Tooltip.Viewport>{payload}</Tooltip.Viewport>
							</Tooltip.Popup>
						</Tooltip.Positioner>
					</Tooltip.Portal>
				)}
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
