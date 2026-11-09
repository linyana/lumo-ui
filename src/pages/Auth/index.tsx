/* oxlint-disable import/default -- `?raw` is Vite handing over the file's text; the plugin resolves the module the path names, which has no default export */
import {
	DocInstall,
	DocLink,
	DocPage,
	DocPreview,
	DocSection,
	DocTable,
	DocUsage,
	Mono,
	PropTable,
	type PropNode,
} from '@/pages/DocPage';
import Aside from './demos/aside';
import SignIn from './demos/sign-in';

const files = [
	'src/components/blocks/auth/index.tsx',
	'src/components/blocks/auth/planet/index.tsx',
	'src/components/blocks/auth/planet/piece.ts',
];

const authProps: Record<string, PropNode> = {
	title: {
		required: true,
		type: 'ReactNode',
		description:
			'The form’s own name, beside the mark — the one heading on the screen, drawn as the h1.',
	},
	description: {
		type: 'ReactNode',
		description: 'One line under the title, saying what the form is for.',
	},
	logo: {
		type: 'ReactNode',
		description:
			'The mark before the title, sized by the caller: an img, a glyph, a monogram. Nothing is drawn when it is absent, and the title takes the row.',
	},
	footer: {
		type: 'ReactNode',
		description:
			'Under the form: the way to the other anonymous screen, a reset, a policy line. The frame sets its type; the content is yours.',
	},
	aside: {
		type: 'ReactNode',
		description:
			'What fills the panel beside the form, in place of the artwork — a photograph, a brand, a statement at full strength. The form keeps its own column either way.',
	},
	headline: {
		type: 'ReactNode',
		description:
			'The panel’s own words, over the artwork’s foot. Nothing is written there by default, because what a screen says is the screen’s business.',
	},
	note: {
		type: 'ReactNode',
		description: 'The line under the headline, drawn small and one step back.',
	},
	className: {
		type: 'string',
		description:
			'Merged last through cn(), onto the frame. A card supplies its own height here — min-h-0 with it — because the frame fills the page by default.',
	},
	'...props': {
		type: 'HTMLDivElement props',
		description: 'The frame is a div: id, data-*, aria-* all land on it.',
	},
};

const hookRows = [
	[
		'data-slot="auth"',
		'the frame',
		'a grid, @container, and min-h-svh: the panel switches on the frame’s own width, not the window’s.',
	],
	[
		'data-slot="auth-panel"',
		'the panel',
		'm-3, rounded-xl, bg-scene-background — hidden until the frame is 36rem wide.',
	],
	[
		'data-slot="auth-artwork"',
		'the canvas box',
		'the planet, drawn at the box’s device resolution; the box breaks out of the panel’s padding.',
	],
	[
		'data-slot="auth-panel-words"',
		'headline and note',
		'the panel’s own type, held to the foot.',
	],
	['data-slot="auth-main"', 'the form column', 'm-3, with the form centred in whatever is left.'],
	['data-slot="auth-head"', 'mark, title, description', 'the one heading block on the screen.'],
	['data-slot="auth-body"', 'the form', 'mt-8 below the head; the stack itself is Form’s.'],
	['data-slot="auth-footer"', 'under the form', 'mt-8, in the page’s muted text.'],
];

const usageImport = "import { AuthLayout } from '@/components/blocks/auth';";
const usageExample = `<AuthLayout
	logo={<img src="/logo.svg" alt="" className="size-8" />}
	title="Sign in"
	description="Welcome back."
	footer={<>No account? <a href="/register">Create one</a></>}
	headline="Good things start here."
>
	<Form onFormSubmit={signIn}>…</Form>
</AuthLayout>`;

export function AuthPage() {
	return (
		<DocPage
			title="auth layout"
			description="the frame the anonymous screens stand in: a form, and a world beside it"
		>
			<DocPreview path="src/pages/Auth/demos/sign-in.tsx">
				<SignIn />
			</DocPreview>

			<DocSection
				title="installation"
				note={
					<>
						three files: the frame, and the scene it draws in its panel. the frame
						reaches for <Mono>cn()</Mono> and nothing else — the form comes from{' '}
						<DocLink to="/form">Form</DocLink>, and the fields from{' '}
						<DocLink to="/field">Field</DocLink>.
					</>
				}
			>
				<DocInstall
					name="auth"
					files={files}
					note={
						<>
							copies <Mono>auth/</Mono> — the frame and the scene in its panel. the
							form beside it is yours, built from whatever the project already has.
						</>
					}
					copyNote={
						<>
							the panel’s artwork is a canvas and the scene behind it is arithmetic,
							so the block installs no drawing library. it is adapted from{' '}
							<Mono>ascii.rest</Mono>, MIT licensed, and that license travels in{' '}
							<Mono>planet/piece.ts</Mono> because a project copying the file keeps
							it.
						</>
					}
					reaches={['src/lib/utils.ts']}
				/>
			</DocSection>

			<DocSection
				title="usage"
				note="one element around the form. the mark, the words and the footer are the screen's; the frame draws the two columns and nothing else."
			>
				<DocUsage snippets={[usageImport, usageExample]} />
			</DocSection>

			<DocSection
				title="a frame, not a page"
				note={
					<>
						the frame is <Mono>min-h-svh</Mono>, because an anonymous screen is the
						whole page. dropped into a card or a preview — this one, say — the caller
						hands it a height with <Mono>min-h-0</Mono> and the frame fills that
						instead.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					what decides the two columns is the frame's own width, not the window's: it is a{' '}
					<Mono>@container</Mono>, and the panel arrives at <Mono>@xl</Mono> — 36rem —
					because a form and the world beside it need that much room, and a card in a
					column rarely has it. a frame in a drawer keeps the form alone, however wide the
					monitor is.
				</p>
			</DocSection>

			<DocSection
				title="the panel"
				note={
					<>
						<Mono>aside</Mono> replaces the panel's content whole — the artwork and its
						words both step aside — while the form keeps the column it had. it is drawn
						on <Mono>bg-scene-background</Mono>, the one surface in the library that is
						dark in either theme.
					</>
				}
			>
				<DocPreview path="src/pages/Auth/demos/aside.tsx">
					<Aside />
				</DocPreview>
			</DocSection>

			<DocSection
				title="the artwork"
				note={
					<>
						a backlit planet with a moving tilted ring, shaded on a 200×100 grid and
						drawn as one halftone dot a cell. <Mono>RingedPlanet</Mono> is exported on
						its own as well, for a screen that wants the picture somewhere else.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					it is a function of time, so it is drawn onto a canvas at the box's device
					resolution rather than scaled up from a small bitmap, at 15 frames a second. a
					reader who prefers less motion gets the still frame; so does a panel scrolled
					out of view or a tab in the background, because the loop stops rather than run
					where nobody is looking.
				</p>
			</DocSection>

			<DocSection
				title="api reference"
				note="the heading, the form — and the two things the screen adds beside them, the mark and the panel."
			>
				<PropTable props={authProps} />
			</DocSection>

			<DocSection
				title="hooks"
				note="the slots a stylesheet can reach, and the part of the frame each one is."
			>
				<DocTable head={['hook', 'is', 'notes']} mono={[0, 1]} rows={hookRows} />
			</DocSection>
		</DocPage>
	);
}
