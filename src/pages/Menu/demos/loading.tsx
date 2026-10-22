import { Menu } from '@/components/lumo/ui/Menu';

export default function Loading() {
	return (
		<div className="w-full max-w-64">
			<Menu.Root>
				<Menu.Group>
					<Menu.GroupLabel>workspace</Menu.GroupLabel>
					<Menu.List>
						<Menu.Item>
							<Menu.Skeleton showIcon width="60%" />
						</Menu.Item>
						<Menu.Item>
							<Menu.Skeleton showIcon width="45%" />
						</Menu.Item>
						<Menu.Item>
							<Menu.Skeleton width="35%" />
						</Menu.Item>
					</Menu.List>
				</Menu.Group>
			</Menu.Root>
		</div>
	);
}
