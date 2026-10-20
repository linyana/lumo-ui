import { Button } from '@/components/lumo/ui/Button';
import { Tooltip } from '@/components/lumo/ui/Tooltip';
import { DocPage, DocSection } from '@/pages/DocPage';

const hintHandle = Tooltip.createHandle<string>();

const hints = [
	{ label: 'play', hint: 'Listen to audio preview' },
	{ label: 'timer', hint: 'Set a timer' },
	{ label: 'delete', hint: 'Delete: this action cannot be undone' },
];

export function TooltipPage() {
	return (
		<DocPage title="tooltip" description="hover and focus hint anchored to its trigger">
			<DocSection
				title="one trigger"
				note={
					<>
						behaviour from Base UI, appearance from tokens. hovering only ever previews;
						the same hint is announced on keyboard focus.
					</>
				}
			>
				<Tooltip.Provider delay={300}>
					<div className="flex flex-wrap items-center gap-3">
						<Tooltip.Root>
							<Tooltip.Trigger render={<Button variant="outline">hover me</Button>} />
							<Tooltip.Portal>
								<Tooltip.Positioner>
									<Tooltip.Popup>
										behaviour from Base UI, appearance from tokens
										<Tooltip.Arrow />
									</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger render={<Button variant="ghost">bottom</Button>} />
							<Tooltip.Portal>
								<Tooltip.Positioner side="bottom" align="start">
									<Tooltip.Popup>
										with an arrow, aligned to the start edge
										<Tooltip.Arrow />
									</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						</Tooltip.Root>
					</div>
				</Tooltip.Provider>
			</DocSection>

			<DocSection
				title="one popup, three triggers"
				note={
					<>
						hover straight across the row: the popup glides to the next trigger, its
						content slides out the way it came, and the width animates instead of
						jumping. that is{' '}
						<code className="rounded bg-muted px-1 py-0.5">Viewport</code>.
					</>
				}
			>
				<Tooltip.Provider delay={300}>
					<div className="flex">
						{hints.map(({ label, hint }) => (
							<Tooltip.Trigger
								key={label}
								handle={hintHandle}
								payload={hint}
								render={
									<Button variant="outline" size="sm">
										{label}
									</Button>
								}
							/>
						))}
					</div>
					<Tooltip.Root handle={hintHandle}>
						{({ payload }) => (
							<Tooltip.Portal>
								<Tooltip.Positioner>
									<Tooltip.Popup>
										<Tooltip.Arrow />
										<Tooltip.Viewport>{payload}</Tooltip.Viewport>
									</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						)}
					</Tooltip.Root>
				</Tooltip.Provider>
			</DocSection>
		</DocPage>
	);
}
