import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function States() {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap justify-center gap-3">
				<Button disabled>disabled</Button>
				<Button variant="outline" disabled>
					disabled outline
				</Button>
				<Button variant="ghost" disabled>
					disabled ghost
				</Button>
			</div>
			<div className="flex flex-wrap justify-center gap-3">
				<Button loading>loading</Button>
				<Button variant="outline" icon={<Plus />} loading>
					add
				</Button>
				<Button size="icon" loading aria-label="saving">
					<Plus />
				</Button>
			</div>
		</div>
	);
}
