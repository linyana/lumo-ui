import { Button } from '@/components/lumo/ui/Button';
import { Toast } from '@/components/lumo/ui/Toast';

/** One toast, updated in place: loading, then whatever the promise settles as. */
export default function Saving() {
	const toast = Toast.useToastManager();

	return (
		<Button
			variant="outline"
			onClick={() =>
				toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
					loading: { type: 'loading', title: 'saving changes' },
					success: { type: 'success', title: 'changes saved' },
					error: { type: 'error', title: 'could not save' },
				})
			}
		>
			save
		</Button>
	);
}
