import { SiGithub } from '@icons-pack/react-simple-icons';
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Blocks,
	BookOpen,
	Component,
	FileText,
	House,
	Moon,
	Search,
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
import { DocSearch, type SearchPage } from '@/pages/DocSearch';
import { ThemeProvider } from '@/pages/theme';

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

function SearchTrigger({
	className,
	children,
	shortcut,
	...props
}: ComponentProps<'button'> & { shortcut: string }) {
	return (
		<button
			{...props}
			data-doc-search-trigger=""
			className={cn(
				className,
				'border border-input bg-background/60 text-muted-foreground',
				'hover:border-input-strong hover:text-foreground',
			)}
		>
			{children}
			<kbd
				aria-hidden="true"
				className={cn(
					'ms-auto inline-flex h-5 shrink-0 items-center rounded-sm border bg-muted/60 px-1',
					'font-sans text-xs leading-none text-muted-foreground',
				)}
			>
				{shortcut}
			</kbd>
		</button>
	);
}

const searchPages: SearchPage[] = [
	{ path: '', label: 'Home', section: 'Getting Started' },
	...docRoutes.map(({ path, label, section }) => ({ path, label, section })),
];

/**
 * The shell owns routing: page rows use `NavLink`, while raw documents use plain anchors.
 * The url selects the page row — there is no second copy of that state to keep in sync,
 * and a reload or a shared link lands on the same page.
 */
export default function App() {
	const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
	const { pathname } = useLocation();
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchRoute, setSearchRoute] = useState(pathname);
	const shell = useRef<HTMLDivElement>(null);
	const searchOrigin = useRef<HTMLElement | null>(null);
	const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';

	if (searchRoute !== pathname) {
		setSearchRoute(pathname);
		setSearchOpen(false);
	}

	const openSearch = useCallback(() => {
		searchOrigin.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		setSearchOpen(true);
	}, []);

	const returnSearchFocus = useCallback(() => {
		const origin = searchOrigin.current;
		if (
			origin?.isConnected &&
			origin !== document.body &&
			origin.getClientRects().length > 0 &&
			!origin.closest('[data-slot="layout-mobile-navigation"]')
		) {
			return origin;
		}
		const layout = shell.current;
		if (!layout) return null;
		const mobile = layout.querySelector<HTMLElement>('[data-slot="layout-navigation-trigger"]');
		if (mobile && mobile.getClientRects().length > 0) return mobile;
		return layout.querySelector<HTMLElement>('[data-doc-search-trigger]');
	}, []);

	const navigation = useMemo<LayoutNavEntry[]>(
		() => [
			{
				key: 'search',
				label: 'Search',
				icon: <Search />,
				render: (
					<SearchTrigger
						type="button"
						shortcut={shortcut}
						aria-haspopup="dialog"
						aria-keyshortcuts="Control+k Meta+k"
					/>
				),
				onClick: openSearch,
			},
			...nav,
		],
		[openSearch, shortcut],
	);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				event.defaultPrevented ||
				event.isComposing ||
				event.repeat ||
				event.altKey ||
				event.shiftKey ||
				!(event.metaKey || event.ctrlKey) ||
				event.key.toLowerCase() !== 'k'
			) {
				return;
			}
			if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
			event.preventDefault();
			openSearch();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [openSearch]);

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
					ref={shell}
					variant="default"
					nav={navigation}
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
								<SiGithub aria-hidden="true" />
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
				<DocSearch
					pages={searchPages}
					open={searchOpen}
					onOpenChange={setSearchOpen}
					finalFocus={returnSearchFocus}
				/>
			</DocNeighborsProvider>
		</ThemeProvider>
	);
}
