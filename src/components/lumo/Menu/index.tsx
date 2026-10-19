import { Fragment } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';

/** The docs' own example, kept verbatim as the reference the lumo menu is measured against. */
const docsMenus = {
	library: {
		heading: 'Library',
		groups: [
			['Add to library', 'Add to favorites'],
			['Create playlist', 'Create station'],
		],
	},
	playback: {
		heading: 'Playback',
		groups: [
			['Play now', 'Add to queue'],
			['Play next', 'Play last', 'Sleep timer'],
		],
	},
	share: {
		heading: 'Share',
		groups: [
			['Copy link', 'Copy embed code'],
			['Share to contacts', 'Share to social'],
		],
	},
} as const;

type DocsMenuKey = keyof typeof docsMenus;

const docsMenuKeys = Object.keys(docsMenus) as DocsMenuKey[];

const docsMenu = BaseMenu.createHandle<DocsMenuKey>();

const docsTriggerClass = `
	flex h-8 items-center justify-center
	rounded-none border border-neutral-950 bg-white
	px-3 text-sm font-normal text-neutral-950 select-none
	hover:bg-neutral-100 active:bg-neutral-200 data-pressed:bg-neutral-100
	dark:border-white dark:bg-neutral-950 dark:text-white
	dark:hover:bg-neutral-800 dark:active:bg-neutral-700 dark:data-pressed:bg-neutral-800
	focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950
	dark:focus-visible:outline-white
`;

const docsPositionerClass = `
	outline-none
	h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]
	transition-[top,left,right,bottom,transform]
	duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]
	data-instant:transition-none
`;

const docsPopupClass = `
	relative h-[var(--popup-height,auto)] w-[var(--popup-width,auto)] py-1
	origin-[var(--transform-origin)] border border-neutral-950
	bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 outline-none
	transition-[width,height,opacity,scale]
	duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]
	data-starting-style:scale-90 data-starting-style:opacity-0
	data-ending-style:scale-90 data-ending-style:opacity-0
	data-instant:transition-none
	dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none
`;

const docsViewportClass = `
	relative h-full w-full overflow-clip p-0
	[&_[data-current]]:w-[var(--popup-width)]
	[&_[data-current]]:translate-x-0 [&_[data-current]]:opacity-100
	[&_[data-current]]:transition-[translate,opacity]
	[&_[data-current]]:duration-[350ms,175ms]
	[&_[data-current]]:ease-[cubic-bezier(0.22,1,0.36,1)]
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
	data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
	data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
	[&_[data-previous]]:w-[var(--popup-width)]
	[&_[data-previous]]:translate-x-0 [&_[data-previous]]:opacity-100
	[&_[data-previous]]:transition-[translate,opacity]
	[&_[data-previous]]:duration-[350ms,175ms]
	[&_[data-previous]]:ease-[cubic-bezier(0.22,1,0.36,1)]
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
	data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
	data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0
`;

const docsGroupLabelClass = `
	px-4 py-2 text-sm leading-4 text-neutral-500 select-none
	dark:text-neutral-400
`;

const docsItemClass = `
	flex cursor-default py-2 pr-8 pl-4
	text-sm leading-4 outline-none select-none
	data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white
	data-highlighted:before:absolute data-highlighted:before:inset-x-1
	data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]
	data-highlighted:before:bg-neutral-950 data-highlighted:before:content-['']
	dark:data-highlighted:text-neutral-950 dark:data-highlighted:before:bg-white
`;

export function Menu() {
	return (
		<section className="space-y-3">
			<h2 className="text-sm font-medium text-muted-foreground">
				menu — the same content, styled the way base ui's docs do it
			</h2>
			<div className="flex flex-wrap gap-2">
				{docsMenuKeys.map((key) => (
					<BaseMenu.Trigger
						key={key}
						handle={docsMenu}
						payload={key}
						className={docsTriggerClass}
					>
						{docsMenus[key].heading}
					</BaseMenu.Trigger>
				))}
			</div>
			<BaseMenu.Root handle={docsMenu} modal={false}>
				{({ payload }) => (
					<BaseMenu.Portal>
						<BaseMenu.Positioner
							sideOffset={8}
							align="start"
							className={docsPositionerClass}
						>
							<BaseMenu.Popup className={docsPopupClass}>
								<BaseMenu.Viewport className={docsViewportClass}>
									{payload &&
										docsMenus[payload].groups.map((group, groupIndex) => (
											<Fragment key={group[0]}>
												<BaseMenu.Group>
													{groupIndex === 0 && (
														<BaseMenu.GroupLabel
															className={docsGroupLabelClass}
														>
															{docsMenus[payload].heading}
														</BaseMenu.GroupLabel>
													)}
													{group.map((item) => (
														<BaseMenu.Item
															key={item}
															className={docsItemClass}
														>
															{item}
														</BaseMenu.Item>
													))}
												</BaseMenu.Group>
												{groupIndex <
													docsMenus[payload].groups.length - 1 && (
													<BaseMenu.Separator className="mx-1 my-1 h-px bg-neutral-950 dark:bg-white" />
												)}
											</Fragment>
										))}
								</BaseMenu.Viewport>
							</BaseMenu.Popup>
						</BaseMenu.Positioner>
					</BaseMenu.Portal>
				)}
			</BaseMenu.Root>
			<p className="text-xs text-muted-foreground">
				the docs' own styling, straight from base ui's site: no radius, a hard shadow, a
				solid block behind the highlighted row. kept here as the reference — the lumo menu
				should switch triggers with the same rhythm, whatever it ends up looking like.
			</p>
		</section>
	);
}
