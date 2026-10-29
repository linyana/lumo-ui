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
import Group from './demos/group';

const files = ['src/components/lumo/ui/Avatar.tsx'];

const rootProps: Record<string, PropNode> = {
	size: {
		type: '"sm" | "md" | "lg"',
		default: '"md"',
		description:
			'24, 32 or 40px. The initials inside take their size from it, so the three steps are the whole scale a row ever needs.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(); a square avatar or a ring belongs here, on the circle itself.',
	},
	'...props': {
		type: 'Base UI AvatarRoot props',
		description: 'render and the span’s own attributes.',
	},
};

const imageProps: Record<string, PropNode> = {
	src: {
		type: 'string',
		description: 'The picture. Base UI only draws it once it has decoded.',
	},
	alt: {
		type: 'string',
		description:
			'An empty string when a name is written beside it: the picture repeats what the row already says, and a screen reader should hear it once.',
	},
	keepMounted: {
		type: 'boolean',
		default: 'false',
		description:
			'Stays in the DOM while it loads and after it fails, for a router that optimises images. Without it the element leaves, and the fallback is what remains.',
	},
	onLoadingStatusChange: {
		type: "(status: 'idle' | 'loading' | 'loaded' | 'error') => void",
		description: 'For a caller that has to know whether the picture landed.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(); the crop is `object-cover`, which is almost never overridden.',
	},
};

const fallbackProps: Record<string, PropNode> = {
	delay: {
		type: 'number',
		default: '0',
		description:
			'Milliseconds to wait before drawing. A cached picture lands within a frame, and initials that flashed for that frame are worse than an empty circle.',
	},
	className: {
		type: 'string',
		description: 'Merged last through cn(); the ink and the size of the initials are set here.',
	},
};

const partRows = [
	[
		'Avatar.Root',
		'the circle',
		'a `<span>` that crops whatever is inside it and holds the size.',
	],
	[
		'Avatar.Image',
		'the picture',
		'drawn only once it has decoded, so the fallback under it is never a flash of nothing.',
	],
	[
		'Avatar.Fallback',
		'the stand-in',
		'initials, a glyph or a count; Base UI takes it off screen the moment the picture lands.',
	],
	[
		'Avatar.Group',
		'the row',
		'overlaps them by 8px and gives each the page’s own colour as a ring, so the seam is a gap of background rather than a border.',
	],
];

const hookRows = [
	[
		'data-slot="avatar" · "-image" · "-fallback" · "-group"',
		'the four parts',
		'one element each; the group’s children are found by the first.',
	],
	[
		'data-size',
		'the size',
		'mirrored onto the circle, so a project can target one step from plain CSS.',
	],
	[
		'data-loading · data-error',
		'the picture',
		'while it decodes and once it has failed. The fallback is on screen the whole time either way.',
	],
	[
		'data-starting-style · data-ending-style',
		'the fade',
		'the picture arrives over `--duration-state` instead of appearing, which is the only motion an avatar has.',
	],
	[
		'overflow-hidden · rounded-full',
		'the crop',
		'a picture is square and the circle is not, so the box cuts it rather than the image being resized.',
	],
];

const usageImport = "import { Avatar } from '@/components/lumo/ui/Avatar';";
const usageExample = `<Avatar.Root>
	<Avatar.Image src={user.avatar} alt="" />
	<Avatar.Fallback delay={600}>{initialsOf(user.name)}</Avatar.Fallback>
</Avatar.Root>`;

export function AvatarPage() {
	return (
		<DocPage title="avatar" description="a picture, or the initials standing in for one">
			<DocPreview path="src/pages/Avatar/demos/basic.tsx">
				<Basic />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						one file and Base UI’s avatar, which is the part that is not styling: it
						waits for the image to decode, decides which child is on screen, and takes
						the fallback away once the picture has landed.
					</>
				}
			>
				<DocInstall
					name="avatar"
					packages={['@base-ui/react', 'tailwind-variants']}
					files={files}
					reaches={['src/lib/cn.ts', 'src/lib/control.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note={
					<>
						both children are always written: the picture may fail, and the fallback
						never knows in advance whether it will be needed. <Mono>delay</Mono> is the
						one number worth thinking about — a picture that is already cached would
						otherwise flash its own initials.
					</>
				}
			>
				<div className="space-y-3">
					<Code code={usageImport} language="tsx" header={false} />
					<Code code={usageExample} language="tsx" header={false} />
				</div>
			</DocSection>

			<DocSection
				title="a row of them"
				note={
					<>
						the overlap is a negative margin and the seam is each circle’s own ring in
						the page colour, so a group is one shape with the background showing through
						— not four circles with three borders between them. the last one carries the
						count, because a row of faces stops being readable long before it stops
						being possible.
					</>
				}
			>
				<DocPreview path="src/pages/Avatar/demos/group.tsx">
					<Group />
				</DocPreview>
			</DocSection>

			<DocSection
				title="initials are a fallback, not a design"
				note={
					<>
						the circle is <Mono>bg-muted</Mono> with <Mono>text-muted-foreground</Mono>{' '}
						ink, the same pair every empty surface in the library uses. it is meant to
						be quieter than a picture, so a row of names reads as a list of people
						rather than as a row of coloured tiles, and no per-person colour is invented
						to tell them apart.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					one or two characters is the whole budget: <Mono>MQ</Mono>, or a single CJK
					character. a glyph is the third option — <Mono>User</Mono> from lucide, sized
					from the text around it — for an account that has no name yet.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="four parts, and the size is the only prop the library adds."
			>
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Avatar.Root</Mono> — the circle
						</p>
						<PropTable props={rootProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Avatar.Image</Mono> — the picture
						</p>
						<PropTable props={imageProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							<Mono>Avatar.Fallback</Mono> — the stand-in
						</p>
						<PropTable props={fallbackProps} />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">the parts</p>
						<DocTable
							head={['part', 'what it is', 'notes']}
							mono={[0]}
							rows={partRows}
						/>
					</div>
				</div>
			</DocSection>

			<DocSection
				title="hooks"
				note="the loading state is Base UI's, and it is a state of the picture rather than of the circle."
			>
				<DocTable head={['hook', 'value', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
