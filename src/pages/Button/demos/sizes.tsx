import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sizes() {
	return (
		<>
			<Button size="sm">sm</Button>
			<Button size="md">md</Button>
			<Button size="lg">lg</Button>
			<Button size="icon" aria-label="add">
				<Plus />
			</Button>
		</>
	);
}
