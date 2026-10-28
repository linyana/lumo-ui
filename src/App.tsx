import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Layout, type LayoutMenuEntry, type LayoutMenuItem } from '@/components/lumo/blocks/Layout';
import { Menu } from '@/components/lumo/ui/Menu';
import { docRoutes, docSections } from '@/pages';
import { DocNeighborsProvider } from '@/pages/DocPage';
import { ThemeProvider } from '@/pages/theme';

const to = (path: string) => `/${path}`;

/** A row that is a route: the anchor comes from the router, the look from the menu. */
const row = (path: string, label: string): LayoutMenuItem => ({
	key: path,
	label,
	href: to(path),
	render: <NavLink to={to(path)} />,
});

const menu: LayoutMenuEntry[] = docSections.map((section): LayoutMenuEntry => ({
	type: 'group',
	label: section,
	children: docRoutes
		.filter((route) => route.section === section)
		.map(({ path, label }) => row(path, label)),
}));

/**
 * The shell, and the only place that knows the rail is a set of routes. Every row is a `NavLink`
 * handed to the menu through `render`, so the url selects the row — there is no second copy of
 * that state to keep in sync, and a reload or a shared link lands on the same page.
 */
export default function App() {
	const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
	// The shell reports the fold; where it is remembered is the app's business, so the cookie is
	// written here and never by Layout itself.
	const [folded, setFolded] = useState(() => document.cookie.includes('layout_folded=1'));
	const { pathname } = useLocation();

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}, [dark]);

	const selectedKey = pathname.split('/')[1] ?? '';
	const theme = useMemo(() => ({ dark, toggle: () => setDark((current) => !current) }), [dark]);
	const neighbors = useMemo(() => {
		const index = docRoutes.findIndex((route) => route.path === selectedKey);
		return {
			previous: index > 0 ? docRoutes[index - 1] : undefined,
			next: index >= 0 ? docRoutes[index + 1] : undefined,
		};
	}, [selectedKey]);

	return (
		<ThemeProvider value={theme}>
			<DocNeighborsProvider value={neighbors}>
				<Layout
					variant="default"
					menu={menu}
					selectedKey={selectedKey}
					resetScrollKey={pathname}
					logo={<img src="/logo.svg" alt="" className="size-5 shrink-0" />}
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
							<Menu.Item>
								<Menu.Button
									icon={dark ? <Sun /> : <Moon />}
									label={dark ? 'light theme' : 'dark theme'}
									onClick={() => setDark((current) => !current)}
								/>
							</Menu.Item>
						</Menu.List>
					}
				>
					<Layout.Content className="p-0">
						<Outlet />
					</Layout.Content>
				</Layout>
			</DocNeighborsProvider>
		</ThemeProvider>
	);
}
