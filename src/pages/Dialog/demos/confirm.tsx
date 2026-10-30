import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export default function Confirm() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="destructive">delete workspace</Button>} />
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup>
						<Dialog.Title>delete &ldquo;scheduled reports&rdquo;?</Dialog.Title>
						<Dialog.Description>
							two webhooks point at it and will stop firing. this cannot be undone.
						</Dialog.Description>
						<div className="mt-6 flex justify-end gap-2">
							<Dialog.Close render={<Button variant="ghost">keep it</Button>} />
							<Dialog.Close render={<Button variant="destructive">delete</Button>} />
						</div>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
