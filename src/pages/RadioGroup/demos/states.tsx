import { Field } from '@/components/lumo/ui/Field';
import { RadioGroup } from '@/components/lumo/ui/RadioGroup';

/** The group is a grid by default; a single row is a call site's `grid-flow-col`. */
export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-6">
			<Field.Root>
				<Field.Label>billing</Field.Label>
				<RadioGroup.Root
					defaultValue="monthly"
					className="grid-flow-col justify-start gap-4"
				>
					{['monthly', 'yearly'].map((period) => (
						<Field.Item key={period} className="items-center gap-2">
							<RadioGroup.Item value={period}>
								<RadioGroup.Indicator />
							</RadioGroup.Item>
							<Field.Label>{period}</Field.Label>
						</Field.Item>
					))}
				</RadioGroup.Root>
			</Field.Root>

			<Field.Root>
				<Field.Label>region</Field.Label>
				<RadioGroup.Root defaultValue="eu" className="gap-2">
					<Field.Item className="items-center gap-2">
						<RadioGroup.Item value="eu">
							<RadioGroup.Indicator />
						</RadioGroup.Item>
						<Field.Label>eu-west</Field.Label>
					</Field.Item>
					<Field.Item className="items-center gap-2" disabled>
						<RadioGroup.Item value="us">
							<RadioGroup.Indicator />
						</RadioGroup.Item>
						<Field.Label>us-east</Field.Label>
					</Field.Item>
				</RadioGroup.Root>
				<Field.Description>a region you have shipped to cannot be left.</Field.Description>
			</Field.Root>
		</div>
	);
}
