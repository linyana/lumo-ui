import { Input } from '@/components/lumo/ui/Input';

export default function States() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Input defaultValue="a value" aria-label="filled" />
			<Input readOnly defaultValue="read only" aria-label="read only" />
			<Input disabled placeholder="disabled" aria-label="disabled" />
			<Input aria-invalid defaultValue="not an address" aria-label="invalid" />
		</div>
	);
}
