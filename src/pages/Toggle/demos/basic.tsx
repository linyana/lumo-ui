import { Bell, Pin } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

/**
 * Two tiers, two states: `ghost` is a word until it is on, `outline` is drawn either way. Its glyph
 * is an ordinary child, so it takes its size from the text beside it.
 */
export default function Basic() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Toggle defaultPressed>
				<Pin />
				pinned
			</Toggle>
			<Toggle>
				<Bell />
				notify me
			</Toggle>
			<Toggle variant="outline" defaultPressed>
				public
			</Toggle>
			<Toggle variant="outline">archived</Toggle>
		</div>
	);
}
