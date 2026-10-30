import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Fieldset } from '@/components/ui/fieldset';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * Two answers in one form: each legend is announced before the fields under it, so a reader hearing
 * "city" also hears which city. The fields keep their own names — a group is a heading, not a prefix.
 */
export default function Groups() {
	return (
		<Form className="w-full max-w-sm">
			<Fieldset.Root>
				<Fieldset.Legend>where it goes</Fieldset.Legend>

				<Field.Root name="recipient">
					<Field.Label>recipient</Field.Label>
					<Input required placeholder="Ada Lovelace" />
					<Field.Error match="valueMissing">a recipient is required.</Field.Error>
				</Field.Root>

				<Field.Root name="city">
					<Field.Label>city</Field.Label>
					<Input required placeholder="London" />
					<Field.Error match="valueMissing">a city is required.</Field.Error>
				</Field.Root>
			</Fieldset.Root>

			<Fieldset.Root>
				<Fieldset.Legend>who pays</Fieldset.Legend>

				<Field.Root name="card">
					<Field.Label>card number</Field.Label>
					<Input
						required
						inputMode="numeric"
						autoComplete="cc-number"
						placeholder="4242 4242 4242 4242"
					/>
					<Field.Error match="valueMissing">a card number is required.</Field.Error>
				</Field.Root>
			</Fieldset.Root>

			<Button type="submit" className="self-start">
				order
			</Button>
		</Form>
	);
}
