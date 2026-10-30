import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';

export default function Basic() {
	return (
		<Popover.Root>
			<Popover.Trigger render={<Button variant="outline">open popover</Button>} />
			<Popover.Portal>
				<Popover.Positioner side="bottom" align="start">
					<Popover.Popup>
						<Popover.Arrow />
						<Popover.Title>deploy to production?</Popover.Title>
						<Popover.Description>
							the site rebuilds in about a minute. the previous build stays live until
							the new one answers.
						</Popover.Description>
						<div className="mt-3 flex justify-end gap-2">
							<Popover.Close
								render={
									<Button variant="ghost" size="sm">
										cancel
									</Button>
								}
							/>
							<Popover.Close render={<Button size="sm">deploy</Button>} />
						</div>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}
