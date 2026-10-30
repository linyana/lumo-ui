import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

/** A string, or nothing at all: Base UI accepts either as the verdict. */
const asEmail = (value: unknown) =>
	/^[^@\s]+@[^@\s]+$/.test(String(value)) ? null : 'that is not an address';

const asSlug = (value: unknown) =>
	/^[a-z0-9-]+$/.test(String(value)) ? null : 'lowercase letters, digits and dashes';

/** The prefilled values are both wrong, so the error is one Tab away from appearing. The inputs carry
 *  no `type="email"` on purpose: a native constraint is reported before `validate` is asked, and this
 *  demo is about the validator. */
export default function Validation() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<Field.Root validationMode="onBlur" validate={asEmail}>
				<Field.Label>email</Field.Label>
				<Input defaultValue="you" />
				<Field.Error />
			</Field.Root>
			<Field.Root validationMode="onBlur" validate={asSlug}>
				<Field.Label>workspace</Field.Label>
				<Input defaultValue="lumo ui" />
				<Field.Error />
			</Field.Root>
		</div>
	);
}
