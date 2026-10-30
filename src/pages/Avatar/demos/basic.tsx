import { User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

// A stock portrait, cut to a square on the face by the CDN on the way out — so the picture arrives
// in the shape the circle wants and needs no crop of its own. A project brings its own.
const picture =
	'https://ix-marketing.imgix.net/img-smart-crop_before.png?fit=facearea&facepad=3&w=128&h=128&auto=format,compress&q=80';

const sizes = ['sm', 'md', 'lg'] as const;

export default function Basic() {
	return (
		<div className="flex flex-col items-center gap-5">
			<div className="flex items-center gap-3">
				{sizes.map((size) => (
					<Avatar.Root key={size} size={size}>
						<Avatar.Image src={picture} alt="" />
						<Avatar.Fallback>LT</Avatar.Fallback>
					</Avatar.Root>
				))}
			</div>
			<div className="flex items-center gap-3">
				<Avatar.Root>
					<Avatar.Fallback>LT</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>林</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>
						<User />
					</Avatar.Fallback>
				</Avatar.Root>
			</div>
		</div>
	);
}
