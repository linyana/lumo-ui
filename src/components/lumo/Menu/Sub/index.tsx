import type { ReactNode } from 'react';
import { Collapsible } from '@/components/lumo/Collapsible';
import { Button as MenuRow } from '@/components/lumo/Menu/Button';
import { useMenu } from '@/components/lumo/Menu/context';
import { SubList } from '@/components/lumo/Menu/SubList';
import { Popover } from '@/components/lumo/Popover';
import { cn } from '@/lib/cn';

export type SubProps = {
	icon?: ReactNode;
	label: string;
	/** `SubItem` rows. The same ones serve the inline list and the compact popover. */
	children: ReactNode;
	className?: string;
	/** Highlights the row, so a parent reads as current when one of its children is. */
	isActive?: boolean;
	defaultOpen?: boolean;
	/** Which side the popover opens on when the menu is compact. Defaults to the row's right. */
	popoverSide?: 'top' | 'right' | 'bottom' | 'left';
};

/**
 * A row that owns a list of sub rows: it expands inline when the menu has width, and opens a
 * popover instead once it is compact, because there is no room left to expand into.
 */
export function Sub({
	icon,
	label,
	children,
	className,
	isActive = false,
	defaultOpen = false,
	popoverSide = 'right',
}: SubProps) {
	const { compact } = useMenu();

	if (compact) {
		return (
			<Popover.Root>
				<Popover.Trigger
					openOnHover
					delay={80}
					render={
						<MenuRow
							icon={icon}
							label={label}
							isActive={isActive}
							tooltip={false}
							className={className}
						/>
					}
				/>
				<Popover.Portal>
					<Popover.Positioner side={popoverSide} align="start">
						<Popover.Popup className="w-56 p-1.5">
							<Popover.Title className="px-2 py-1 text-xs font-medium text-muted-foreground">
								{label}
							</Popover.Title>
							<SubList className="ms-0 me-0 border-s-0 ps-0">{children}</SubList>
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			</Popover.Root>
		);
	}

	return (
		<Collapsible.Root defaultOpen={defaultOpen}>
			<Collapsible.Trigger
				render={
					<MenuRow
						icon={icon}
						label={label}
						isActive={isActive}
						className={cn('group', className)}
					>
						<Collapsible.Icon className="ms-auto" />
					</MenuRow>
				}
			/>
			<Collapsible.Panel>
				<SubList>{children}</SubList>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
