import { Tabs } from '@/components/lumo/ui/Tabs';

const sizes = ['sm', 'md', 'lg'] as const;
const items = ['overview', 'activity', 'settings'];

export default function Sizes() {
	return (
		<div className="w-full max-w-sm space-y-4">
			{sizes.map((size) => (
				<Tabs.Root key={size} size={size} defaultValue={items[0]!}>
					<Tabs.List>
						{items.map((item) => (
							<Tabs.Tab key={item} value={item}>
								{item}
							</Tabs.Tab>
						))}
						<Tabs.Indicator />
					</Tabs.List>
				</Tabs.Root>
			))}
		</div>
	);
}
