import { Progress } from '@/components/ui/progress';

export default function Basic() {
	return (
		<div className="w-full max-w-sm">
			<Progress.Root value={64}>
				<Progress.Label>importing photos</Progress.Label>
				<Progress.Value />
				<Progress.Track>
					<Progress.Indicator />
				</Progress.Track>
			</Progress.Root>
		</div>
	);
}
