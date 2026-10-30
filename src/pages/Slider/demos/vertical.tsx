import { Slider } from '@/components/ui/slider';

/**
 * A column instead of a row. Everything is the same control turned on its side; only the height has
 * to be given with it, and a width to sit the name and the number in, because a column has neither.
 */
export default function Vertical() {
	return (
		<div className="flex items-start gap-8">
			<Slider.Root orientation="vertical" defaultValue={70} className="h-40 w-24">
				<Slider.Label>bass</Slider.Label>
				<Slider.Value />
				<Slider.Control>
					<Slider.Track>
						<Slider.Indicator />
						<Slider.Thumb />
					</Slider.Track>
				</Slider.Control>
			</Slider.Root>
			<Slider.Root orientation="vertical" defaultValue={35} className="h-40 w-24">
				<Slider.Label>treble</Slider.Label>
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
