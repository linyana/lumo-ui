import type { ReactNode } from 'react';

export type LayoutMenuItem = {
	type?: 'item';
	key: string;
	label: string;
	icon?: ReactNode;
	/** A count or a state on the row's trailing edge. */
	badge?: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
	/** Renders the row as a link; the key still reports through `onSelect`. */
	href?: string;
	/** Marks the row as current regardless of `selectedKey`. */
	isActive?: boolean;
	/** Sub rows: the row expands in place instead of navigating. */
	children?: LayoutMenuItem[];
	defaultOpen?: boolean;
};

export type LayoutMenuGroup = {
	type: 'group';
	label?: string;
	/**
	 * A control of the group's own, such as an add button. Rendered as given, so pass one that
	 * positions itself — `Menu.GroupAction` already does.
	 */
	action?: ReactNode;
	children: LayoutMenuEntry[];
};

export type LayoutMenuSeparator = { type: 'separator' };

/** One placeholder row, for a menu that is still loading. */
export type LayoutMenuSkeleton = { type: 'skeleton'; showIcon?: boolean; width?: string };

export type LayoutMenuEntry =
	| LayoutMenuItem
	| LayoutMenuGroup
	| LayoutMenuSeparator
	| LayoutMenuSkeleton;
