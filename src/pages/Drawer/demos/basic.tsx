import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

const keys = ['alien-bean-pasta', 'wild-irish-burrito'];

export default function Basic() {
	return (
		<>
			<Drawer.Root>
				<Drawer.Trigger render={<Button variant="outline">bottom sheet</Button>} />
				<Drawer.Portal>
					<Drawer.Backdrop />
					<Drawer.Viewport>
						<Drawer.Popup>
							<Drawer.Content>
								<Drawer.Title>recovery keys</Drawer.Title>
								<Drawer.Description>
									drag the panel down — it follows the pointer and lets go once
									you do.
								</Drawer.Description>
								<Separator className="my-1" />
								<div className="flex flex-col gap-1 text-sm text-muted-foreground">
									{keys.map((key) => (
										<div key={key}>{key}</div>
									))}
								</div>
								<div className="mt-4 flex justify-end gap-2">
									<Drawer.Close
										render={<Button variant="ghost">cancel</Button>}
									/>
									<Drawer.Close render={<Button>done</Button>} />
								</div>
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
			<Drawer.Root swipeDirection="right">
				<Drawer.Trigger render={<Button variant="outline">side panel</Button>} />
				<Drawer.Portal>
					<Drawer.Backdrop />
					<Drawer.Viewport>
						<Drawer.Popup>
							<Drawer.Content>
								<Drawer.Title>filters</Drawer.Title>
								<Drawer.Description>
									the same popup, anchored to another edge.
								</Drawer.Description>
								<Separator className="my-1" />
								<div className="flex flex-col gap-2 text-sm">
									<div>only my drafts</div>
									<div>updated this week</div>
								</div>
								<div className="mt-4">
									<Drawer.Close
										render={<Button className="w-full">apply</Button>}
									/>
								</div>
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	);
}
