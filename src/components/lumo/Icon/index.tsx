import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type IconProps = ComponentProps<'svg'>;

/**
 * Shell for a glyph that brings its own path — lumo bundles no icon set.
 * The size follows the surrounding text, so a call site never passes one.
 */
export function Icon({ className, children, ...props }: IconProps) {
	return (
		<svg
			data-slot="icon"
			viewBox="0 0 16 16"
			fill="currentColor"
			aria-hidden="true"
			className={cn('size-[1em] shrink-0', className)}
			{...props}
		>
			{children}
		</svg>
	);
}
