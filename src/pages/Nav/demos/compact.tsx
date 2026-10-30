import { useState } from 'react';
import { CreditCard, Folder, Home, Settings } from 'lucide-react';
import { Nav } from '@/components/ui/nav';

/** The rail: one glyph per row, and a row with children opens them in a popover instead. */
export default function Compact() {
	const [current, setCurrent] = useState('overview');

	return (
		<div className="w-14">
			<Nav.Root compact>
				<Nav.Group>
					<Nav.List>
						<Nav.Item>
							<Nav.Button
								icon={<Home />}
								label="overview"
								isActive={current === 'overview'}
								onClick={() => setCurrent('overview')}
							/>
						</Nav.Item>
						<Nav.Item>
							<Nav.Button
								icon={<Folder />}
								label="projects"
								isActive={current === 'projects'}
								onClick={() => setCurrent('projects')}
							/>
						</Nav.Item>
						<Nav.Item>
							<Nav.Sub
								icon={<CreditCard />}
								label="billing"
								isActive={current.startsWith('billing/')}
							>
								<Nav.SubItem>
									<Nav.SubButton
										isActive={current === 'billing/current'}
										onClick={() => setCurrent('billing/current')}
									>
										current plan
									</Nav.SubButton>
								</Nav.SubItem>
								<Nav.SubItem>
									<Nav.SubButton
										isActive={current === 'billing/invoices'}
										onClick={() => setCurrent('billing/invoices')}
									>
										invoices
									</Nav.SubButton>
								</Nav.SubItem>
							</Nav.Sub>
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
