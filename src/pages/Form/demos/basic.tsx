import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * `required` and `type="email"` are the validation — the form reads them off the controls and reports
 * each in its own field, and `onFormSubmit` is only reached once they all pass.
 */
export default function Basic() {
	const [sent, setSent] = useState<Record<string, unknown> | null>(null);

	return (
		<Form className="w-full max-w-sm" onFormSubmit={(values) => setSent(values)}>
			<Field.Root name="email">
				<Field.Label>email</Field.Label>
				<Input type="email" required placeholder="you@example.com" />
				<Field.Error match="valueMissing">an address is required.</Field.Error>
				<Field.Error match="typeMismatch">that is missing an @.</Field.Error>
			</Field.Root>

			<Field.Root name="name">
				<Field.Label>name</Field.Label>
				<Input required placeholder="Ada Lovelace" />
				<Field.Error match="valueMissing">a name is required.</Field.Error>
			</Field.Root>

			<Button type="submit" className="self-start">
				subscribe
			</Button>

			{sent !== null && (
				<p className="text-sm text-muted-foreground">{JSON.stringify(sent)}</p>
			)}
		</Form>
	);
}
