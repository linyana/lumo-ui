import { Slider } from '@/components/ui/slider';

/**
 * Two thumbs on one groove: the value is an array, one entry per thumb, and each thumb is given its
 * own name because a range is two numbers a screen reader has to tell apart.
 */
export default function Range() {
	return (
		<div className="w-full max-w-sm">
			<Slider.Root
				defaultValue={[180, 720]}
				min={0}
				max={1000}
				step={10}
				format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
			>
				<Slider.Label>monthly budget</Slider.Label>
				<Slider.Value />
				<Slider.Control>
					<Slider.Track>
						<Slider.Indicator />
						<Slider.Thumb index={0} aria-label="least" />
						<Slider.Thumb index={1} aria-label="most" />
					</Slider.Track>
				</Slider.Control>
			</Slider.Root>
		</div>
	);
}
