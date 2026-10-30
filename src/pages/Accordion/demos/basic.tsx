import { Accordion } from '@/components/ui/accordion';

export default function Basic() {
	return (
		<Accordion.Root defaultValue={['install']} className="w-full max-w-md">
			<Accordion.Item value="install">
				<Accordion.Header>
					<Accordion.Trigger>
						how is it installed
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p className="px-3 pb-3 text-sm text-muted-foreground">
						one command per component, copied into the project’s own aliases.
					</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="theme">
				<Accordion.Header>
					<Accordion.Trigger>
						can I keep my own colours
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p className="px-3 pb-3 text-sm text-muted-foreground">
						yes — the palette is the only part a project may skip, and its own{' '}
						<code className="font-mono text-xs">--primary</code> is never overwritten.
					</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="version">
				<Accordion.Header>
					<Accordion.Trigger>
						which version does it install
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p className="px-3 pb-3 text-sm text-muted-foreground">
						the latest. no version is ever pinned, here or in the manifest.
					</p>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	);
}
