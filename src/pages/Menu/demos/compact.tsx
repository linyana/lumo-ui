import { CreditCard, Folder, Home, Settings } from 'lucide-react';
import { Menu } from '@/components/lumo/ui/Menu';

/** The rail: one glyph per row, and a row with children opens them in a popover instead. */
export default function Compact() {
	return (
		<div className="w-14">
			<Menu.Root compact>
				<Menu.Group>
					<Menu.List>
						<Menu.Item>
							<Menu.Button icon={<Home />} label="overview" href="#" isActive />
						</Menu.Item>
						<Menu.Item>
							<Menu.Button icon={<Folder />} label="projects" href="#" />
						</Menu.Item>
						<Menu.Item>
							<Menu.Sub icon={<CreditCard />} label="billing">
								<Menu.SubItem>
									<Menu.SubButton href="#">current plan</Menu.SubButton>
								</Menu.SubItem>
								<Menu.SubItem>
									<Menu.SubButton href="#">invoices</Menu.SubButton>
								</Menu.SubItem>
							</Menu.Sub>
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
