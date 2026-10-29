import { User } from 'lucide-react';
import { Avatar } from '@/components/lumo/ui/Avatar';

// The site's own mark, in `public/`; a project brings its own picture.
const picture = '/logo.svg';

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
