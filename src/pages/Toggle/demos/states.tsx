import { Toggle } from '@/components/ui/toggle';

/** Off, on, and the two that cannot be changed: one is dimmed, the other keeps its tint dimmed. */
export default function States() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Toggle>off</Toggle>
			<Toggle defaultPressed>on</Toggle>
			<Toggle variant="outline" disabled>
				disabled
			</Toggle>
			<Toggle variant="outline" disabled defaultPressed>
				on, and disabled
			</Toggle>
		</div>
	);
}
