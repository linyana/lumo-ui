import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type HeaderProps = {
	/** What the block is: a file name, a language, a count. */
	children?: ReactNode;
	/** What you can do with it, right-aligned. */
	actions?: ReactNode;
	className?: string;
};

/** The bar above a block of code, shared by `Code` and `CodeDiff`. */
export function Header({ children, actions, className }: HeaderProps) {
	return (
		<div
			data-slot="code-header"
			className={cn(
				'flex min-h-9 items-center justify-between gap-3 border-b px-3 py-1',
				className,
			)}
		>
			<div className="flex min-w-0 items-center gap-2 text-xs">{children}</div>
			<div className="flex shrink-0 items-center gap-1">{actions}</div>
		</div>
	);
}
