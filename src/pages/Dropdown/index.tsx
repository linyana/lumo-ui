import { Code } from '@/components/lumo/ui/Code';
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

const files = ['src/components/lumo/ui/Dropdown.tsx'];

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
	['Dropdown.Root', 'the state', 'one root per menu, or one for many triggers through handle.'],
	[
		'Dropdown.Trigger',
		'the row you click',
		'a button, h-8, with the state layer every control has.',
	],
	['Dropdown.Portal', 'where it is mounted', 'the body, so nothing can clip the popup.'],
	[
		'Dropdown.Positioner',
		'where it points',
		'the offset, the side and the flip, in Base UI’s hands.',
	],
	[
		'Dropdown.Popup',
		'the panel',
		'rounded-lg, bordered, from 90% as it arrives; sized to the row it holds.',
	],
	[
		'Dropdown.Viewport',
		'the sliding window',
		'one popup can hold several panels; the old slides out the way the new came in.',
	],
	['Dropdown.Group', 'a block of rows', 'grouped for the arrow keys as well as the eye.'],
	['Dropdown.GroupLabel', 'its name', 'muted, not focusable.'],
	[
		'Dropdown.Item',
		'one action',
		'highlighted by Base UI, which is what the background follows.',
	],
	['Dropdown.Separator', 'a line between groups', 'mx-1, h-px.'],
];

const hookRows = [
	['data-slot="dropdown-trigger"', 'the row you click', 'data-pressed while the menu is open.'],
	[
		'data-slot="dropdown-popup"',
		'the panel',
		'w-(--popup-width), so a wider panel is wider, not a wider box.',
	],
	['data-highlighted', 'on one item', 'written by Base UI as the keyboard or the pointer moves.'],
	['data-pressed', 'on the trigger', 'the state layer’s hover weight, held while open.'],
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

const usageImport = "import { Dropdown } from '@/components/lumo/ui/Dropdown';";
const usageExample = `<Dropdown.Root>
	<Dropdown.Trigger>share</Dropdown.Trigger>
	<Dropdown.Portal>
		<Dropdown.Positioner sideOffset={8} align="start">
			<Dropdown.Popup>
				<Dropdown.Group>
					<Dropdown.GroupLabel>share</Dropdown.GroupLabel>
					<Dropdown.Item onClick={copyLink}>copy link</Dropdown.Item>
				</Dropdown.Group>
				<Dropdown.Separator />
				<Dropdown.Item>share to social</Dropdown.Item>
			</Dropdown.Popup>
		</Dropdown.Positioner>
	</Dropdown.Portal>
</Dropdown.Root>`;

export function DropdownPage() {
	return (
		<DocPage
			title="dropdown"
			description="actions on a trigger, with groups, separators and one popup many triggers can share"
		>
			<DocPreview path="src/pages/Dropdown/demos/basic.tsx">
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
				<DocInstall
					name="dropdown"
					packages={['@base-ui/react']}
					files={files}
					reaches={['src/lib/cn.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="a trigger, a portal, a positioner, a popup. the positioner is what Base UI moves."
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
				<DocPreview path="src/pages/Dropdown/demos/detached.tsx">
					<Detached />
				</DocPreview>
			</DocSection>

			<DocSection
				title="what is not here"
				note={
					<>
						no rows that check, no rows that nest. Base UI has both —{' '}
						<Mono>CheckboxItem</Mono>, <Mono>RadioItem</Mono> and <Mono>Submenu</Mono> —
						and each is a one-line export and a class away; the dropdown stays the list
						of actions, and navigation rows are <Mono>Menu</Mono>’s job.
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
				note="the root takes Base UI’s props; every other part is a styled element."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Dropdown.Root</Mono> — the state
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
