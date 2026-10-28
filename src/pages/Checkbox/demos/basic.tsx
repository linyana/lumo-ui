import { Checkbox } from '@/components/lumo/ui/Checkbox';
import { Field } from '@/components/lumo/ui/Field';

export default function Basic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Field.Root>
				<Field.Item>
					<Checkbox.Root name="readme" defaultChecked>
						<Checkbox.Indicator />
					</Checkbox.Root>
					<div className="space-y-0.5">
						<Field.Label>readme</Field.Label>
						<Field.Description>who this is for, and how to start.</Field.Description>
					</div>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item>
					<Checkbox.Root name="license">
						<Checkbox.Indicator />
					</Checkbox.Root>
					<div className="space-y-0.5">
						<Field.Label>license</Field.Label>
						<Field.Description>
							a file nobody reads and everybody checks for.
						</Field.Description>
					</div>
				</Field.Item>
			</Field.Root>
			<Field.Root disabled>
				<Field.Item>
					<Checkbox.Root name="changelog" defaultChecked>
						<Checkbox.Indicator />
					</Checkbox.Root>
					<Field.Label>changelog</Field.Label>
				</Field.Item>
			</Field.Root>
		</div>
	);
}
