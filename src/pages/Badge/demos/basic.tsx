import { Badge } from '@/components/ui/badge';

export default function Basic() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-2">
			<Badge>new</Badge>
			<Badge variant="secondary">draft</Badge>
			<Badge variant="outline">archived</Badge>
			<Badge variant="success">passed</Badge>
			<Badge variant="warning">waiting</Badge>
			<Badge variant="info">beta</Badge>
			<Badge variant="destructive">failed</Badge>
		</div>
	);
}
