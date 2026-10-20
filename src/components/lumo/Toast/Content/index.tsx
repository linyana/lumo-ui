import type { ComponentProps } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '@/lib/cn';

export type ContentProps = Omit<ComponentProps<typeof BaseToast.Content>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/**
 * The one row a toast draws: a glyph, the text, then whatever acts. Behind the frontmost toast
 * it fades out, because the root above it is clipped and the text would otherwise show through.
 */
export function Content({ className, ...props }: ContentProps) {
	return (
		<BaseToast.Content
			data-slot="toast-content"
			className={cn(
				'flex items-start gap-3 p-4',
				'transition-opacity duration-(--duration-state)',
				'data-behind:opacity-0 data-expanded:opacity-100',
				className,
			)}
			{...props}
		/>
	);
}
