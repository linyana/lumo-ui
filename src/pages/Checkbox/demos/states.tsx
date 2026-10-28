import { Checkbox } from '@/components/lumo/ui/Checkbox';
import { Field } from '@/components/lumo/ui/Field';

export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Field.Root>
				<Field.Item>
					<Checkbox.Root name="off">
						<Checkbox.Indicator />
					</Checkbox.Root>
					<Field.Label>unticked</Field.Label>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item>
					<Checkbox.Root name="on" defaultChecked>
						<Checkbox.Indicator />
					</Checkbox.Root>
					<Field.Label>ticked</Field.Label>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item>
					<Checkbox.Root name="some" indeterminate>
						<Checkbox.Indicator />
					</Checkbox.Root>
					<Field.Label>neither — some of them</Field.Label>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item>
					<Checkbox.Root name="readonly" defaultChecked readOnly>
						<Checkbox.Indicator />
					</Checkbox.Root>
					<Field.Label>read only</Field.Label>
				</Field.Item>
			</Field.Root>
			<Field.Root disabled>
				<Field.Item>
					<Checkbox.Root name="disabled">
						<Checkbox.Indicator />
					</Checkbox.Root>
					<Field.Label>disabled</Field.Label>
				</Field.Item>
			</Field.Root>
		</div>
	);
}
