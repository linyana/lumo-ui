import { Folder, Home, Settings } from 'lucide-react';
import { useState } from 'react';
import { Layout, type LayoutNavEntry } from '@/components/blocks/layout';

const nav: LayoutNavEntry[] = [
	{ key: 'overview', label: 'Overview', icon: <Home /> },
	{
		key: 'projects',
		label: 'Projects',
		icon: <Folder />,
		defaultOpen: true,
		children: [
			{ key: 'library', label: 'Component library' },
			{ key: 'website', label: 'Website' },
		],
	},
	{
		key: 'settings',
		label: 'Settings',
		icon: <Settings />,
		disabled: true,
		defaultOpen: true,
		children: [{ key: 'members', label: 'Members' }],
	},
];

export default function Responsive() {
	const [selected, setSelected] = useState('overview');

	return (
		<Layout
			nav={nav}
			selectedKey={selected}
			onSelect={setSelected}
			title="Workspace"
			collapsible
			className="h-80 w-full rounded-lg border"
		>
			<Layout.Header title={selected} />
			<Layout.Content>
				<p className="text-sm text-muted-foreground">
					On a narrow viewport, open navigation from the bar above. Choose a destination
					to close the drawer. Settings and its members remain disabled in either layout.
				</p>
			</Layout.Content>
		</Layout>
	);
}
