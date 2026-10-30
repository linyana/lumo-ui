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
import Detached from './demos/detached';

const files = ['src/components/ui/menu.tsx'];

const rootProps: Record<string, PropNode> = {
	open: {
		type: 'boolean',
		description: 'The menu, controlled. Leave it out and the root keeps the state itself.',
	},
	defaultOpen: {
		type: 'boolean',
		default: 'false',
		description: 'Where it starts, uncontrolled.',
	},
	onOpenChange: {
		type: '(open: boolean, event, reason) => void',
		description: 'Fires on the trigger, on a click outside, and on escape.',
	},
	modal: {
		type: 'boolean',
		default: 'true',
		description:
			'Whether the page behind is inert while the menu is open. Off, the menu follows a scroll of the page it belongs to — which is what a menu on a long page wants.',
	},
	loop: {
		type: 'boolean',
		default: 'true',
		description: 'Whether arrow keys wrap at the ends.',
	},
};

const partRows = [
	['Menu.Root', 'the state', 'one root per menu, or one for many triggers through handle.'],
	['Menu.Trigger', 'the button that opens it', 'compose a Button through render.'],
	['Menu.Portal', 'where it is mounted', 'the body, so nothing can clip the popup.'],
	[
		'Menu.Positioner',
		'where it points',
		'the offset, the side and the flip, in Base UI’s hands.',
	],
	[
		'Menu.Popup',
		'the panel',
		'rounded-lg, bordered, from 90% as it arrives; sized to the row it holds.',
	],
	[
		'Menu.Viewport',
		'the sliding window',
		'one popup can hold several panels; the old slides out the way the new came in.',
	],
	['Menu.Group', 'a block of rows', 'grouped for the arrow keys as well as the eye.'],
	['Menu.GroupLabel', 'its name', 'muted, not focusable.'],
	['Menu.Item', 'one action', 'highlighted by Base UI, which is what the background follows.'],
	['Menu.Separator', 'a line between groups', 'mx-1, h-px.'],
];

const hookRows = [
	[
		'data-slot="menu-popup"',
		'the panel',
		'w-(--popup-width), so a wider panel is wider, not a wider box.',
	],
	['data-highlighted', 'on one item', 'written by Base UI as the keyboard or the pointer moves.'],
	['data-pressed', 'on the trigger', 'Base UI’s, so the composed Button holds its hover weight.'],
	[
		'data-starting-style · data-ending-style',
		'entering / leaving',
		'scale-90 and opacity-0; data-instant drops the travel.',
	],
	[
		'--popup-width · --popup-height',
		'the current panel’s size',
		'set by the viewport, so the popup eases between panels.',
	],
	[
		'data-activation-direction',
		'left | right | up | down',
		'on the viewport; which way the panels slide.',
	],
];

const usageImport = `import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/menu';`;
const usageExample = `<Menu.Root>
	<Menu.Trigger render={<Button variant="outline" size="sm">share</Button>} />
	<Menu.Portal>
		<Menu.Positioner sideOffset={8} align="start">
			<Menu.Popup>
				<Menu.Group>
					<Menu.GroupLabel>share</Menu.GroupLabel>
					<Menu.Item onClick={copyLink}>copy link</Menu.Item>
				</Menu.Group>
				<Menu.Separator />
				<Menu.Item>share to social</Menu.Item>
			</Menu.Popup>
		</Menu.Positioner>
	</Menu.Portal>
</Menu.Root>`;

export function MenuPage() {
	return (
		<DocPage
			title="menu"
			description="actions on a trigger, with groups, separators and one popup many triggers can share"
		>
			<DocPreview path="src/pages/Menu/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file. the keyboard, the flip, the dismissal and the typeahead are Base
						UI’s; what is here is the surface and the row.
					</>
				}
			>
				<DocInstall name="menu" files={files} reaches={['src/lib/utils.ts']} />
			</DocSection>

			<DocSection
				title="usage"
				note="a trigger, a portal, a positioner, a popup. the trigger carries no appearance of its own, so a Button composes into it; the positioner is what Base UI moves."
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="one popup, three triggers"
				note={
					<>
						no trigger owns the popup — one <Mono>handle</Mono> does, and each trigger
						hands it its own payload. the popup never unmounts, so moving between
						triggers slides the old panel out the way the new one came in, and the box
						eases from one width to the other.
					</>
				}
			>
				<DocPreview path="src/pages/Menu/demos/detached.tsx">
					<Detached />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what is not here"
				note={
					<>
						no rows that check, no rows that nest. Base UI has both —{' '}
						<Mono>CheckboxItem</Mono>, <Mono>RadioItem</Mono> and <Mono>Submenu</Mono> —
						and each is a one-line export and a class away; the menu stays the list of
						actions, and navigation rows are <Mono>Menu</Mono>’s job.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					an <Mono>Item</Mono> closes the menu when it is chosen. Give it{' '}
					<Mono>closeOnClick={'{false}'}</Mono> to keep it open, which is what a row with
					a switch of its own would need.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the root takes Base UI’s props; the trigger is Base UI’s own, and every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Menu.Root</Mono> — the state
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
				note="the popup’s size is a variable the viewport sets, which is how one box holds panels of different widths."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
