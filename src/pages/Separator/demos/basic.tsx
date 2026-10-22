import { Separator } from '@/components/lumo/ui/Separator';

export default function Basic() {
	return (
		<div className="w-full max-w-sm rounded-lg border p-4 text-sm">
			<div>project settings</div>
			<Separator className="my-3" />
			<div className="flex items-center gap-3 text-xs text-muted-foreground">
				<span>3 members</span>
				<Separator orientation="vertical" className="h-4" />
				<span>updated today</span>
			</div>
		</div>
	);
}
