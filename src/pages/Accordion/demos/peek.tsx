import { Accordion } from '@/components/ui/accordion';

const log = [
	'11:02:04  resolve   lumo-ui@latest',
	'11:02:05  install   @base-ui/react, lucide-react',
	'11:02:06  copy      src/components/ui/accordion.tsx',
];

/**
 * A folded panel can keep a height instead of leaving the layout: `peek` is how much of the answer
 * stays visible, so a closed log still shows where it starts. One line of the mono text is 24px.
 */
export default function Peek() {
	return (
		<Accordion.Root className="w-full max-w-md">
			<Accordion.Item value="log">
				<Accordion.Header>
					<Accordion.Trigger>
						what did the install do
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel peek={24}>
					<div className="flex flex-col px-3 pb-3 font-mono text-xs leading-6 text-muted-foreground">
						{log.map((line) => (
							<div key={line}>{line}</div>
						))}
					</div>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="undo">
				<Accordion.Header>
					<Accordion.Trigger>
						and how is it undone
						<Accordion.Icon />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel peek={24}>
					<div className="flex flex-col px-3 pb-3 font-mono text-xs leading-6 text-muted-foreground">
						<div>rm src/components/ui/accordion.tsx</div>
						<div>and the line in registry.json that named it.</div>
					</div>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	);
}
