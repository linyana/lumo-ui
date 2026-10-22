import { Code } from '@/components/lumo/ui/Code';
import type { DocFile } from '@/pages/DocPage';
/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import drawerSource from '@/components/lumo/ui/Drawer.tsx?raw';
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
import Basic from './demos/basic';
import basicSource from './demos/basic.tsx?raw';
import Swipe from './demos/swipe';
import swipeSource from './demos/swipe.tsx?raw';

const files: DocFile[] = [{ path: 'src/components/lumo/ui/Drawer.tsx', code: drawerSource }];

const rootProps: Record<string, PropNode> = {
	swipeDirection: {
		type: '"down" | "up" | "left" | "right"',
		default: '"down"',
		description:
			'Which edge the panel is anchored to, and the way it leaves — right is a right-hand sheet. The popup reads it back off its own data attribute.',
	},
	modal: {
		type: 'boolean',
		default: 'true',
		description:
			'Whether the page behind is inert. Off, a drawer can be left by using the page, which is what an edge swipe wants.',
	},
	snapPoints: {
		type: 'number[]',
		description:
			'Heights it can rest at. Dragging lands on the nearest one, and a snap point is an offset on the same transform the drag uses — so a snap is not a second animation.',
	},
	open: {
		type: 'boolean',
		description: 'The drawer, controlled. Leave it out and the root keeps the state itself.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where it starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, event, reason) => void',
		description: 'Fires on the trigger, on a swipe past the threshold, and on escape.',
	},
};

const partRows = [
	['Drawer.Provider', 'the indent’s state', 'tells Indent that a drawer inside it is open.'],
	['Drawer.IndentBackground', 'what the app reveals', 'sits behind the indent, bg-foreground.'],
	[
		'Drawer.Indent',
		'the app, drawn back',
		'scales to 0.98 and rounds its top while a drawer is open, then returns.',
	],
	['Drawer.Trigger', 'the button that opens it', 'compose a Button through render.'],
	[
		'Drawer.SwipeArea',
		'a strip at the edge',
		'the gesture points into the drawer, so the strip is opposite.',
	],
	[
		'Drawer.Portal',
		'where it is mounted',
		'the body; give it container to keep a demo in its box.',
	],
	['Drawer.Backdrop', 'the dim behind', 'fades with data-starting-style.'],
	['Drawer.Viewport', 'the layer', 'fixed inset-0, so the popup can be anchored to any edge.'],
	['Drawer.Popup', 'the panel', 'radius, border and shadow chosen by swipe direction.'],
	['Drawer.Content', 'the padded column', 'flex column, scrolls, p-6.'],
	['Drawer.Title · Description', 'its name and detail', 'required and announced together.'],
	['Drawer.Close', 'a way out', 'one per exit.'],
];

const hookRows = [
	[
		'data-slot="drawer-popup"',
		'the panel',
		'inset by direction, and translated only by the drag.',
	],
	[
		'data-swipe-direction',
		'down | up | left | right',
		'on the popup, the viewport and the swipe area.',
	],
	[
		'--drawer-swipe-movement-y · -x',
		'the drag so far',
		'read by the popup’s transform, so a drag never re-renders.',
	],
	['--drawer-snap-point-offset', 'the snap it is heading to', 'added to the same transform.'],
	[
		'data-swiping',
		'present mid-drag',
		'transitions off, so the panel tracks the finger exactly.',
	],
	[
		'data-slot="drawer-indent" · -background',
		'the scaled app, and behind it',
		'data-active while a drawer is open.',
	],
	[
		'data-starting-style · data-ending-style',
		'entering / leaving',
		'Base UI’s, so the travel is a class.',
	],
];

const usageImport = "import { Drawer } from '@/components/lumo/ui/Drawer';";
const usageExample = `<Drawer.Root swipeDirection="right">
	<Drawer.Trigger render={<Button>filters</Button>} />
	<Drawer.Portal>
		<Drawer.Backdrop />
		<Drawer.Viewport>
			<Drawer.Popup>
				<Drawer.Content>
					<Drawer.Title>filters</Drawer.Title>
					<Drawer.Description>updated this week</Drawer.Description>
					<Drawer.Close render={<Button>apply</Button>} />
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>`;

export function DrawerPage() {
	return (
		<DocPage title="drawer" description="a panel that slides in from an edge and swipes away">
			<DocPreview name="basic.tsx" source={basicSource}>
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the drag, the threshold and the focus handling are Base UI’s; what
						is here is which edge, what it looks like on the way out, and the drag
						offset arriving as a CSS variable instead of a re-render.
					</>
				}
			>
				<DocInstall
					name="drawer"
					packages={['@base-ui/react']}
					files={files}
					reaches={[{ path: 'src/lib/cn.ts', code: cnSource }]}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						one popup, four edges: <Mono>swipeDirection</Mono> names where the panel
						sits and the way it leaves, so <Mono>right</Mono> is a right-hand sheet.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="edge swipe and indent"
				note={
					<>
						<Mono>Provider</Mono> tells <Mono>Indent</Mono> that a drawer inside it is
						open, so the surface holding the button scales back and rounds off. the
						portal is confined to this box, which is why the sheet stays inside it — in
						a real app it renders to the body and covers the screen.
					</>
				}
			>
				<DocPreview name="swipe.tsx" source={swipeSource}>
					<Swipe />
				</DocPreview>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Drawer.Root</Mono> — the state
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
				note="a drag writes a variable, not a state: the panel follows the pointer and React never renders for it."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
