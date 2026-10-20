import type { ComponentProps, ReactNode } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const classes = cn(
	'-my-1 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md',
	'text-muted-foreground',
	'transition-colors duration-(--duration-state)',
	'hover:bg-accent hover:text-accent-foreground',
	'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-3.5',
);

const glyph = <X />;

export type CloseProps = Omit<ComponentProps<typeof BaseToast.Close>, 'className' | 'children'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
	/** Defaults to a cross. Give one to say "dismiss" in another glyph. */
	children?: ReactNode;
};

export function Close({ className, children = glyph, ...props }: CloseProps) {
	return (
		<BaseToast.Close
			data-slot="toast-close"
			aria-label="Close"
			className={cn(classes, className)}
			{...props}
		>
			{children}
		</BaseToast.Close>
	);
}
