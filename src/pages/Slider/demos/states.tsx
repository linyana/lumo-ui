import { Slider } from '@/components/ui/slider';

/** A disabled slider is dimmed and stops taking the pointer; a stepped one only lands on multiples. */
export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-6">
			<Slider.Root defaultValue={40} step={25}>
				<Slider.Label>brightness, in quarters</Slider.Label>
				<Slider.Value />
				<Slider.Control>
					<Slider.Track>
						<Slider.Indicator />
						<Slider.Thumb />
					</Slider.Track>
				</Slider.Control>
			</Slider.Root>
			<Slider.Root defaultValue={90} disabled>
				<Slider.Label>contrast, fixed by the device</Slider.Label>
				<Slider.Value />
				<Slider.Control>
					<Slider.Track>
						<Slider.Indicator />
						<Slider.Thumb />
					</Slider.Track>
				</Slider.Control>
			</Slider.Root>
		</div>
	);
}
