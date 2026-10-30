import { Fragment } from 'react';
import { Menu } from '@/components/ui/menu';

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
const handle = Menu.createHandle<Key>();

export default function Detached() {
	return (
		<>
			<div className="flex flex-wrap justify-center gap-2">
				{keys.map((key) => (
					<Menu.Trigger key={key} handle={handle} payload={key}>
						{menus[key].heading}
					</Menu.Trigger>
				))}
			</div>
			<Menu.Root handle={handle} modal={false}>
				{({ payload }) => (
					<Menu.Portal>
						<Menu.Positioner sideOffset={8} align="start">
							<Menu.Popup>
								<Menu.Viewport>
									{payload &&
										menus[payload].groups.map((group, index) => (
											<Fragment key={group[0]}>
												<Menu.Group>
													{index === 0 && (
														<Menu.GroupLabel>
															{menus[payload].heading}
														</Menu.GroupLabel>
													)}
													{group.map((item) => (
														<Menu.Item key={item}>{item}</Menu.Item>
													))}
												</Menu.Group>
												{index < menus[payload].groups.length - 1 && (
													<Menu.Separator />
												)}
											</Fragment>
										))}
								</Menu.Viewport>
							</Menu.Popup>
						</Menu.Positioner>
					</Menu.Portal>
				)}
			</Menu.Root>
		</>
	);
}
