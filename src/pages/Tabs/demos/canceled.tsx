import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs } from '@/components/ui/tabs';

export default function Canceled() {
	const [locked, setLocked] = useState(true);

	return (
		<div className="w-full max-w-sm space-y-4">
			<label className="flex items-center gap-2 text-sm">
				<Checkbox.Root checked={locked} onCheckedChange={setLocked}>
					<Checkbox.Indicator />
				</Checkbox.Root>
				Keep the current tab
			</label>
			<Tabs.Root
				defaultValue="draft"
				onValueChange={(_, details) => {
					if (locked && details.reason === 'none') details.cancel();
				}}
			>
				<Tabs.List>
					<Tabs.Tab value="draft">Draft</Tabs.Tab>
					<Tabs.Tab value="preview">Preview</Tabs.Tab>
					<Tabs.Indicator />
				</Tabs.List>
				<Tabs.Panels>
					<Tabs.Panel value="draft">Changes are still being written.</Tabs.Panel>
					<Tabs.Panel value="preview">Ready to preview.</Tabs.Panel>
				</Tabs.Panels>
			</Tabs.Root>
		</div>
	);
}
