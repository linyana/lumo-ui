import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
	Blocks,
	BookOpen,
	Component,
	FileText,
	House,
	Moon,
	Sparkles,
	Sun,
	Terminal,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Layout, type LayoutNavEntry, type LayoutNavItem } from '@/components/blocks/layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { docRoutes, docSections } from '@/pages';
import { DocNeighborsProvider } from '@/pages/DocPage';
import { ThemeProvider } from '@/pages/theme';
import { GitHub } from '@/pages/icons';

const to = (path: string) => `/${path}`;

const repo = 'https://github.com/linyana/lumo-ui';

const navIcons: Record<string, ReactNode> = {
	overview: <BookOpen />,
	installation: <Terminal />,
	'skills.md': <Sparkles />,
	'llms.txt': <FileText />,
};

/** A row that is a route: the anchor comes from the router, the look from the nav. */
const row = (path: string, label: string): LayoutNavItem => ({
	key: path,
	label,
	icon: navIcons[path],
	href: to(path),
	render: <NavLink to={to(path)} />,
});

/** The raw documents the rail ends with: files an agent fetches, not routes this app renders. */
const agentDocs = ['skills.md', 'llms.txt'];

const nav: LayoutNavEntry[] = docSections.flatMap((section): LayoutNavEntry[] => {
	const children = docRoutes
		.filter((route) => route.section === section)
		.map(({ path, label }) => row(path, label));

	if (section === 'Getting Started') {
		children.unshift({
			key: 'home',
			label: 'Home',
			icon: <House />,
			href: '/',
			render: <NavLink to="/" end />,
		});
		children.push(
			...agentDocs.map((file) => ({
				key: file,
				label: file,
				icon: navIcons[file],
				href: `/${file}`,
				render: <a href={`/${file}`} target="_blank" rel="noreferrer" />,
			})),
		);
	}

	if (section === 'Getting Started') {
		return [{ type: 'group', label: section, children }, { type: 'separator' }];
	}

	return [
		{
			key: section,
			label: section,
			icon: section === 'Components' ? <Component /> : <Blocks />,
			children,
			defaultOpen: false,
		},
	];
});

/**
 * The shell owns routing: page rows use `NavLink`, while raw documents use plain anchors.
 * The url selects the page row — there is no second copy of that state to keep in sync,
 * and a reload or a shared link lands on the same page.
 */
export default function App() {
	const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
	const { pathname } = useLocation();

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}, [dark]);

	const selectedKey = pathname.split('/')[1] || 'home';
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
					title="Lumo UI"
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
