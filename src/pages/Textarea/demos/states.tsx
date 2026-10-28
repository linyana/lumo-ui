import { Textarea } from '@/components/lumo/ui/Textarea';

export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Textarea defaultValue="a value" aria-label="filled" />
			<Textarea readOnly defaultValue="read only" aria-label="read only" />
			<Textarea disabled placeholder="disabled" aria-label="disabled" />
			<Textarea aria-invalid defaultValue="not an address" aria-label="invalid" />
			<Textarea
				rows={6}
				className="resize-none"
				placeholder="six rows, and no corner to drag"
				aria-label="fixed height"
			/>
		</div>
	);
}
