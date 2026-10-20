import type { ComponentProps } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/cn';

export type ViewportProps = ComponentProps<typeof BaseTooltip.Viewport>;

export function Viewport({ className, ...props }: ViewportProps) {
	return (
		<BaseTooltip.Viewport
			data-slot="tooltip-viewport"
			className={cn(
				'[--viewport-inline-padding:--spacing(2.5)]',
				'relative h-full w-full overflow-clip px-(--viewport-inline-padding) py-1',
				'[&_:is([data-current],[data-previous])]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))]',
				'[&_:is([data-current],[data-previous])]:translate-x-0',
				'[&_:is([data-current],[data-previous])]:opacity-100',
				'[&_:is([data-current],[data-previous])]:transition-[translate,opacity]',
				'[&_:is([data-current],[data-previous])]:duration-[var(--duration-overlay),calc(var(--duration-overlay)/2)]',
				'[&_:is([data-current],[data-previous])]:ease-(--ease-overlay)',
				'[[data-instant]_&_:is([data-current],[data-previous])]:transition-none',
				"data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2",
				"data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0",
				"data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2",
				"data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0",
				"data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2",
				"data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0",
				"data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2",
				"data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0",
				className,
			)}
			{...props}
		/>
	);
}
