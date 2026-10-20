import type { ComponentProps } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '@/lib/cn';

export type ViewportProps = Omit<ComponentProps<typeof BaseToast.Viewport>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/**
 * The fixed corner the stack lives in. Every toast inside is positioned against it, so the box
 * itself stays empty and only the toasts take pointer events — a page never loses a corner to it.
 */
export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseToast.Viewport
			data-slot="toast-viewport"
			className={cn(
				'pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto max-w-96',
				'sm:inset-x-auto sm:right-4 sm:w-96',
				className,
			)}
			{...props}
		/>
	);
}
