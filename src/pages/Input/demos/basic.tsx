import { Input } from '@/components/ui/input';

export default function Basic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Input placeholder="a single line of text" aria-label="a single line of text" />
			<Input type="password" defaultValue="hunter2" aria-label="password" />
		</div>
	);
}
