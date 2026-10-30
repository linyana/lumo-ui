import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, type FormErrors } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/** A name a server would answer for — and the only thing a browser cannot know. */
const taken = ['admin', 'root', 'lumo'];

/** The wait a server would take. */
const answer = () => new Promise((resolve) => setTimeout(resolve, 600));

/**
 * What only the server can decide arrives as `errors`, keyed by the field's `name`, and lands in that
 * field's own `Error` — no message is repeated at the top of the form. Editing the field clears it.
 *
 * The username is `required` and its `Error` is matched, so the field has a written sentence of its
 * own; the server's still wins the line while the form holds it, because that one is about the value
 * that was actually sent. Empty it and submit to see the constraint answer instead.
 */
export default function ServerErrors() {
	const [errors, setErrors] = useState<FormErrors>({});
	const [saving, setSaving] = useState(false);

	return (
		<Form
			className="w-full max-w-sm"
			errors={errors}
			onFormSubmit={async (values) => {
				setSaving(true);
				await answer();
				const username = String(values.username ?? '');
				setErrors(taken.includes(username) ? { username: `“${username}” is taken` } : {});
				setSaving(false);
			}}
		>
			<Field.Root name="username">
				<Field.Label>username</Field.Label>
				<Input required defaultValue="admin" autoComplete="username" placeholder="ada" />
				<Field.Description>letters, digits and dashes.</Field.Description>
				<Field.Error match="valueMissing">a username is required.</Field.Error>
			</Field.Root>

			<Button type="submit" loading={saving} className="self-start">
				claim it
			</Button>
		</Form>
	);
}
