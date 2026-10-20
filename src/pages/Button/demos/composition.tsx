import { Button } from '@/components/lumo/ui/Button';
import { Dialog } from '@/components/lumo/ui/Dialog';

export default function Composition() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline">open dialog</Button>} />
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup>
						<Dialog.Title>drawn by a button</Dialog.Title>
						<Dialog.Description>
							the trigger is a lumo button, passed through render.
						</Dialog.Description>
						<div className="mt-6 flex justify-end gap-2">
							<Dialog.Close render={<Button variant="ghost">cancel</Button>} />
							<Dialog.Close render={<Button>confirm</Button>} />
						</div>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
