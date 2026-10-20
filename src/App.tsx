import { useEffect, useMemo, useState } from 'react';
import { Layers, User } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Layout, type LayoutMenuEntry, type LayoutMenuItem } from '@/components/blocks/Layout';
import { Menu } from '@/components/lumo/Menu';
import { docRoutes } from '@/pages';
import { ThemeProvider } from '@/pages/theme';

const to = (path: string) => `/${path}`;

/** A row that is a route: the anchor comes from the router, the look from the menu. */
const row = (path: string, label: string): LayoutMenuItem => ({
	key: path,
	label,
	href: to(path),
	render: <NavLink to={to(path)} />,
});

const gettingStarted = ['overview', 'layout'];
const components = docRoutes.filter(({ path }) => !gettingStarted.includes(path));

const menu: LayoutMenuEntry[] = [
	{
		type: 'group',
		label: 'getting started',
		children: docRoutes
			.filter(({ path }) => gettingStarted.includes(path))
			.map(({ path, label }) => row(path, label)),
	},
	{
		type: 'group',
		label: 'components',
		children: components.map(({ path, label }) => row(path, label)),
	},
];

/**
 * The shell, and the only place that knows the rail is a set of routes. Every row is a `NavLink`
 * handed to the menu through `render`, so the url selects the row — there is no second copy of
 * that state to keep in sync, and a reload or a shared link lands on the same page.
 */
export default function App() {
	const [dark, setDark] = useState(false);
	// The shell reports the fold; where it is remembered is the app's business, so the cookie is
	// written here and never by Layout itself.
	const [folded, setFolded] = useState(() => document.cookie.includes('layout_folded=1'));
	const { pathname } = useLocation();

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
	}, [dark]);

	const selectedKey = pathname.split('/')[1] ?? '';
	const theme = useMemo(() => ({ dark, toggle: () => setDark((current) => !current) }), [dark]);

	return (
		<ThemeProvider value={theme}>
			<Layout
				menu={menu}
				selectedKey={selectedKey}
				logo={<Layers />}
				title="lumo-ui"
				collapsible
				collapsed={folded}
				onCollapsedChange={(next) => {
					setFolded(next);
					document.cookie = `layout_folded=${next ? 1 : 0}; path=/; max-age=2592000`;
				}}
				footer={
					<Menu.List>
						<Menu.Item>
							<Menu.Button icon={<User />} label="account" />
						</Menu.Item>
					</Menu.List>
				}
			>
				<Layout.Content className="p-0">
					<Outlet />
				</Layout.Content>
			</Layout>
		</ThemeProvider>
	);
}
