import { Field } from '@/components/ui/field';

/**
 * `Control` takes whatever element it is given and puts the wiring on it — id, describedby,
 * aria-invalid — so a control the library does not ship still gets a name and an error.
 */
export default function Native() {
	return (
		<Field.Root
			className="w-full max-w-sm"
			validationMode="onBlur"
			validate={(value) =>
				String(value).trim() ? null : 'say one thing about this release.'
			}
		>
			<Field.Label>release notes</Field.Label>
			<Field.Control
				render={<textarea rows={3} />}
				placeholder="what changed"
				className="resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive"
			/>
			<Field.Error />
		</Field.Root>
	);
}
