import { Combobox } from '@/components/lumo/ui/Combobox';

const languages = [
	'c',
	'cpp',
	'elixir',
	'go',
	'haskell',
	'javascript',
	'kotlin',
	'lua',
	'ocaml',
	'python',
	'ruby',
	'rust',
	'swift',
	'typescript',
	'zig',
];

export default function Basic() {
	return (
		<Combobox.Root items={languages}>
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
							{(language: string) => (
								<Combobox.Item key={language} value={language}>
									{language}
									<Combobox.ItemIndicator />
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	);
}
