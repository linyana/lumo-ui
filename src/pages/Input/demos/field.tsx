import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

/** The border turns destructive on its own: the field marks the control, the input reads it. */
export default function InField() {
	return (
		<Field.Root
			className="w-full max-w-sm"
			validationMode="onBlur"
			validate={(value) => (String(value).length >= 3 ? null : 'at least three characters')}
		>
			<Field.Label>display name</Field.Label>
			<Input defaultValue="ab" />
			<Field.Description>this is what other people see.</Field.Description>
			<Field.Error />
		</Field.Root>
	);
}
