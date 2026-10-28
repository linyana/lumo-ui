import { Bell, CreditCard, FileText, Folder, Search, Settings } from 'lucide-react';
import { Nav } from '@/components/lumo/ui/Nav';

export default function Basic() {
	return (
		<div className="w-full max-w-64">
			<Nav.Root>
				<Nav.Group>
					<Nav.GroupLabel>workspace</Nav.GroupLabel>
					<Nav.List>
						<Nav.Item>
							<Nav.Button icon={<Folder />} label="projects" href="#" isActive />
						</Nav.Item>
						<Nav.Item>
							<Nav.Button icon={<FileText />} label="drafts" href="#" />
							<Nav.Badge className="bg-muted text-muted-foreground">12</Nav.Badge>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button icon={<Search />} label="search" href="#" />
						</Nav.Item>
					</Nav.List>
				</Nav.Group>
				<Nav.Separator />
				<Nav.Group>
					<Nav.GroupLabel>billing</Nav.GroupLabel>
					<Nav.List>
						<Nav.Item>
							<Nav.Sub icon={<CreditCard />} label="plan" defaultOpen>
								<Nav.SubItem>
									<Nav.SubButton href="#" isActive>
										current plan
									</Nav.SubButton>
								</Nav.SubItem>
								<Nav.SubItem>
									<Nav.SubButton href="#">invoices</Nav.SubButton>
								</Nav.SubItem>
							</Nav.Sub>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button icon={<Bell />} label="notifications" onClick={() => {}} />
						</Nav.Item>
						<Nav.Item>
							<Nav.Button icon={<Settings />} label="settings" onClick={() => {}} />
						</Nav.Item>
					</Nav.List>
				</Nav.Group>
			</Nav.Root>
		</div>
	);
}
