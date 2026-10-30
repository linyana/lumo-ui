import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { tv, type VariantProps } from 'tailwind-variants';

export type ActionProps = ComponentProps<'div'>;

/** The slot in the corner of a header — one button, one menu trigger, nothing tall. */
export function Action({ className, ...props }: ActionProps) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className,
			)}
			{...props}
		/>
	);
}

export type ContentProps = ComponentProps<'div'>;

export function Content({ className, ...props }: ContentProps) {
	return (
		<div
			data-slot="card-content"
			// Grows into the slack of a stretched card, which keeps a footer on the bottom edge
			// when cards of different heights share a row.
			className={cn('flex-1 px-(--card-pad)', className)}
			{...props}
		/>
	);
}

export type DescriptionProps = ComponentProps<'div'>;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

export type FooterProps = ComponentProps<'div'>;

export function Footer({ className, ...props }: FooterProps) {
	return (
		<div
			data-slot="card-footer"
			className={cn('flex items-center gap-2 px-(--card-pad)', className)}
			{...props}
		/>
	);
}

export type HeaderProps = ComponentProps<'div'>;

export function Header({ className, ...props }: HeaderProps) {
	return (
		<div
			data-slot="card-header"
			// Two columns only when an action is present, so a title and its description stay in
			// one column and the action sits opposite both of them.
			className={cn(
				'grid auto-rows-min items-start gap-1.5 px-(--card-pad)',
				'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
				'has-data-[slot=card-description]:grid-rows-[auto_auto]',
				className,
			)}
			{...props}
		/>
	);
}

export const cardVariants = tv({
	base: [
		'group/card flex flex-col',
		'rounded-xl border bg-card text-card-foreground shadow-surface',
		// The inline inset every part is drawn at. A variable rather than a class per part, so a
		// header, a body and a footer cannot drift apart, and a part added later is inset too
		// without being told to be.
		'[--card-pad:--spacing(6)]',
	],
	variants: {
		size: {
			sm: 'gap-4 py-4 [--card-pad:--spacing(4)]',
			md: 'gap-6 py-6',
		},
		hoverable: {
			true: [
				// The shadow is what answers the pointer: it spreads from a line hugging the card to a
				// halo around it, and nothing about the card's own drawing changes. The edge moves only
				// as far as it has to — `input` is the same colour as `border` in the light theme and
				// one small step above it in the dark one, where a shadow has nothing to fall on. The
				// cursor is not here: a card is a div, the link is the consumer's.
				'transition-[box-shadow,border-color] duration-(--duration-state)',
				'hover:border-input hover:shadow-lifted',
			],
		},
	},
	defaultVariants: {
		size: 'md',
		hoverable: false,
	},
});

export type CardSize = NonNullable<VariantProps<typeof cardVariants>['size']>;

export type RootProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>;

/**
 * The surface itself. Its size cascades to the parts: the inset travels as `--card-pad`, and
 * `data-size` is on the DOM for whatever wants to target it from CSS.
 *
 * `hoverable` is the one prop that changes how the card behaves, and it only changes how it looks:
 * the surface owns the hover, so a click target placed anywhere inside it lights the whole tile.
 * A card is a plain div, so a card that is clicked is still the consumer's to build — the prop says
 * "this one is a target", not "this one is a button".
 */
export function Root({ className, size = 'md', hoverable = false, ...props }: RootProps) {
	return (
		<div
			data-slot="card"
			data-size={size}
			data-hoverable={hoverable ? '' : undefined}
			className={cn(cardVariants({ size, hoverable }), className)}
			{...props}
		/>
	);
}

export type TitleProps = ComponentProps<'div'>;

/**
 * A `div`, not a heading: the level that is right for a card depends on the page around it, and
 * a card cannot know it. Put an `h2`–`h6` inside when the outline matters.
 */
export function Title({ className, ...props }: TitleProps) {
	return (
		<div
			data-slot="card-title"
			className={cn('text-base font-semibold', className)}
			{...props}
		/>
	);
}

/** A surface that groups one thing. Every part is a plain element; the card adds the look. */
export const Card = {
	Root,
	Header,
	Title,
	Description,
	Action,
	Content,
	Footer,
};
