import type { ReactNode } from 'react';
import { Button } from '@/components/lumo/ui/Button';
import { Popover } from '@/components/lumo/ui/Popover';
import { DocPage, DocSection } from '@/pages/DocPage';

const panelHandle = Popover.createHandle<ReactNode>();
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

export function PopoverPage() {
	return (
		<DocPage title="popover" description="an anchored panel that holds rich content">
			<DocSection
				title="one trigger"
				note={
					<>
						unlike a dialog the page stays interactive behind it, so a click outside
						dismisses it. the arrow reads the side Base UI chose and hangs off that
						edge, carrying the popup's own border and fill.
					</>
				}
			>
				<Popover.Root>
					<Popover.Trigger render={<Button variant="outline">open popover</Button>} />
					<Popover.Portal>
						<Popover.Positioner side="bottom" align="start">
							<Popover.Popup>
								<Popover.Arrow />
								<Popover.Title>deploy to production?</Popover.Title>
								<Popover.Description>
									the site rebuilds in about a minute. the previous build stays
									live until the new one answers.
								</Popover.Description>
								<div className="mt-3 flex justify-end gap-2">
									<Popover.Close
										render={
											<Button variant="ghost" size="sm">
												cancel
											</Button>
										}
									/>
									<Popover.Close render={<Button size="sm">deploy</Button>} />
								</div>
							</Popover.Popup>
						</Popover.Positioner>
					</Popover.Portal>
				</Popover.Root>
			</DocSection>

			<DocSection
				title="one popup, three detached triggers"
				note={
					<>
						no trigger owns the popup — one handle does, and each trigger hands it its
						own payload. the popup itself never unmounts, so moving between triggers
						slides the old panel out the way the new one came in.
					</>
				}
			>
				<div className="flex flex-wrap gap-2">
					{panels.map(({ label, content }) => (
						<Popover.Trigger
							key={label}
							handle={panelHandle}
							payload={content}
							render={
								<Button variant="outline" size="sm">
									{label}
								</Button>
							}
						/>
					))}
				</div>
				<Popover.Root handle={panelHandle}>
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
			</DocSection>
		</DocPage>
	);
}
