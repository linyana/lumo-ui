import { Avatar } from '@/components/ui/avatar';

// A stock portrait, cut to a square on the face by the CDN on the way out — so the picture arrives
// in the shape the circle wants and needs no crop of its own. A project brings its own.
const picture =
	'https://ix-marketing.imgix.net/img-smart-crop_before.png?fit=facearea&facepad=3&w=128&h=128&auto=format,compress&q=80';

export default function Group() {
	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Image src={picture} alt="" />
					<Avatar.Fallback>LT</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>林</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>MQ</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback className="text-muted-foreground">+3</Avatar.Fallback>
				</Avatar.Root>
			</Avatar.Group>
			<p className="text-sm text-muted-foreground">7 members</p>
		</div>
	);
}
