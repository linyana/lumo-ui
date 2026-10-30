import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { ToggleGroup } from '@/components/ui/toggle-group';

/**
 * One of three. The group holds the value — `left` until something else is pressed — and the arrow
 * keys move between the items, so the row is a single stop in the tab order.
 */
export default function Basic() {
	return (
		<ToggleGroup.Root
			defaultValue={['left']}
			aria-label="alignment"
			size="icon"
			variant="outline"
		>
			<ToggleGroup.Item value="left" aria-label="left">
				<AlignLeft />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center" aria-label="centre">
				<AlignCenter />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="right" aria-label="right">
				<AlignRight />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	);
}
