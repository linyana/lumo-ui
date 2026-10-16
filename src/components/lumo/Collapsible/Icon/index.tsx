import { ChevronRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type IconProps = ComponentProps<typeof ChevronRight>;

/** Caret that turns with the panel. Reads `data-panel-open` off the trigger. */
export function Icon({ className, ...props }: IconProps) {
	return (
		<ChevronRight
			data-slot="collapsible-icon"
			aria-hidden="true"
			className={cn(
				'size-[1em] shrink-0',
				'transition-transform duration-(--duration-state) ease-(--ease-overlay)',
				'group-data-panel-open:rotate-90',
				className,
			)}
			{...props}
		/>
	);
}
