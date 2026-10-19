import { PanelLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/lumo/Button';
import { Menu } from '@/components/lumo/Menu';
import { cn } from '@/lib/cn';
import type { LayoutMenuEntry, LayoutMenuItem } from '../types';

export type SidebarProps = {
	menu?: LayoutMenuEntry[];
	selectedKey?: string;
	onSelect?: (key: string) => void;
	logo?: ReactNode;
	title?: ReactNode;
	/** Rows for the bottom edge, rendered inside this rail's own menu root. */
	footer?: ReactNode;
	/** Whether the rail can narrow to its icons at all. */
	collapsible?: boolean;
	collapsed?: boolean;
	onToggle?: () => void;
	className?: string;
};

const noMenu: LayoutMenuEntry[] = [];

/**
 * The shell's navigation is what the eye lands on first, so its rows sit a notch above the
 * primitive's density: a 36px row and a 16px glyph — and the glyph at a fixed size rather than
 * the row's `1em`, because here the icon leads the label instead of following it.
 */
const row = 'h-9 [&_svg]:size-4';
const subRow = 'h-8 [&_svg]:size-4';

/**
 * The shell's left rail: a brand row, the menu, and whatever is pinned to the bottom. It paints
 * nothing of its own — the shell's fill shows through, which is what makes it read as grey next
 * to the card rather than as a second surface.
 */
export function Sidebar({
	menu = noMenu,
	selectedKey,
	onSelect,
	logo,
	title,
	footer,
	collapsible = false,
	collapsed = false,
	onToggle,
	className,
}: SidebarProps) {
	const isActive = (key: string, explicit?: boolean) => explicit ?? key === selectedKey;

	function renderItem(item: LayoutMenuItem) {
		const active = isActive(item.key, item.isActive);

		if (item.children !== undefined) {
			return (
				<Menu.Item key={item.key}>
					<Menu.Sub
						icon={item.icon}
						label={item.label}
						className={row}
						isActive={
							active ||
							item.children.some((child) => isActive(child.key, child.isActive))
						}
						defaultOpen={item.defaultOpen}
					>
						{item.children.map((child) => (
							<Menu.SubItem key={child.key}>
								<Menu.SubButton
									icon={child.icon}
									className={subRow}
									isActive={isActive(child.key, child.isActive)}
									disabled={child.disabled}
									onClick={() => {
										child.onClick?.();
										onSelect?.(child.key);
									}}
								>
									{child.label}
								</Menu.SubButton>
							</Menu.SubItem>
						))}
					</Menu.Sub>
				</Menu.Item>
			);
		}

		return (
			<Menu.Item key={item.key}>
				<Menu.Button
					icon={item.icon}
					label={item.label}
					className={row}
					isActive={active}
					disabled={item.disabled}
					render={item.href === undefined ? undefined : <a href={item.href} />}
					onClick={() => {
						item.onClick?.();
						onSelect?.(item.key);
					}}
				/>
				{item.badge !== undefined && <Menu.Badge>{item.badge}</Menu.Badge>}
			</Menu.Item>
		);
	}

	function renderEntry(entry: LayoutMenuEntry, index: number) {
		if (entry.type === 'separator') return <Menu.Separator key={`separator-${index}`} />;

		if (entry.type === 'skeleton') {
			return (
				<Menu.Skeleton
					key={`skeleton-${index}`}
					showIcon={entry.showIcon}
					width={entry.width}
				/>
			);
		}

		if (entry.type === 'group') {
			return (
				<Menu.Group key={entry.label ?? `group-${index}`}>
					{entry.label !== undefined && <Menu.GroupLabel>{entry.label}</Menu.GroupLabel>}
					{entry.action}
					<Menu.List>
						{entry.children.map((child, childIndex) => renderEntry(child, childIndex))}
					</Menu.List>
				</Menu.Group>
			);
		}

		return renderItem(entry);
	}

	/**
	 * Groups are padded; a loose row is not, so a row typed straight into the array would sit
	 * against the rail's edge while its neighbours sit 8px in. Everything outside a group is
	 * wrapped in one, and an unbroken run of them shares a single group instead of gaining a
	 * gap per row.
	 */
	function renderEntries(entries: LayoutMenuEntry[]) {
		const blocks = entries.reduce<(LayoutMenuEntry | LayoutMenuEntry[])[]>((acc, entry) => {
			if (entry.type === 'group' || entry.type === 'separator') return [...acc, entry];

			const last = acc[acc.length - 1];
			return Array.isArray(last)
				? [...acc.slice(0, -1), [...last, entry]]
				: [...acc, [entry]];
		}, []);

		return blocks.map((block, index) =>
			Array.isArray(block) ? (
				<Menu.Group
					key={`loose-${block.map((entry) => ('key' in entry ? entry.key : entry.type)).join('-')}`}
				>
					<Menu.List>{block.map(renderEntry)}</Menu.List>
				</Menu.Group>
			) : (
				renderEntry(block, index)
			),
		);
	}

	return (
		<aside
			data-slot="layout-sidebar"
			data-collapsed={collapsed ? '' : undefined}
			className={cn(
				'hidden h-full shrink-0 flex-col overflow-hidden md:flex',
				'transition-[width] duration-(--duration-state) ease-linear',
				collapsed ? 'w-12' : 'w-64',
				className,
			)}
		>
			{(logo !== undefined || title !== undefined || collapsible) && (
				<div
					data-slot="layout-brand"
					className="flex h-14 shrink-0 items-center gap-2 px-2 text-sm font-semibold [&_svg]:size-4 [&_svg]:shrink-0"
				>
					{!collapsed && (logo !== undefined || title !== undefined) && (
						<div className="flex min-w-0 flex-1 items-center gap-2 ps-2">
							{logo}
							{title !== undefined && <span className="truncate">{title}</span>}
						</div>
					)}
					{collapsible && (
						<Button
							variant="ghost"
							size="icon"
							className="ms-auto size-8 shrink-0"
							aria-label={collapsed ? 'expand sidebar' : 'collapse sidebar'}
							aria-expanded={!collapsed}
							onClick={onToggle}
						>
							<PanelLeft />
						</Button>
					)}
				</div>
			)}
			<Menu.Root
				compact={collapsed}
				className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
			>
				{renderEntries(menu)}
			</Menu.Root>
			{footer !== undefined && (
				<div data-slot="layout-footer" className="shrink-0 p-2">
					<Menu.Root compact={collapsed}>{footer}</Menu.Root>
				</div>
			)}
		</aside>
	);
}
