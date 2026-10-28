import { Field } from '@/components/lumo/ui/Field';
import { Switch } from '@/components/lumo/ui/Switch';

export default function Basic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<Field.Root>
				<Field.Item className="items-center justify-between gap-4">
					<div className="space-y-0.5">
						<Field.Label>preview builds</Field.Label>
						<Field.Description>one for every pull request.</Field.Description>
					</div>
					<Switch.Root name="preview" defaultChecked>
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
			<Field.Root>
				<Field.Item className="items-center justify-between gap-4">
					<div className="space-y-0.5">
						<Field.Label>failure mail</Field.Label>
						<Field.Description>
							one a day at most, however many builds fall over.
						</Field.Description>
					</div>
					<Switch.Root name="mail">
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
		</div>
	);
}
