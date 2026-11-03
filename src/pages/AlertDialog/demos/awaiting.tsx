import { useState } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function Awaiting() {
	const [open, setOpen] = useState(false);
	const [revoking, setRevoking] = useState(false);

	async function revoke() {
		setRevoking(true);
		await new Promise((resolve) => setTimeout(resolve, 1200));
		setRevoking(false);
		setOpen(false);
	}

	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger render={<Button variant="outline">revoke token</Button>} />
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup>
						<AlertDialog.Title>revoke this token?</AlertDialog.Title>
						<AlertDialog.Description>
							three services sign with it and fail on their next request. the token
							cannot be restored, only replaced.
						</AlertDialog.Description>
						<div className="mt-6 flex justify-end gap-2">
							<AlertDialog.Close render={<Button variant="ghost">keep it</Button>} />
							{/* The confirm is not a Close: the panel stays until the request answers. */}
							<Button variant="destructive" loading={revoking} onClick={revoke}>
								revoke
							</Button>
						</div>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
