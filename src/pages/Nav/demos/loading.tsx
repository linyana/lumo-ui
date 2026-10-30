import { Nav } from '@/components/ui/nav';

export default function Loading() {
	return (
		<div className="w-full max-w-64">
			<Nav.Root>
				<Nav.Group>
					<Nav.GroupLabel>workspace</Nav.GroupLabel>
					<Nav.List>
						<Nav.Item>
							<Nav.Skeleton showIcon width="60%" />
						</Nav.Item>
						<Nav.Item>
							<Nav.Skeleton showIcon width="45%" />
						</Nav.Item>
						<Nav.Item>
							<Nav.Skeleton width="35%" />
						</Nav.Item>
					</Nav.List>
				</Nav.Group>
			</Nav.Root>
		</div>
	);
}
