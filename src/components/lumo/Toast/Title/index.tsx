import type { ComponentProps } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '@/lib/cn';

export type TitleProps = Omit<ComponentProps<typeof BaseToast.Title>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** Defaults to the toast's own `title`, and renders nothing when there is none. */
export function Title({ className, ...props }: TitleProps) {
	return (
		<BaseToast.Title
			data-slot="toast-title"
			className={cn('text-sm font-medium', className)}
			{...props}
		/>
	);
}
