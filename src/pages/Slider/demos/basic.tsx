import { Slider } from '@/components/ui/slider';

export default function Basic() {
	return (
		<div className="w-full max-w-sm">
			<Slider.Root defaultValue={64}>
				<Slider.Label>thumbnail size</Slider.Label>
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
