import { Avatar } from '@/components/lumo/ui/Avatar';

// The site's own mark, in `public/`; a project brings its own picture.
const picture = '/logo.svg';

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
