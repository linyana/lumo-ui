import type { ComponentProps } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '@/lib/cn';

export type DescriptionProps = Omit<ComponentProps<typeof BaseToast.Description>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** Defaults to the toast's own `description`, and renders nothing when there is none. */
export function Description({ className, ...props }: DescriptionProps) {
	return (
		<BaseToast.Description
			data-slot="toast-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}
