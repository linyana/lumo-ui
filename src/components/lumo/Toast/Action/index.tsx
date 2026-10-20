import type { ComponentProps } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '@/lib/cn';

const classes = cn(
	'-my-1 inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-md px-2',
	'bg-secondary text-secondary-foreground',
	'text-xs font-medium whitespace-nowrap select-none',
	'transition-colors duration-(--duration-state)',
	'hover:bg-accent hover:text-accent-foreground',
	'data-disabled:pointer-events-none data-disabled:opacity-50',
	'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]',
);

export type ActionProps = Omit<ComponentProps<typeof BaseToast.Action>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/**
 * Takes its label from `actionProps` on the toast, so a caller that only queued one never has to
 * come back and render it. Renders nothing when the toast carries no action.
 */
export function Action({ className, ...props }: ActionProps) {
	return (
		<BaseToast.Action data-slot="toast-action" className={cn(classes, className)} {...props} />
	);
}
