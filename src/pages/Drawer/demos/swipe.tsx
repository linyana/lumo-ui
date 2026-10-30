import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';

/**
 * The portal is confined to this box, which is why the sheet stays inside it — in a real app it
 * renders to the body and covers the screen.
 */
export default function Swipe() {
	const [box, setBox] = useState<HTMLDivElement | null>(null);

	return (
		<Drawer.Provider>
			<div
				ref={setBox}
				className="relative w-full max-w-md overflow-hidden rounded-lg border"
			>
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
							<Drawer.Portal container={box}>
								<Drawer.Backdrop className="absolute inset-0" />
								<Drawer.Viewport className="absolute inset-0">
									<Drawer.Popup>
										<Drawer.Content>
											<Drawer.Title>library</Drawer.Title>
											<Drawer.Description>
												the strip on the right edge opens this without a
												click.
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
	);
}
