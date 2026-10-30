import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Icon() {
	return (
		<>
			<Button icon={<Plus />}>add</Button>
			<Button variant="outline" icon={<Pencil />}>
				edit
			</Button>
			<Button variant="outline" icon={<Trash2 />}>
				delete
			</Button>
			<Button variant="ghost" size="icon" aria-label="search">
				<Search />
			</Button>
		</>
	);
}
