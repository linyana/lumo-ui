import { Select } from '@/components/lumo/ui/Select';

const languages = ['typescript', 'rust', 'go', 'python', 'zig'];

export default function Basic() {
	return (
		<Select.Root defaultValue="typescript">
			<Select.Trigger className="w-56" aria-label="language">
				<Select.Value placeholder="choose a language" />
				<Select.Icon />
			</Select.Trigger>
			<Select.Portal>
				<Select.Positioner>
					<Select.Popup>
						<Select.List>
							{languages.map((language) => (
								<Select.Item key={language} value={language}>
									<Select.ItemText>{language}</Select.ItemText>
									<Select.ItemIndicator />
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	);
}
