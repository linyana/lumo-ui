import { useState } from 'react';
import { Field } from '@/components/lumo/ui/Field';
import { RadioGroup } from '@/components/lumo/ui/RadioGroup';

const densities = ['comfortable', 'compact'];

export default function Controlled() {
	const [density, setDensity] = useState('comfortable');

	return (
		<Field.Root className="w-full max-w-sm">
			<Field.Label>density</Field.Label>
			<RadioGroup.Root
				value={density}
				onValueChange={setDensity}
				className="grid-flow-col justify-start gap-4"
			>
				{densities.map((option) => (
					<Field.Item key={option} className="items-center gap-2">
						<RadioGroup.Item value={option}>
							<RadioGroup.Indicator />
						</RadioGroup.Item>
						<Field.Label>{option}</Field.Label>
					</Field.Item>
				))}
			</RadioGroup.Root>
			<p className="text-sm text-muted-foreground">
				the list is drawn <span className="font-medium text-foreground">{density}</span>.
			</p>
		</Field.Root>
	);
}
