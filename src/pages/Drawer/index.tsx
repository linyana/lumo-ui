import { useState } from 'react';
import { Button } from '@/components/lumo/ui/Button';
import { Drawer } from '@/components/lumo/ui/Drawer';
import { Separator } from '@/components/lumo/ui/Separator';
import { DocPage, DocSection } from '@/pages/DocPage';

export function DrawerPage() {
	const [drawerBox, setDrawerBox] = useState<HTMLDivElement | null>(null);

	return (
		<DocPage title="drawer" description="a panel that slides in from an edge and swipes away">
			<DocSection
				title="two edges"
				note={
					<>
						one popup, four edges: <code>swipeDirection</code> names where the panel
						sits and the way it leaves, so <code>right</code> is a right-hand sheet. the
						drag offset arrives as a css variable, which is why the panel tracks your
						finger without a re-render.
					</>
				}
			>
				<div className="flex flex-wrap gap-2">
					<Drawer.Root>
						<Drawer.Trigger render={<Button variant="outline">bottom sheet</Button>} />
						<Drawer.Portal>
							<Drawer.Backdrop />
							<Drawer.Viewport>
								<Drawer.Popup>
									<Drawer.Content>
										<Drawer.Title>recovery keys</Drawer.Title>
										<Drawer.Description>
											drag the panel down — it follows the pointer and lets go
											once you do.
										</Drawer.Description>
										<Separator className="my-1" />
										<div className="flex flex-col gap-1 text-sm text-muted-foreground">
											<div>alien-bean-pasta</div>
											<div>wild-irish-burrito</div>
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
				</div>
			</DocSection>

			<DocSection
				title="edge swipe and indent"
				note={
					<>
						<code>Provider</code> tells <code>Indent</code> that a drawer inside it is
						open, so the surface holding the button scales back and rounds off. the
						portal is confined to this box, which is why the sheet stays inside it — in
						a real app it renders to the body and covers the screen.
					</>
				}
			>
				<Drawer.Provider>
					<div ref={setDrawerBox} className="relative overflow-hidden rounded-lg border">
						<Drawer.IndentBackground />
						<Drawer.Indent>
							<div className="flex min-h-40 items-center justify-center p-4 text-center">
								<Drawer.Root swipeDirection="right" modal={false}>
									<Drawer.SwipeArea className="absolute inset-y-0 right-0 w-10" />
									<Drawer.Trigger
										render={
											<Button variant="outline" size="sm">
												open, or sweep in from the right edge
											</Button>
										}
									/>
									<Drawer.Portal container={drawerBox}>
										<Drawer.Backdrop className="absolute inset-0" />
										<Drawer.Viewport className="absolute inset-0">
											<Drawer.Popup>
												<Drawer.Content>
													<Drawer.Title>library</Drawer.Title>
													<Drawer.Description>
														the strip on the right edge opens this
														without a click.
													</Drawer.Description>
												</Drawer.Content>
											</Drawer.Popup>
										</Drawer.Viewport>
									</Drawer.Portal>
								</Drawer.Root>
							</div>
						</Drawer.Indent>
					</div>
				</Drawer.Provider>
			</DocSection>
		</DocPage>
	);
}
