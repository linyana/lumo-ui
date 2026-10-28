import { Field } from '@/components/lumo/ui/Field';
import { Switch } from '@/components/lumo/ui/Switch';

export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Field.Root>
				<Field.Item className="items-center justify-between gap-4">
					<Field.Label>off</Field.Label>
					<Switch.Root name="off">
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item className="items-center justify-between gap-4">
					<Field.Label>on</Field.Label>
					<Switch.Root name="on" defaultChecked>
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item className="items-center justify-between gap-4">
					<Field.Label>read only — on, and staying on</Field.Label>
					<Switch.Root name="readonly" defaultChecked readOnly>
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
			<Field.Root disabled>
				<Field.Item className="items-center justify-between gap-4">
					<Field.Label>disabled</Field.Label>
					<Switch.Root name="disabled">
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
		</div>
	);
}
