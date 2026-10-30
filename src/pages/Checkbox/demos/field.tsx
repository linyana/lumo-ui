import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';

/** `required` on the checkbox is a native constraint, so a field above it reports it and the box
 *  carries the same destructive border an invalid input does. */
export default function InField() {
	return (
		<Field.Root className="w-full max-w-sm" validationMode="onBlur">
			<Field.Item>
				<Checkbox.Root name="confirm" required>
					<Checkbox.Indicator />
				</Checkbox.Root>
				<div className="space-y-0.5">
					<Field.Label>delete the archive</Field.Label>
					<Field.Description>every build in it goes with it.</Field.Description>
				</div>
			</Field.Item>
			<Field.Error match="valueMissing">tick it to go on.</Field.Error>
		</Field.Root>
	);
}
