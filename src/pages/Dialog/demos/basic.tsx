import { Button } from '@/components/lumo/ui/Button';
import { Dialog } from '@/components/lumo/ui/Dialog';

export default function Basic() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline">open dialog</Button>} />
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup>
						<Dialog.Title>deploy to production?</Dialog.Title>
						<Dialog.Description>
							the site rebuilds in about a minute. the previous build stays live until
							the new one answers.
						</Dialog.Description>
						<div className="mt-6 flex justify-end gap-2">
							<Dialog.Close render={<Button variant="ghost">cancel</Button>} />
							<Dialog.Close render={<Button>deploy</Button>} />
						</div>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
