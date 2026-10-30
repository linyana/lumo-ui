import { Fragment } from 'react';
import { Select } from '@/components/ui/select';

type Option = { value: string; disabled?: boolean };

/** Kept in the list rather than filtered out, so a project the reader remembers is still findable —
 *  it simply cannot be chosen again. */
const groups: { label: string; items: Option[] }[] = [
	{ label: 'workspace', items: [{ value: 'lumo-ui' }, { value: 'lumo-code' }] },
	{ label: 'archived', items: [{ value: 'lumo-web', disabled: true }] },
];

export default function Groups() {
	return (
		<Select.Root defaultValue="lumo-ui">
			<Select.Trigger className="w-56" aria-label="project">
				<Select.Value placeholder="choose a project" />
				<Select.Icon />
			</Select.Trigger>
			<Select.Portal>
				<Select.Positioner>
					<Select.Popup>
						<Select.List>
							{groups.map((group, index) => (
								<Fragment key={group.label}>
									{index > 0 && <Select.Separator />}
									<Select.Group>
										<Select.GroupLabel>{group.label}</Select.GroupLabel>
										{group.items.map(({ value, disabled }) => (
											<Select.Item
												key={value}
												value={value}
												disabled={disabled}
											>
												<Select.ItemText>{value}</Select.ItemText>
											</Select.Item>
										))}
									</Select.Group>
								</Fragment>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	);
}
