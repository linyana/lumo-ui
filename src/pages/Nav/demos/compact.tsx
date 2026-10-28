import { CreditCard, Folder, Home, Settings } from 'lucide-react';
import { Nav } from '@/components/lumo/ui/Nav';

/** The rail: one glyph per row, and a row with children opens them in a popover instead. */
export default function Compact() {
	return (
		<div className="w-14">
			<Nav.Root compact>
				<Nav.Group>
					<Nav.List>
						<Nav.Item>
							<Nav.Button icon={<Home />} label="overview" href="#" isActive />
						</Nav.Item>
						<Nav.Item>
							<Nav.Button icon={<Folder />} label="projects" href="#" />
						</Nav.Item>
						<Nav.Item>
							<Nav.Sub icon={<CreditCard />} label="billing">
								<Nav.SubItem>
									<Nav.SubButton href="#">current plan</Nav.SubButton>
								</Nav.SubItem>
								<Nav.SubItem>
									<Nav.SubButton href="#">invoices</Nav.SubButton>
								</Nav.SubItem>
							</Nav.Sub>
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
