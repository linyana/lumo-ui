import { Progress } from '@/components/lumo/ui/Progress';

export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-6">
			<Progress.Root value={null}>
				<Progress.Label>checking for updates</Progress.Label>
				<Progress.Value />
				<Progress.Track>
					<Progress.Indicator />
				</Progress.Track>
			</Progress.Root>
			<Progress.Root value={35}>
				<Progress.Label>restoring files</Progress.Label>
				<Progress.Value />
				<Progress.Track>
					<Progress.Indicator />
				</Progress.Track>
			</Progress.Root>
			<Progress.Root value={100}>
				<Progress.Label>backup</Progress.Label>
				<Progress.Value />
				<Progress.Track>
					<Progress.Indicator />
				</Progress.Track>
			</Progress.Root>
		</div>
	);
}
