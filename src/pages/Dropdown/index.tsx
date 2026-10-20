import { Fragment } from 'react';
import { Dropdown } from '@/components/lumo/Dropdown';
import { DocPage, DocSection } from '@/pages/DocPage';

/** The docs' own example, kept verbatim as the reference the lumo dropdown is measured against. */
const docsDropdowns = {
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

type DocsDropdownKey = keyof typeof docsDropdowns;

const docsDropdownKeys = Object.keys(docsDropdowns) as DocsDropdownKey[];

const docsDropdown = Dropdown.createHandle<DocsDropdownKey>();

export function DropdownPage() {
	return (
		<DocPage
			title="dropdown"
			description="actions on a trigger, with groups, separators and submenus"
		>
			<DocSection
				title="the same content, styled the way base ui's docs do it"
				note={
					<>
						the docs' own styling, straight from base ui's site: no radius, a hard
						shadow, a solid block behind the highlighted row. kept here as the reference
						— the lumo dropdown should switch triggers with the same rhythm, whatever it
						ends up looking like.
					</>
				}
			>
				<div className="flex flex-wrap gap-2">
					{docsDropdownKeys.map((key) => (
						<Dropdown.Trigger key={key} handle={docsDropdown} payload={key}>
							{docsDropdowns[key].heading}
						</Dropdown.Trigger>
					))}
				</div>
				<Dropdown.Root handle={docsDropdown} modal={false}>
					{({ payload }) => (
						<Dropdown.Portal>
							<Dropdown.Positioner sideOffset={8} align="start">
								<Dropdown.Popup>
									<Dropdown.Viewport>
										{payload &&
											docsDropdowns[payload].groups.map(
												(group, groupIndex) => (
													<Fragment key={group[0]}>
														<Dropdown.Group>
															{groupIndex === 0 && (
																<Dropdown.GroupLabel>
																	{docsDropdowns[payload].heading}
																</Dropdown.GroupLabel>
															)}
															{group.map((item) => (
																<Dropdown.Item key={item}>
																	{item}
																</Dropdown.Item>
															))}
														</Dropdown.Group>
														{groupIndex <
															docsDropdowns[payload].groups.length -
																1 && <Dropdown.Separator />}
													</Fragment>
												),
											)}
									</Dropdown.Viewport>
								</Dropdown.Popup>
							</Dropdown.Positioner>
						</Dropdown.Portal>
					)}
				</Dropdown.Root>
			</DocSection>
		</DocPage>
	);
}
