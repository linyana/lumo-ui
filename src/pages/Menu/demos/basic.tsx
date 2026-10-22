import { Bell, CreditCard, FileText, Folder, Search, Settings } from 'lucide-react';
import { Menu } from '@/components/lumo/ui/Menu';

export default function Basic() {
	return (
		<div className="w-full max-w-64">
			<Menu.Root>
				<Menu.Group>
					<Menu.GroupLabel>workspace</Menu.GroupLabel>
					<Menu.List>
						<Menu.Item>
							<Menu.Button icon={<Folder />} label="projects" href="#" isActive />
						</Menu.Item>
						<Menu.Item>
							<Menu.Button icon={<FileText />} label="drafts" href="#" />
							<Menu.Badge className="bg-muted text-muted-foreground">12</Menu.Badge>
						</Menu.Item>
						<Menu.Item>
							<Menu.Button icon={<Search />} label="search" href="#" />
						</Menu.Item>
					</Menu.List>
				</Menu.Group>
				<Menu.Separator />
				<Menu.Group>
					<Menu.GroupLabel>billing</Menu.GroupLabel>
					<Menu.List>
						<Menu.Item>
							<Menu.Sub icon={<CreditCard />} label="plan" defaultOpen>
								<Menu.SubItem>
									<Menu.SubButton href="#" isActive>
										current plan
									</Menu.SubButton>
								</Menu.SubItem>
								<Menu.SubItem>
									<Menu.SubButton href="#">invoices</Menu.SubButton>
								</Menu.SubItem>
							</Menu.Sub>
						</Menu.Item>
						<Menu.Item>
							<Menu.Button icon={<Bell />} label="notifications" onClick={() => {}} />
						</Menu.Item>
						<Menu.Item>
							<Menu.Button icon={<Settings />} label="settings" onClick={() => {}} />
						</Menu.Item>
					</Menu.List>
				</Menu.Group>
			</Menu.Root>
		</div>
	);
}
