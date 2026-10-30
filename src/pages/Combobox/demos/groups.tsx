import { Combobox } from '@/components/ui/combobox';

const groups = [
	{ value: 'compiled', items: ['c', 'cpp', 'go', 'rust', 'swift', 'zig'] },
	{ value: 'interpreted', items: ['lua', 'python', 'ruby', 'typescript'] },
];

export default function Groups() {
	return (
		<Combobox.Root items={groups}>
			<Combobox.InputGroup className="w-56">
				<Combobox.Input placeholder="search a language" aria-label="language" />
				<Combobox.Clear />
				<Combobox.Trigger />
			</Combobox.InputGroup>
			<Combobox.Portal>
				<Combobox.Positioner>
					<Combobox.Popup>
						<Combobox.Empty />
						<Combobox.List>
							{(group: (typeof groups)[number]) => (
								<Combobox.Group key={group.value} items={group.items}>
									<Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
									<Combobox.Collection>
										{(language: string) => (
											<Combobox.Item key={language} value={language}>
												{language}
											</Combobox.Item>
										)}
									</Combobox.Collection>
								</Combobox.Group>
							)}
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	);
}
