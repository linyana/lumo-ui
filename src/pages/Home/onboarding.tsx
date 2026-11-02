import { Bot, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Command } from '@/pages/DocPage';

export const installCommand = 'bunx shadcn@latest add @lumo/button';

export function Onboarding() {
	const options = [
		{
			value: 'agent',
			description: 'Give your agent the Lumo UI instructions',
			command: `Read ${window.location.origin}/skills.md and follow it to build UI with Lumo UI.`,
		},
		{
			value: 'human',
			description: 'Install the Lumo UI skill in your project',
			command: 'bunx skills add linyana/lumo-ui',
		},
	];

	return (
		<Card.Root size="sm" bordered className="min-w-0 py-3">
			<Card.Content className="px-3">
				<Tabs.Root defaultValue="agent" className="gap-5">
					<Tabs.List aria-label="How to get started" className="w-full">
						<Tabs.Tab value="agent" className="flex-1">
							<Bot aria-hidden="true" />
							I'm an Agent
						</Tabs.Tab>
						<Tabs.Tab value="human" className="flex-1">
							<UserRound aria-hidden="true" />
							I'm a Human
						</Tabs.Tab>
						<Tabs.Indicator />
					</Tabs.List>
					<Tabs.Panels>
						{options.map(({ value, description, command }) => (
							<Tabs.Panel
								key={value}
								value={value}
								transition={false}
								className="space-y-4 p-1"
							>
								<p className="px-2 text-center text-sm">{description}</p>
								<Command bordered wrap={value === 'agent'}>
									{command}
								</Command>
							</Tabs.Panel>
						))}
					</Tabs.Panels>
				</Tabs.Root>
				<div className="mt-5 flex justify-center gap-4 pb-1 text-xs text-muted-foreground">
					{['skills.md', 'llms.txt'].map((file) => (
						<a
							key={file}
							href={`/${file}`}
							target="_blank"
							rel="noreferrer"
							className="underline-offset-4 hover:text-foreground hover:underline"
						>
							{file}
						</a>
					))}
				</div>
			</Card.Content>
		</Card.Root>
	);
}
