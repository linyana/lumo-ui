import { Avatar } from '@/components/lumo/ui/Avatar';

const portrait = 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&q=80';

export default function Group() {
	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Image src={portrait} alt="" />
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
