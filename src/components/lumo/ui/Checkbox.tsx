import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type RootProps = Omit<ComponentProps<typeof BaseCheckbox.Root>, 'className'> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
};

/** A 16px box that carries its own hidden input, so a form and a label both see a checkbox. */
export function Root({ className, ...props }: RootProps) {
	return (
		<BaseCheckbox.Root
			data-slot="checkbox"
			className={cn(
				'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center',
				'rounded-sm border border-input bg-background text-primary-foreground',
				'transition-[color,background-color,border-color] duration-(--duration-state)',
				'data-checked:border-primary data-checked:bg-primary',
				'data-indeterminate:border-primary data-indeterminate:bg-primary',
				'data-invalid:border-destructive',
				'data-disabled:cursor-not-allowed data-disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	);
}

export type IndicatorProps = Omit<
	ComponentProps<typeof BaseCheckbox.Indicator>,
	'className' | 'children'
> & {
	/** Merged with `cn()`, so a Base UI state callback is not accepted here. */
	className?: string;
	/** Replaces the tick. The indeterminate dash is drawn for you, so this is for another tick. */
	children?: ReactNode;
};

/**
 * The tick. Mounted only while the box holds a value: Base UI takes it out of the DOM otherwise,
 * which is why the glyph does not need a hidden state of its own.
 */
export function Indicator({ className, children, ...props }: IndicatorProps) {
	return (
		<BaseCheckbox.Indicator
			data-slot="checkbox-indicator"
			className={cn(
				'group/indicator flex items-center justify-center',
				'transition-[scale,opacity] duration-(--duration-state) ease-(--ease-spring)',
				'data-starting-style:scale-75 data-starting-style:opacity-0',
				'data-ending-style:scale-75 data-ending-style:opacity-0',
				'[&_svg]:size-3',
				className,
			)}
			{...props}
		>
			{children ?? (
				<>
					<Check aria-hidden className="group-data-indeterminate/indicator:hidden" />
					<Minus
						aria-hidden
						className="hidden group-data-indeterminate/indicator:block"
					/>
				</>
			)}
		</BaseCheckbox.Indicator>
	);
}

/** A box, and the tick that says it is ticked — or the dash that says only some of it is. */
export const Checkbox = { Root, Indicator };
