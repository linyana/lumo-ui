import { Dropdown } from '@/components/lumo/ui/Dropdown';

const groups = [
	['copy link', 'copy embed code'],
	['share to contacts', 'share to social'],
];

export default function Basic() {
	return (
		<Dropdown.Root>
			<Dropdown.Trigger>share</Dropdown.Trigger>
			<Dropdown.Portal>
				<Dropdown.Positioner sideOffset={8} align="start">
					<Dropdown.Popup>
						<Dropdown.Group>
							<Dropdown.GroupLabel>share</Dropdown.GroupLabel>
							{groups[0]!.map((item) => (
								<Dropdown.Item key={item}>{item}</Dropdown.Item>
							))}
						</Dropdown.Group>
						<Dropdown.Separator />
						<Dropdown.Group>
							{groups[1]!.map((item) => (
								<Dropdown.Item key={item}>{item}</Dropdown.Item>
							))}
						</Dropdown.Group>
					</Dropdown.Popup>
				</Dropdown.Positioner>
			</Dropdown.Portal>
		</Dropdown.Root>
	);
}
