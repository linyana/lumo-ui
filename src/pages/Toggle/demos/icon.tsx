import { Bold, Italic, Pin } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

/** A glyph alone keeps its name in `aria-label`; `icon` is the square that holds it. */
export default function Icon() {
	return (
		<div className="flex items-center gap-2">
			<Toggle size="icon" aria-label="pin">
				<Pin />
			</Toggle>
			<Toggle size="icon" aria-label="bold" defaultPressed>
				<Bold />
			</Toggle>
			<Toggle variant="outline" size="icon" aria-label="italic">
				<Italic />
			</Toggle>
		</div>
	);
}
