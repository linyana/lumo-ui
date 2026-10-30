import { Accordion } from '@/components/ui/accordion';

/** A disabled item on a list that still works: its row is dimmed, and its answer cannot be asked for. */
export default function States() {
	return (
		<Accordion.Root defaultValue={['open']} className="w-full max-w-md">
			<Accordion.Item value="open">
				<Accordion.Header>
					<Accordion.Trigger>
						open, and pressable
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p className="px-3 pb-3 text-sm text-muted-foreground">
						the row answers the pointer and the keyboard, and the answer is here.
					</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="closed">
				<Accordion.Header>
					<Accordion.Trigger>
						closed, and pressable
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p className="px-3 pb-3 text-sm text-muted-foreground">
						pressing it opens it, and the one above closes.
					</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="disabled" disabled>
				<Accordion.Header>
					<Accordion.Trigger>
						disabled
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p className="px-3 pb-3 text-sm text-muted-foreground">
						out of reach, and out of the tab order.
					</p>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	);
}
