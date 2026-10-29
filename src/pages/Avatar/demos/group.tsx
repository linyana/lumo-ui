import { Avatar } from '@/components/lumo/ui/Avatar';

// The site's own mark, in `public/`; a project brings its own picture. It is drawn inside its own
// black tile with a margin of air, which `scale-110` throws away: without it the tile's corners sit
// inside the circle, and the avatar reads as a rounded square on a light ground.
const picture = '/logo.svg';

export default function Group() {
	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Image src={picture} alt="" className="scale-110" />
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
