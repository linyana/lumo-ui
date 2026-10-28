import { Field } from '@/components/lumo/ui/Field';
import { RadioGroup } from '@/components/lumo/ui/RadioGroup';

const plans = [
	{ value: 'solo', label: 'solo', description: 'one seat, one workspace.' },
	{ value: 'team', label: 'team', description: 'ten seats and the projects they share.' },
	{ value: 'studio', label: 'studio', description: 'as many seats as you like, and an invoice.' },
];

export default function Basic() {
	return (
		<Field.Root className="w-full max-w-sm">
			<Field.Label>plan</Field.Label>
			<RadioGroup.Root defaultValue="team" className="gap-3">
				{plans.map(({ value, label, description }) => (
					<Field.Item key={value}>
						<RadioGroup.Item value={value} className="mt-0.5">
							<RadioGroup.Indicator />
						</RadioGroup.Item>
						<div className="space-y-0.5">
							<Field.Label>{label}</Field.Label>
							<Field.Description>{description}</Field.Description>
						</div>
					</Field.Item>
				))}
			</RadioGroup.Root>
		</Field.Root>
	);
}
