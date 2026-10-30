import { useEffect, useMemo, useState } from 'react';
import { createLucideIcon, Moon, Sun } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Layout, type LayoutNavEntry, type LayoutNavItem } from '@/components/blocks/layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { docRoutes, docSections } from '@/pages';
import { DocNeighborsProvider } from '@/pages/DocPage';
import { ThemeProvider } from '@/pages/theme';

const to = (path: string) => `/${path}`;

const repo = 'https://github.com/linyana/lumo-ui';

/** lucide ships no brand marks, so the GitHub one is drawn on its grid and its size, filled. */
const GitHub = createLucideIcon('GitHub', [
	[
		'path',
		{
			fill: 'currentColor',
			stroke: 'none',
			d: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z',
		},
	],
]);

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
						<>
							{/*
							 * A link, not a control: it gets the button's look and nothing of its behaviour,
							 * so it stays a link to a screen reader and keeps the context menu's copy address.
							 */}
							<a
								href={repo}
								target="_blank"
								rel="noreferrer"
								aria-label="GitHub"
								className={cn(
									buttonVariants({ variant: 'ghost', size: 'icon' }),
									'size-8 shrink-0',
								)}
							>
								<GitHub />
							</a>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 shrink-0"
								aria-label={dark ? 'light theme' : 'dark theme'}
								onClick={() => setDark((current) => !current)}
							>
								{dark ? <Sun /> : <Moon />}
							</Button>
						</>
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
