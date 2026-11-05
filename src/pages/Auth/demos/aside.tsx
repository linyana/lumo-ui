import { AuthLayout } from '@/components/blocks/auth';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * The panel is a slot: hand it anything and the artwork steps aside, while the form keeps the column
 * it had. Nothing on the panel is the frame's own, so a brand, a photograph or a statement all land
 * there without the form changing.
 */
export default function Aside() {
	return (
		<AuthLayout
			className="h-120 min-h-0 w-full overflow-hidden rounded-lg border"
			title="Reset password"
			description="We will send a link to the address on the account."
			aside={
				<figure className="flex flex-1 flex-col justify-between gap-8">
					<blockquote className="max-w-sm font-serif text-3xl leading-tight text-balance">
						“One frame, three screens: sign in, sign up, and the way back in.”
					</blockquote>
					<figcaption className="text-sm text-scene-foreground/65">
						the panel takes any node, and the form keeps its own column.
					</figcaption>
				</figure>
			}
			footer={
				<>
					Remembered it?{' '}
					<a href="#sign-in" className="text-foreground underline underline-offset-4">
						Sign in
					</a>
				</>
			}
		>
			<Form onFormSubmit={() => {}}>
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

				<Button type="submit" className="mt-2 w-full">
					send the link
				</Button>
			</Form>
		</AuthLayout>
	);
}
