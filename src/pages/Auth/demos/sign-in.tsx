import { useState } from 'react';
import { AuthLayout } from '@/components/blocks/auth';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * The frame holds one sign-in and nothing else: the fields are `Field`'s, the stack is `Form`'s and
 * the control is the `Button` this library presses everywhere. `required` and the input types are
 * the validation — the form reports each in its own field and only then reaches `onFormSubmit`.
 */
export default function SignIn() {
	const [signedIn, setSignedIn] = useState(false);

	return (
		<AuthLayout
			// The frame fills the page it is on; in a card, the card says how tall the page is.
			className="h-120 min-h-0 w-full overflow-hidden rounded-lg border"
			logo={<img src="/logo.svg" alt="" className="size-8" />}
			title="Sign in"
			description="Welcome back. Pick up where you left off."
			headline={
				<>
					Good things
					<br />
					start here.
				</>
			}
			note="A little structure. A world of possibility."
			footer={
				<>
					No account?{' '}
					<a href="#create" className="text-foreground underline underline-offset-4">
						Create one
					</a>
				</>
			}
		>
			<Form onFormSubmit={() => setSignedIn(true)}>
				<Field.Root name="email">
					<Field.Label>email</Field.Label>
					<Input
						type="email"
						autoComplete="email"
						required
						placeholder="you@example.com"
					/>
					<Field.Error match="valueMissing">an address is required.</Field.Error>
					<Field.Error match="typeMismatch">that is missing an @.</Field.Error>
				</Field.Root>

				<Field.Root name="password">
					<Field.Label>password</Field.Label>
					<Input
						type="password"
						autoComplete="current-password"
						required
						minLength={8}
						placeholder="at least 8 characters"
					/>
					<Field.Error match="valueMissing">a password is required.</Field.Error>
					<Field.Error match="tooShort">that is under 8 characters.</Field.Error>
				</Field.Root>

				<Button type="submit" className="mt-2 w-full">
					sign in
				</Button>

				{signedIn && <p className="text-sm text-muted-foreground">signed in.</p>}
			</Form>
		</AuthLayout>
	);
}
