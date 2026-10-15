import type { ComponentProps } from 'react';
import { Icon as LumoIcon } from '@/components/lumo/Icon';
import { cn } from '@/lib/cn';

export type IconProps = ComponentProps<typeof LumoIcon>;

/** Caret that turns with the panel. Reads `data-panel-open` off the trigger. */
export function Icon({ className, ...props }: IconProps) {
	return (
		<LumoIcon
			data-slot="collapsible-icon"
			className={cn(
				'transition-transform duration-(--duration-state) ease-(--ease-overlay)',
				'group-data-panel-open:rotate-90',
				className,
			)}
			{...props}
		>
			<path d="M6 12V4l4.5 4z" />
		</LumoIcon>
	);
}
