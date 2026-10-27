import { Input } from '@/components/lumo/ui/Input';

export default function Sizes() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Input size="sm" placeholder="sm · 32 tall" aria-label="sm" />
			<Input size="md" placeholder="md · 36 tall" aria-label="md" />
			<Input size="lg" placeholder="lg · 40 tall" aria-label="lg" />
		</div>
	);
}
