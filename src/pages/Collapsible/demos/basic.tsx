import { Collapsible } from '@/components/ui/collapsible';

const keys = ['alien-bean-pasta', 'wild-irish-burrito', 'horse-battery-staple'];

export default function Basic() {
	return (
		<Collapsible.Root className="w-full max-w-sm rounded-lg border">
			<Collapsible.Trigger>
				recovery keys
				<Collapsible.Icon />
			</Collapsible.Trigger>
			<Collapsible.Panel>
				<div className="flex flex-col gap-1 px-3 pt-3 pb-3 font-mono text-sm text-muted-foreground">
					{keys.map((key) => (
						<div key={key}>{key}</div>
					))}
				</div>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
