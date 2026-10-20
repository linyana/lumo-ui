import type { ComponentProps } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { ToastItemContext } from '@/components/lumo/Toast/context';
import { cn } from '@/lib/cn';

export type RootProps = Omit<ComponentProps<typeof BaseToast.Root>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** One toast in the stack. The toast object also becomes readable by our own parts. */
export function Root({ className, toast, ...props }: RootProps) {
	return (
		<ToastItemContext value={toast}>
			<BaseToast.Root
				data-slot="toast"
				toast={toast}
				className={cn(
					'absolute inset-x-0 bottom-0',
					// Newest first in the DOM, so the painting order has to be asked for explicitly.
					'[z-index:calc(100-var(--toast-index,0))]',
					'pointer-events-auto origin-bottom',
					'rounded-lg border bg-popover text-popover-foreground shadow-lg',
					// The stack is entirely these variables: Base UI reports each toast's index, its
					// measured height and — expanded — the summed height above it, so the newest sits
					// on the bottom edge and the rest peek out over it, scaled back a little.
					'[--peek:0.5rem] [--gap:0.5rem]',
					'[--stack-y:calc(var(--toast-index,0)*var(--peek)*-1)]',
					'[--stack-scale:calc(1-var(--toast-index,0)*0.05)]',
					'[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(calc(var(--stack-y)_+_var(--toast-swipe-movement-y,0px)))_scale(var(--stack-scale))]',
					// Collapsed, every toast is clipped to the frontmost one's height; expanded, each
					// takes its own — which is also the unfurl that plays when the pointer arrives.
					'h-(--toast-frontmost-height)',
					'transition-[transform,height,opacity] duration-(--duration-overlay) ease-(--ease-overlay)',
					'data-expanded:[--stack-y:calc(var(--toast-offset-y,0px)*-1_-_var(--toast-index,0)*var(--gap))]',
					'data-expanded:[--stack-scale:1]',
					'data-expanded:h-(--toast-height)',
					// It arrives from just below its slot and leaves fading where the finger left it:
					// the swipe offset is already in the transform above, so opacity is all that is left.
					'data-starting-style:[--stack-y:var(--gap)] data-starting-style:opacity-0',
					'data-ending-style:opacity-0',
					// Past the provider's limit a toast stays mounted but inert, so it is drawn nowhere.
					'data-limited:hidden',
					'data-instant:transition-none',
					className,
				)}
				{...props}
			/>
		</ToastItemContext>
	);
}
