import { Textarea } from '@/components/ui/textarea';

export default function Basic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Textarea size="sm" placeholder="sm · 64 at least" aria-label="sm" />
			<Textarea size="md" placeholder="md · 80 at least" aria-label="md" />
			<Textarea size="lg" placeholder="lg · 96 at least" aria-label="lg" />
		</div>
	);
}
