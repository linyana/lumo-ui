import { Field } from '@/components/ui/field';
import { Fieldset } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';

/** A legend and the fields under it; the grouping is the heading, not a frame. */
export default function Basic() {
	return (
		<Fieldset.Root className="w-full max-w-sm">
			<Fieldset.Legend>billing details</Fieldset.Legend>

			<Field.Root name="company">
				<Field.Label>company</Field.Label>
				<Input placeholder="Lumo" />
			</Field.Root>

			<Field.Root name="taxId">
				<Field.Label>tax id</Field.Label>
				<Input placeholder="FR 40 123456789" />
				<Field.Description>left empty for a personal account.</Field.Description>
			</Field.Root>
		</Fieldset.Root>
	);
}
