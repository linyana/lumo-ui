import { Tabs } from '@/components/ui/tabs';

const variants = ['rounded', 'square', 'point'] as const;
const items = ['overview', 'activity', 'settings'];

export default function Variants() {
	return (
		<div className="w-full max-w-sm space-y-6">
			{variants.map((variant) => (
				<Tabs.Root key={variant} variant={variant} defaultValue={items[0]!}>
					<Tabs.List>
						{items.map((item) => (
							<Tabs.Tab key={item} value={item}>
								{item}
							</Tabs.Tab>
						))}
						<Tabs.Indicator />
					</Tabs.List>
					<Tabs.Panel value={items[0]!} className="text-muted-foreground">
						variant=&quot;{variant}&quot;
					</Tabs.Panel>
				</Tabs.Root>
			))}
		</div>
	);
}
