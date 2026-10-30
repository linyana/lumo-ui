import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

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
