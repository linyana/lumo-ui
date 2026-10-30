import { Code } from '@/components/ui/code';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Basic from './demos/basic';
import Confirm from './demos/confirm';

const files = ['src/components/ui/dialog.tsx'];

const rootProps: Record<string, PropNode> = {
	open: {
		type: 'boolean',
		description: 'The dialog, controlled. Leave it out and the root keeps the state itself.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where it starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, event, reason) => void',
		description: 'Fires on the trigger, on escape, and on a click in the backdrop.',
	},
	modal: {
		type: 'boolean',
		default: 'true',
		description:
			'Whether the page behind is inert. Off, the page stays usable and the dialog can be left by clicking through.',
	},
};

const partRows = [
	['Dialog.Trigger', 'the button that opens it', 'compose a Button through render.'],
	['Dialog.Portal', 'where it is mounted', 'the body, so no ancestor can clip the backdrop.'],
	['Dialog.Backdrop', 'the dim behind', 'fixed, black at 50%, fading with data-starting-style.'],
	[
		'Dialog.Viewport',
		'the layer it is centred in',
		'fixed inset-0, grid place-items-center-safe and p-4; it scrolls when a popup that brought its own height still does not fit.',
	],
	[
		'Dialog.Popup',
		'the panel',
		'max-w-md, rounded-xl, bordered and shadowed; capped at the viewport and scrolling inside it, so a long form never runs off the top; scales from 95% as it arrives.',
	],
	['Dialog.Title', 'its name', 'required — Base UI labels the dialog with it.'],
	['Dialog.Description', 'the sentence under it', 'muted, mt-1.5, and announced with the title.'],
	['Dialog.Close', 'a way out', 'one per exit; render a Button into it.'],
];

const hookRows = [
	[
		'data-slot="dialog-backdrop"',
		'the dim',
		'fixed; absolute where the iOS 26 viewport would fall short.',
	],
	[
		'data-slot="dialog-viewport"',
		'the centring layer',
		'z-50, above the backdrop and below nothing.',
	],
	[
		'data-slot="dialog-popup"',
		'the panel',
		'carries the scale-in, from --duration-state on --ease-overlay.',
	],
	[
		'data-starting-style · data-ending-style',
		'present while entering / leaving',
		'Base UI’s, so the appearance is a class and not a state.',
	],
	['role="dialog" · aria-modal', 'on the panel', 'Base UI writes them; the title names it.'],
	[
		'data-slot="dialog-title" · description',
		'the label and its detail',
		'text-base font-semibold, and muted under it.',
	],
	[
		':focus-visible',
		'—',
		'the ring, declared once in lumo-tokens.css — the popup traps focus itself.',
	],
];

const usageImport = "import { Dialog } from '@/components/ui/dialog';";
const usageExample = `<Dialog.Root>
	<Dialog.Trigger render={<Button>open</Button>} />
	<Dialog.Portal>
		<Dialog.Backdrop />
		<Dialog.Viewport>
			<Dialog.Popup>
				<Dialog.Title>deploy to production?</Dialog.Title>
				<Dialog.Description>it rebuilds in about a minute.</Dialog.Description>
				<Dialog.Close render={<Button>cancel</Button>} />
			</Dialog.Popup>
		</Dialog.Viewport>
	</Dialog.Portal>
</Dialog.Root>`;

export function DialogPage() {
	return (
		<DocPage title="dialog" description="modal dialog, behaviour from Base UI">
			<DocPreview path="src/pages/Dialog/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file; the parts are Base UI’s with a surface put on. focus trapping,
						escape, scroll lock and the portalled stack are all its own — nothing here
						would know how to reimplement them.
					</>
				}
			>
				<DocInstall name="dialog" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the four layers are not optional: portal, backdrop, viewport, popup. a
						dialog rendered in place would be clipped by whatever its trigger sits in.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a question before the act"
				note={
					<>
						the destructive button wears the destructive tier and the way out is a ghost
						one — the same two tiers a button row uses anywhere else, so nothing about
						the dialog has to be learned twice.
					</>
				}
			>
				<DocPreview path="src/pages/Dialog/demos/confirm.tsx">
					<Confirm />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Dialog.Root</Mono> — the state
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="a dialog is a page of its own for the length of its stay: the hooks say which layer you are styling."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
