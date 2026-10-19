import type { ComponentProps, CSSProperties } from 'react';
import { Skeleton as BaseSkeleton } from '@/components/lumo/Skeleton';
import { cn } from '@/lib/cn';

export type SkeletonProps = ComponentProps<'div'> & {
	showIcon?: boolean;
	/** Deterministic on purpose: a random width differs between server and client. */
	width?: string;
};

/** One row while the navigation is loading. Pair several to fill a group. */
export function Skeleton({ className, showIcon = false, width = '70%', ...props }: SkeletonProps) {
	return (
		<div
			data-slot="menu-skeleton"
			className={cn(
				'flex h-8 items-center gap-2 rounded-md px-2',
				// Same square as a real row, so the rail loads into its final shape.
				'group-data-[compact]:size-8! group-data-[compact]:justify-center',
				'group-data-[compact]:gap-0 group-data-[compact]:px-0',
				className,
			)}
			{...props}
		>
			{showIcon ? (
				<BaseSkeleton data-slot="menu-skeleton-icon" className="size-4" />
			) : (
				<BaseSkeleton
					data-slot="menu-skeleton-initial"
					className="hidden size-4 group-data-[compact]:block"
				/>
			)}
			<BaseSkeleton
				data-slot="menu-skeleton-text"
				className="h-4 flex-1 group-data-[compact]:hidden"
				style={{ maxWidth: width } as CSSProperties}
			/>
		</div>
	);
}
