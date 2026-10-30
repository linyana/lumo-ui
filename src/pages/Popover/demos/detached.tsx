import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';

const handle = Popover.createHandle<ReactNode>();

const panels: { label: string; content: ReactNode }[] = [
	{
		label: 'notifications',
		content: (
			<>
				<Popover.Title>notifications</Popover.Title>
				<Popover.Description>you are all caught up. good job!</Popover.Description>
			</>
		),
	},
	{
		label: 'activity',
		content: (
			<>
				<Popover.Title>activity</Popover.Title>
				<Popover.Description>nothing interesting happened recently.</Popover.Description>
			</>
		),
	},
	{
		label: 'account',
		content: (
			<>
				<Popover.Title>rika li</Popover.Title>
				<Popover.Description>pro plan</Popover.Description>
				<div className="flex flex-col gap-2 pt-2">
					<a href="#" className="w-fit underline underline-offset-2 hover:no-underline">
						account settings
					</a>
					<a href="#" className="w-fit underline underline-offset-2 hover:no-underline">
						log out
					</a>
				</div>
			</>
		),
	},
];

export default function Detached() {
	return (
		<>
			<div className="flex flex-wrap justify-center gap-2">
				{panels.map(({ label, content }) => (
					<Popover.Trigger
						key={label}
						handle={handle}
						payload={content}
						render={
							<Button variant="outline" size="sm">
								{label}
							</Button>
						}
					/>
				))}
			</div>
			<Popover.Root handle={handle}>
				{({ payload }) => (
					<Popover.Portal>
						<Popover.Positioner sideOffset={8}>
							<Popover.Popup>
								<Popover.Arrow />
								<Popover.Viewport>{payload}</Popover.Viewport>
							</Popover.Popup>
						</Popover.Positioner>
					</Popover.Portal>
				)}
			</Popover.Root>
		</>
	);
}
