import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ComponentProps,
	type ReactNode,
} from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/cn';
import { Content } from './Content';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { LayoutMenuEntry } from './types';

export const layoutVariants = tv({
	slots: {
		// The shell's fill is the sidebar's: nothing paints the rail, and in `default` the card
		// rises above the same colour, so one token covers both.
		root: 'flex h-svh w-full overflow-hidden bg-muted',
		main: 'flex min-w-0 flex-1 flex-col',
		// `relative` makes the scroll box a containing block: an absolutely positioned descendant —
		// Base UI's hidden checkbox input, most of the time — would otherwise sit against the initial
		// containing block, escape this box's clipping and give the document a scrollbar of its own.
		surface: 'relative flex h-full min-w-0 flex-col overflow-y-auto',
	},
	variants: {
		variant: {
			/** A rail, then a card inset on every edge. */
			default: {
				main: 'p-2 ps-0',
				surface: 'rounded-xl border bg-card text-card-foreground',
			},
			/** A rail only: the content is the page, edge to edge. */
			plain: {
				surface: 'bg-background',
			},
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

// `onSelect` is a div's own event; here the name belongs to the menu, so the DOM handler goes.
export type LayoutProps = Omit<ComponentProps<'div'>, 'title' | 'onSelect'> & {
	variant?: VariantProps<typeof layoutVariants>['variant'];
	/** Rows, groups and separators, in the order the rail draws them. */
	menu?: LayoutMenuEntry[];
	selectedKey?: string;
	onSelect?: (key: string) => void;
	/** The brand mark in the rail's top-left, sized to its text. */
	logo?: ReactNode;
	title?: ReactNode;
	/** Pinned to the rail's bottom edge: an account row, a version, a status. */
	footer?: ReactNode;
	/** Lets the rail narrow to its icons: the brand row carries the toggle, and cmd/ctrl+b does it. */
	collapsible?: boolean;
	/** Opens narrowed. The uncontrolled starting point — store it yourself in `onCollapsedChange`. */
	defaultCollapsed?: boolean;
	/** Controlled; pass `onCollapsedChange` to keep it. */
	collapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	/**
	 * Scroll the surface back to the top whenever this changes — a route's path, most of the time.
	 * The shell owns the box that scrolls, so the shell is what puts it back; a page has no way to.
	 */
	resetScrollKey?: string;
};

function LayoutRoot({
	variant = 'default',
	menu,
	selectedKey,
	onSelect,
	logo,
	title,
	footer,
	collapsible = false,
	defaultCollapsed = false,
	collapsed,
	onCollapsedChange,
	resetScrollKey,
	className,
	children,
	...props
}: LayoutProps) {
	const { root, main, surface } = layoutVariants({ variant });
	const [uncontrolled, setUncontrolled] = useState(defaultCollapsed);
	const isCollapsed = collapsed ?? uncontrolled;
	const surfaceRef = useRef<HTMLElement>(null);
	const shownKey = useRef(resetScrollKey);

	// Before paint, so the page arriving is never seen at the height of the one leaving. Only a change
	// scrolls: a shell that is mounted is already at the top of whatever it was opened on.
	useLayoutEffect(() => {
		if (shownKey.current === resetScrollKey) return;
		shownKey.current = resetScrollKey;
		surfaceRef.current?.scrollTo({ top: 0, behavior: 'instant' });
	}, [resetScrollKey]);

	const toggle = useCallback(() => {
		const next = !isCollapsed;
		setUncontrolled(next);
		onCollapsedChange?.(next);
	}, [isCollapsed, onCollapsedChange]);

	// The rail's own shortcut: chrome behaviour, so the shell owns it — but only when it asked
	// to be collapsible, and only the state, never where that state is remembered.
	useEffect(() => {
		if (!collapsible) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggle();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [collapsible, toggle]);

	return (
		<div
			data-slot="layout"
			data-variant={variant}
			data-collapsed={isCollapsed ? '' : undefined}
			className={cn(root(), className)}
			{...props}
		>
			<Sidebar
				menu={menu}
				selectedKey={selectedKey}
				onSelect={onSelect}
				logo={logo}
				title={title}
				footer={footer}
				collapsible={collapsible}
				collapsed={isCollapsed}
				onToggle={toggle}
			/>
			<div data-slot="layout-main" className={main()}>
				<main ref={surfaceRef} data-slot="layout-surface" className={surface()}>
					{children}
				</main>
			</div>
		</div>
	);
}

/**
 * The app shell — the one component here that is not a Base UI primitive. It owns the rail, the
 * scroll container and the surface above it; the page owns everything inside, header included.
 * So it takes the data a shell has (a variant, a menu, a selection) and hangs the page's parts
 * off the same name, the way antd's Layout does.
 */
export const Layout = Object.assign(LayoutRoot, { Header, Content });

export type { LayoutMenuEntry, LayoutMenuItem } from './types';
export type { HeaderProps } from './Header';
export type { ContentProps } from './Content';
export type { SidebarProps } from './Sidebar';
