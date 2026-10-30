import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Basic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<Field.Root>
				<Field.Label>email</Field.Label>
				<Input type="email" autoComplete="email" placeholder="you@example.com" />
				<Field.Description>only when something breaks.</Field.Description>
			</Field.Root>
			<Field.Root>
				<Field.Label>workspace</Field.Label>
				<Input defaultValue="lumo" />
			</Field.Root>
		</div>
	);
}
