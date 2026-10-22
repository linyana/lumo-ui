import { ScrollArea } from '@/components/lumo/ui/ScrollArea';

const months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];

export default function Both() {
	return (
		<div className="w-full max-w-md rounded-lg border bg-muted/40">
			<ScrollArea.Root className="h-48">
				<ScrollArea.Viewport>
					<ScrollArea.Content className="grid grid-cols-[repeat(2,max-content)] gap-2 p-4 text-sm">
						{months.flatMap((month) => [
							<code key={`${month}-a`} className="px-10">
								{month}
							</code>,
							<code key={`${month}-b`} className="px-10 text-muted-foreground">
								{`${month}.log`}
							</code>,
						])}
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical" />
				<ScrollArea.Scrollbar orientation="horizontal" />
				<ScrollArea.Corner />
			</ScrollArea.Root>
		</div>
	);
}
