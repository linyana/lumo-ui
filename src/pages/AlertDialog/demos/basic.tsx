import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function Basic() {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="destructive">delete workspace</Button>} />
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup>
						<AlertDialog.Title>
							delete &ldquo;scheduled reports&rdquo;?
						</AlertDialog.Title>
						<AlertDialog.Description>
							two webhooks point at it and will stop firing. every report it has
							already sent stays where it was sent. this cannot be undone.
						</AlertDialog.Description>
						<div className="mt-6 flex justify-end gap-2">
							<AlertDialog.Close render={<Button variant="ghost">keep it</Button>} />
							<AlertDialog.Close
								render={<Button variant="destructive">delete</Button>}
							/>
						</div>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
