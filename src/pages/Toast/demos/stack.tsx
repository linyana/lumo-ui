import { Button } from '@/components/lumo/ui/Button';
import { Toast } from '@/components/lumo/ui/Toast';

export default function Stack() {
	const toast = Toast.useToastManager();

	return (
		<Button
			variant="outline"
			onClick={() => {
				for (const title of ['indexing', 'fetching grammar', 'tokenising', 'done']) {
					toast.add({ title });
				}
			}}
		>
			queue four
		</Button>
	);
}
