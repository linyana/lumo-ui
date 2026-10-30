import { ToggleGroup } from '@/components/ui/toggle-group';

/**
 * The tier and the scale are the group's, and the items inherit them — so a row cannot end up with
 * one control drawn at the size of another. `md` is the default.
 */
export default function Sizes() {
	return (
		<div className="flex flex-col items-start gap-3">
			<ToggleGroup.Root size="sm" defaultValue={['day']} aria-label="chart range">
				<ToggleGroup.Item value="day">day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root size="md" defaultValue={['week']} aria-label="table range">
				<ToggleGroup.Item value="day">day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root size="lg" defaultValue={['month']} aria-label="log range">
				<ToggleGroup.Item value="day">day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root disabled defaultValue={['week']} aria-label="frozen range">
				<ToggleGroup.Item value="day">day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">month</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	);
}
