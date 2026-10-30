import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Layout, type LayoutNavEntry, type LayoutNavItem } from '@/components/blocks/layout';
import { Button } from '@/components/ui/button';
import { docRoutes, docSections } from '@/pages';
import { DocNeighborsProvider } from '@/pages/DocPage';
import { ThemeProvider } from '@/pages/theme';

const to = (path: string) => `/${path}`;

/** A row that is a route: the anchor comes from the router, the look from the nav. */
const row = (path: string, label: string): LayoutNavItem => ({
	key: path,
	label,
	href: to(path),
	render: <NavLink to={to(path)} />,
});

const nav: LayoutNavEntry[] = docSections.map((section): LayoutNavEntry => ({
	type: 'group',
	label: section,
	children: docRoutes
		.filter((route) => route.section === section)
		.map(({ path, label }) => row(path, label)),
}));

/**
 * The shell, and the only place that knows the rail is a set of routes. Every row is a `NavLink`
 * handed to the nav through `render`, so the url selects the row — there is no second copy of
 * that state to keep in sync, and a reload or a shared link lands on the same page.
 */
export default function App() {
	const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
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
					nav={nav}
					selectedKey={selectedKey}
					resetScrollKey={pathname}
					logo={<img src="/logo.svg" alt="" className="size-5 shrink-0" />}
					title="lumo-ui"
					brandActions={
						<Button
							variant="ghost"
							size="icon"
							className="size-8 shrink-0"
							aria-label={dark ? 'light theme' : 'dark theme'}
							onClick={() => setDark((current) => !current)}
						>
							{dark ? <Sun /> : <Moon />}
						</Button>
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
