import { Fragment } from 'react';
import { Dropdown } from '@/components/lumo/ui/Dropdown';

const menus = {
	library: {
		heading: 'library',
		groups: [['add to library', 'add to favorites'], ['create playlist']],
	},
	playback: {
		heading: 'playback',
		groups: [
			['play now', 'add to queue'],
			['play next', 'sleep timer'],
		],
	},
	share: { heading: 'share', groups: [['copy link', 'copy embed code'], ['share to social']] },
} as const;

type Key = keyof typeof menus;

const keys = Object.keys(menus) as Key[];
const handle = Dropdown.createHandle<Key>();

export default function Detached() {
	return (
		<>
			<div className="flex flex-wrap justify-center gap-2">
				{keys.map((key) => (
					<Dropdown.Trigger key={key} handle={handle} payload={key}>
						{menus[key].heading}
					</Dropdown.Trigger>
				))}
			</div>
			<Dropdown.Root handle={handle} modal={false}>
				{({ payload }) => (
					<Dropdown.Portal>
						<Dropdown.Positioner sideOffset={8} align="start">
							<Dropdown.Popup>
								<Dropdown.Viewport>
									{payload &&
										menus[payload].groups.map((group, index) => (
											<Fragment key={group[0]}>
												<Dropdown.Group>
													{index === 0 && (
														<Dropdown.GroupLabel>
															{menus[payload].heading}
														</Dropdown.GroupLabel>
													)}
													{group.map((item) => (
														<Dropdown.Item key={item}>
															{item}
														</Dropdown.Item>
													))}
												</Dropdown.Group>
												{index < menus[payload].groups.length - 1 && (
													<Dropdown.Separator />
												)}
											</Fragment>
										))}
								</Dropdown.Viewport>
							</Dropdown.Popup>
						</Dropdown.Positioner>
					</Dropdown.Portal>
				)}
			</Dropdown.Root>
		</>
	);
}
