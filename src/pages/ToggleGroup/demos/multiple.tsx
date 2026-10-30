import { Bold, Italic, Underline } from 'lucide-react';
import { ToggleGroup } from '@/components/ui/toggle-group';

/** `multiple` lets several of them stay down: a set of switches rather than a choice between them. */
export default function Multiple() {
	return (
		<ToggleGroup.Root multiple defaultValue={['bold']} aria-label="formatting" size="icon">
			<ToggleGroup.Item value="bold" aria-label="bold">
				<Bold />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="italic">
				<Italic />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="underline">
				<Underline />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	);
}
