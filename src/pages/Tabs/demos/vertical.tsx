import { Tabs } from '@/components/lumo/ui/Tabs';

export default function Vertical() {
	return (
		<Tabs.Root defaultValue="general" orientation="vertical" className="w-full max-w-sm">
			<Tabs.List>
				<Tabs.Tab value="general">general</Tabs.Tab>
				<Tabs.Tab value="billing" disabled>
					billing
				</Tabs.Tab>
				<Tabs.Tab value="danger">danger zone</Tabs.Tab>
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Panel value="general" className="text-muted-foreground">
				workspace name, url and icon.
			</Tabs.Panel>
			<Tabs.Panel value="danger" className="text-muted-foreground">
				deleting a workspace cannot be undone.
			</Tabs.Panel>
		</Tabs.Root>
	);
}
