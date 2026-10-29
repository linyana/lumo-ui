import { useState } from 'react';
import { Bell, CreditCard, FileText, Folder, Search, Settings } from 'lucide-react';
import { Nav } from '@/components/lumo/ui/Nav';

/** The nav only reports a selection; what it means is the page's business. */
export default function Basic() {
	const [current, setCurrent] = useState('drafts');

	return (
		<div className="w-full max-w-64">
			<Nav.Root>
				<Nav.Group>
					<Nav.GroupLabel>workspace</Nav.GroupLabel>
					<Nav.List>
						<Nav.Item>
							<Nav.Button
								icon={<Folder />}
								label="projects"
								isActive={current === 'projects'}
								onClick={() => setCurrent('projects')}
							/>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button
								icon={<FileText />}
								label="drafts"
								isActive={current === 'drafts'}
								onClick={() => setCurrent('drafts')}
							/>
							<Nav.Badge className="bg-muted text-muted-foreground">12</Nav.Badge>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button
								icon={<Search />}
								label="search"
								isActive={current === 'search'}
								onClick={() => setCurrent('search')}
							/>
						</Nav.Item>
					</Nav.List>
				</Nav.Group>
				<Nav.Separator />
				<Nav.Group>
					<Nav.GroupLabel>billing</Nav.GroupLabel>
					<Nav.List>
						<Nav.Item>
							<Nav.Sub
								icon={<CreditCard />}
								label="plan"
								isActive={current.startsWith('plan/')}
								defaultOpen
							>
								<Nav.SubItem>
									<Nav.SubButton
										isActive={current === 'plan/current'}
										onClick={() => setCurrent('plan/current')}
									>
										current plan
									</Nav.SubButton>
								</Nav.SubItem>
								<Nav.SubItem>
									<Nav.SubButton
										isActive={current === 'plan/invoices'}
										onClick={() => setCurrent('plan/invoices')}
									>
										invoices
									</Nav.SubButton>
								</Nav.SubItem>
							</Nav.Sub>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button
								icon={<Bell />}
								label="notifications"
								isActive={current === 'notifications'}
								onClick={() => setCurrent('notifications')}
							/>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button
								icon={<Settings />}
								label="settings"
								isActive={current === 'settings'}
								onClick={() => setCurrent('settings')}
							/>
						</Nav.Item>
					</Nav.List>
				</Nav.Group>
			</Nav.Root>
		</div>
	);
}
