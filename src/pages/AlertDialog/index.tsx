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
import Awaiting from './demos/awaiting';
import Basic from './demos/basic';

const files = ['src/components/ui/alert-dialog.tsx'];

const rootProps: Record<string, PropNode> = {
	open: {
		type: 'boolean',
		description: 'The dialog, controlled — the shape a confirm that awaits a request needs.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where it starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, event, reason) => void',
		description:
			'Fires on the trigger, on escape, and on one of the panel’s own buttons — never on a click outside.',
	},
};

const partRows = [
	['AlertDialog.Trigger', 'the button that asks', 'compose a Button through render.'],
	[
		'AlertDialog.Portal',
		'where it is mounted',
		'the body, so no ancestor can clip the backdrop.',
	],
	[
		'AlertDialog.Backdrop',
		'the dim behind',
		'fixed, and not a way out: clicking it does nothing.',
	],
	[
		'AlertDialog.Viewport',
		'the layer it is centred in',
		'fixed inset-0, grid place-items-center-safe and p-4; it scrolls when the panel still does not fit.',
	],
	[
		'AlertDialog.Popup',
		'the panel',
		'the same box a dialog is drawn in — max-w-md, rounded-xl, capped at the viewport — with role="alertdialog" under it.',
	],
	['AlertDialog.Title', 'its name', 'required — Base UI labels the dialog with it.'],
	[
		'AlertDialog.Description',
		'the sentence under it',
		'what the act costs; muted, mt-1.5, and announced with the title.',
	],
	['AlertDialog.Close', 'a way out', 'one per answer — out, and the act itself once it is done.'],
];

const hookRows = [
	[
		'role="alertdialog" · aria-modal',
		'on the panel',
		'Base UI writes them — the one thing this has that a dialog does not.',
	],
	[
		'data-slot="alert-dialog-backdrop"',
		'the dim',
		'fixed; absolute where the iOS 26 viewport would fall short.',
	],
	[
		'data-slot="alert-dialog-viewport"',
		'the centring layer',
		'z-50, above the backdrop and below nothing.',
	],
	[
		'data-slot="alert-dialog-popup"',
		'the panel',
		'carries the scale-in, from --duration-state on --ease-overlay.',
	],
	[
		'data-starting-style · data-ending-style',
		'present while entering / leaving',
		'Base UI’s, so the appearance is a class and not a state.',
	],
];

const usageImport = "import { AlertDialog } from '@/components/ui/alert-dialog';";
const usageExample = `<AlertDialog.Root>
	<AlertDialog.Trigger render={<Button variant="destructive">delete</Button>} />
	<AlertDialog.Portal>
		<AlertDialog.Backdrop />
		<AlertDialog.Viewport>
			<AlertDialog.Popup>
				<AlertDialog.Title>delete this workspace?</AlertDialog.Title>
				<AlertDialog.Description>this cannot be undone.</AlertDialog.Description>
				<AlertDialog.Close render={<Button variant="ghost">keep it</Button>} />
				<AlertDialog.Close render={<Button variant="destructive">delete</Button>} />
			</AlertDialog.Popup>
		</AlertDialog.Viewport>
	</AlertDialog.Portal>
</AlertDialog.Root>`;

export function AlertDialogPage() {
	return (
		<DocPage
			title="alert dialog"
			description="a modal that asks before the act, and takes no for an answer"
		>
			<DocPreview path="src/pages/AlertDialog/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						the same file a dialog is, with a different root under it. Base UI builds
						this one out of that one and drops the two props that make a dialog
						skippable: it is always modal, and a click outside will not close it. what
						is left is a panel whose only exits are its own buttons.
					</>
				}
			>
				<DocInstall
					name="alert-dialog"
					files={files}
					reaches={['src/lib/utils.ts', 'src/lib/surface.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						the four layers are dialog’s: portal, backdrop, viewport, popup. the act
						wears the destructive tier, and the way out is a ghost one — the two tiers a
						button row uses anywhere else.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="an answer that takes a while"
				note={
					<>
						the confirm is a plain button, not a Close: the panel stays until the
						request answers, so a failed revoke leaves the question on screen with the
						reason under it.
					</>
				}
			>
				<DocPreview path="src/pages/AlertDialog/demos/awaiting.tsx">
					<Awaiting />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>AlertDialog.Root</Mono> — the state
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
				note="the layer names come from the dialog it is built on; the role is the one that is this component’s own."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
