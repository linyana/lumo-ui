import { Card } from '@/components/ui/card';
import { Code, Copy } from '@/components/ui/code';

const source = [
	"import { clsx, type ClassValue } from 'clsx';",
	"import { twMerge } from 'tailwind-merge';",
	'',
	'/** Merges class names, last one wins. */',
	'export function cn(...inputs: ClassValue[]) {',
	'\treturn twMerge(clsx(inputs));',
	'}',
].join('\n');

export default function Basic() {
	return (
		<Card.Root className="w-full gap-0 overflow-hidden py-0">
			<Card.Header className="min-h-9 border-b border-border/50 px-3 py-1">
				<Card.Title className="font-mono text-xs font-medium">cn.ts</Card.Title>
				<Card.Action>
					<Copy value={source} />
				</Card.Action>
			</Card.Header>
			<Card.Content className="min-w-0 px-0">
				<Code code={source} language="ts" />
			</Card.Content>
		</Card.Root>
	);
}
