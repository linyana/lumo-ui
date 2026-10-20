import { Check, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/lumo/ui/Button';

export default function Icon() {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap justify-center gap-3">
				<Button icon={<Plus />}>add</Button>
				<Button variant="outline" icon={<Pencil />}>
					edit
				</Button>
				<Button variant="outline" icon={<Trash2 />}>
					delete
				</Button>
				<Button variant="outline" icon={<Check />}>
					saved
				</Button>
				<Button size="icon" variant="ghost" aria-label="close">
					<X />
				</Button>
				<Button size="icon" variant="ghost" aria-label="search" icon={<Search />} />
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button size="sm" icon={<Plus />}>
					sm
				</Button>
				<Button size="lg" icon={<Plus />}>
					lg
				</Button>
				<Button size="lg" variant="secondary" icon={<Plus />}>
					lg secondary
				</Button>
			</div>
		</div>
	);
}
