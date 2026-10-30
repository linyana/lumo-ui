import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export default function InField() {
	return (
		<Field.Root
			className="w-full max-w-sm"
			validationMode="onBlur"
			validate={(value) =>
				String(value).trim().length >= 12 ? null : 'twelve characters is a sentence.'
			}
		>
			<Field.Label>release notes</Field.Label>
			<Textarea rows={4} placeholder="what changed, and what it costs" />
			<Field.Description>
				shown on the deploy page, and in the mail that follows it.
			</Field.Description>
			<Field.Error />
		</Field.Root>
	);
}
