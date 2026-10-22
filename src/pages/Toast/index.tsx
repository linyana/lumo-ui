import { Code } from '@/components/lumo/ui/Code';
import { Toast } from '@/components/lumo/ui/Toast';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import toastSource from '@/components/lumo/ui/Toast.tsx?raw';
import spinnerSource from '@/components/lumo/ui/Spinner.tsx?raw';
import cnSource from '@/lib/cn.ts?raw';
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
import Kinds from './demos/kinds';
import kindsSource from './demos/kinds.tsx?raw';
import Saving from './demos/promise';
import promiseSource from './demos/promise.tsx?raw';
import Stack from './demos/stack';
import stackSource from './demos/stack.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Toast.tsx', code: toastSource }];

const toastProps: Record<string, PropNode> = {
	title: {
		type: 'ReactNode',
		description:
			'The line in the medium weight. Left out, the description stands as the whole message and takes the body size.',
	},
	description: {
		type: 'ReactNode',
		description: 'The muted line under it.',
	},
	type: {
		type: 'string',
		description:
			'What happened, and the only thing it decides is the glyph and its ink: success, error, warning, info, loading. Anything else draws no glyph at all.',
	},
	actionProps: {
		type: 'Button props',
		description:
			'An action row inside the toast — a label and an onClick. The toast renders it itself, so a caller that only queued one never comes back to draw it.',
	},
	timeout: {
		type: 'number',
		default: '5000',
		description: 'How long it stays, in milliseconds. 0 keeps it until it is dismissed.',
	},
	priority: {
		type: '"low" | "high"',
		description: 'High toasts are not dropped by the provider’s limit.',
	},
	id: {
		type: 'string',
		description:
			'Give one to update or close a toast later without keeping the returned handle.',
	},
};

const partRows = [
	['Toast.Provider', 'the queue', 'one per app; limit is how many are on screen at once.'],
	[
		'Toast.Toaster',
		'the stack, assembled',
		'provider, portal and viewport with the queue already mapped to parts — the piece nobody should write twice.',
	],
	[
		'Toast.Viewport',
		'the strip it hangs from',
		'fixed, centred, max-w-96; only the toasts take pointer events.',
	],
	[
		'Toast.Root',
		'one toast',
		'positioned and scaled by --toast-index, so the stack is entirely variables.',
	],
	[
		'Toast.Content',
		'the row',
		'glyph, text, action, close; fades when it is behind the frontmost toast.',
	],
	[
		'Toast.Icon',
		'the glyph for the type',
		'the spinner for loading, nothing for an unknown type.',
	],
	['Toast.Title · Description', 'the words', 'default to the toast’s own.'],
	['Toast.Action', 'what it offers', 'a secondary-coloured row, from actionProps.'],
	['Toast.Close', 'the cross', 'size 7, muted until hovered.'],
	['Toast.useToastManager', 'the queue from inside React', 'add, close, promise, update.'],
	[
		'Toast.createToastManager',
		'the same, from outside',
		'pass it to Provider and queue from anywhere.',
	],
];

const hookRows = [
	['data-slot="toast"', 'one toast', 'inset-x-0 top-0, z-index from 100 minus its index.'],
	[
		'--toast-index',
		'its depth in the stack',
		'the whole layout: y, scale and z-index are derived from it.',
	],
	[
		'--toast-frontmost-height',
		'the frontmost toast’s height',
		'collapsed, every toast is clipped to it.',
	],
	[
		'--toast-offset-y · --toast-height',
		'the summed height above it, its own',
		'expanded, each takes its own and unfurls.',
	],
	[
		'data-expanded · data-behind',
		'pointed at / behind the front',
		'the unfurl, and the fade that hides the text showing through.',
	],
	['data-limited', 'past the limit', 'mounted and inert, drawn nowhere.'],
	[
		'data-swipe-direction',
		'on a swiped toast',
		'the exit is the swipe, so the drift-up is dropped.',
	],
	[
		'data-type',
		'success | error | warning | info | loading',
		'what the glyph and the ink are chosen from.',
	],
];

const usageProvider = `<Toast.Provider>
	<App />
	<Toast.Toaster />
</Toast.Provider>`;

const usageCall = `const toast = Toast.useToastManager();

toast.add({ type: 'success', title: 'deployment finished' });`;

export function ToastPage() {
	return (
		<Toast.Provider>
			<DocPage title="toast" description="a message that says itself and gets out of the way">
				<DocPreview name="kinds.tsx" source={kindsSource}>
					<Kinds />
				</DocPreview>

				<DocSection
					title="installation"
					note={
						<>
							Base UI runs the queue and the swipe; what is here is the stack — the
							box that decides where the fourth toast goes — and <Mono>Toaster</Mono>,
							which maps the queue to parts once so no caller does it again.
						</>
					}
				>
					<DocInstall
						name="toast"
						packages={['@base-ui/react', 'lucide-react']}
						files={files}
						reaches={[
							{ path: 'src/components/lumo/ui/Spinner.tsx', code: spinnerSource },
							{ path: 'src/lib/cn.ts', code: cnSource },
						]}
					/>
				</DocSection>

				<DocSection
					title="usage"
					note={
						<>
							the provider and the stack are mounted once, near the root. everything
							else is a call.
						</>
					}
				>
					<div className="space-y-3">
						<Code code={usageProvider} language="tsx" header={false} />
						<Code code={usageCall} language="tsx" header={false} />
					</div>
				</DocSection>

				<DocSection
					title="a promise reports itself"
					note="one toast that is updated in place: loading, then whatever the promise settles as."
				>
					<DocPreview name="promise.tsx" source={promiseSource}>
						<Saving />
					</DocPreview>
				</DocSection>

				<DocSection
					title="the stack"
					note={
						<>
							three is the provider’s limit: the fourth stays mounted but drawn
							nowhere. older toasts wait behind the newest and clip to its height;
							point at the stack and they unfurl to their own.
						</>
					}
				>
					<DocPreview name="stack.tsx" source={stackSource}>
						<Stack />
					</DocPreview>
				</DocSection>

				<DocSection
					title="api reference"
					note={
						<>
							<Mono>toast.add</Mono> takes these; <Mono>toast.promise</Mono> takes one
							set per outcome, and <Mono>toast.close</Mono> an id.
						</>
					}
				>
					<div className="space-y-6">
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								<Mono>toast.add(options)</Mono> — one toast
							</p>
							<PropTable props={toastProps} />
						</div>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">the parts</p>
							<DocTable head={['part', 'is', 'notes']} mono={[0]} rows={partRows} />
						</div>
					</div>
				</DocSection>

				<DocSection
					title="hooks"
					note="the stack is nothing but variables Base UI writes: the depth of a toast decides where it sits, how far back it is drawn and which one is clipped."
				>
					<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
				</DocSection>
			</DocPage>
			<Toast.Toaster />
		</Toast.Provider>
	);
}
