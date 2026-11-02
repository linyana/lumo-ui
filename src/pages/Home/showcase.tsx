import { Code } from '@/components/ui/code';
import { Tabs } from '@/components/ui/tabs';
import FieldDemo from '@/pages/Field/demos/basic';
import fieldSource from '@/pages/Field/demos/basic.tsx?raw';
import TabsDemo from '@/pages/Tabs/demos/basic';
import tabsSource from '@/pages/Tabs/demos/basic.tsx?raw';

const examples = [
	{ value: 'fields', label: 'Fields', source: fieldSource, Preview: FieldDemo },
	{ value: 'tabs', label: 'Tabs', source: tabsSource, Preview: TabsDemo },
];

export function Showcase() {
	return (
		<Tabs.Root defaultValue="fields" className="gap-5">
			<Tabs.List aria-label="Code examples">
				{examples.map(({ value, label }) => (
					<Tabs.Tab key={value} value={value}>
						{label}
					</Tabs.Tab>
				))}
				<Tabs.Indicator />
			</Tabs.List>
			{examples.map(({ value, source, Preview }) => (
				<Tabs.Panel key={value} value={value} transition={false}>
					<div className="grid min-w-0 overflow-hidden rounded-xl border lg:grid-cols-2">
						<div className="min-w-0 bg-muted/40">
							<Code
								code={source.trimEnd()}
								language="tsx"
								fileName="example.tsx"
								header
								className="rounded-none"
							/>
						</div>
						<div className="flex min-w-0 flex-col border-t bg-card lg:border-t-0 lg:border-l">
							<p className="border-b px-4 py-3 text-xs text-muted-foreground">Live preview</p>
							<div className="flex min-h-64 flex-1 items-center justify-center p-6 sm:p-8">
								<Preview />
							</div>
						</div>
					</div>
				</Tabs.Panel>
			))}
		</Tabs.Root>
	);
}
