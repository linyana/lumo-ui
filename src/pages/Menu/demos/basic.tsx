import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/menu';

const groups = [
	['copy link', 'copy embed code'],
	['share to contacts', 'share to social'],
];

export default function Basic() {
	return (
		<Menu.Root>
			<Menu.Trigger
				render={
					<Button variant="outline" size="sm">
						share
					</Button>
				}
			/>
			<Menu.Portal>
				<Menu.Positioner sideOffset={8} align="start">
					<Menu.Popup>
						<Menu.Group>
							<Menu.GroupLabel>share</Menu.GroupLabel>
							{groups[0]!.map((item) => (
								<Menu.Item key={item}>{item}</Menu.Item>
							))}
						</Menu.Group>
						<Menu.Separator />
						<Menu.Group>
							{groups[1]!.map((item) => (
								<Menu.Item key={item}>{item}</Menu.Item>
							))}
						</Menu.Group>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
}
