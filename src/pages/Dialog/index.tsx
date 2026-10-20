import { Button } from '@/components/lumo/Button';
import { Dialog } from '@/components/lumo/Dialog';
import { DocPage, DocSection } from '@/pages/DocPage';

export function DialogPage() {
	return (
		<DocPage title="dialog" description="modal dialog, behaviour from Base UI">
			<DocSection
				title="a modal dialog"
				note={
					<>
						behaviour from Base UI, appearance from tokens. nothing about this look is
						hardcoded — the backdrop, the radius and the shadow all read the theme.
					</>
				}
			>
				<Dialog.Root>
					<Dialog.Trigger render={<Button variant="outline">open dialog</Button>} />
					<Dialog.Portal>
						<Dialog.Backdrop />
						<Dialog.Viewport>
							<Dialog.Popup>
								<Dialog.Title>lumo-ui dialog</Dialog.Title>
								<Dialog.Description>
									behaviour from Base UI, appearance from tokens. nothing about
									this look is hardcoded.
								</Dialog.Description>
								<div className="mt-6 flex justify-end gap-2">
									<Dialog.Close
										render={<Button variant="ghost">cancel</Button>}
									/>
									<Dialog.Close render={<Button>confirm</Button>} />
								</div>
							</Dialog.Popup>
						</Dialog.Viewport>
					</Dialog.Portal>
				</Dialog.Root>
			</DocSection>
		</DocPage>
	);
}
