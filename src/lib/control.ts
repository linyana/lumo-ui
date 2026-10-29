/**
 * The appearance every control shares.
 *
 * Five idioms repeat across the library — the tint a control shows while it is hovered or pressed,
 * the way an icon is sized from the text around it, the shell of a text field, the box a tick or a
 * dot is drawn in, and the row a list of choices is made of. Each is written once here, so a
 * checkbox and a radio look like one family, a press feels the same wherever it happens, and a
 * menu's action and a select's option are the same line.
 */
import { cn } from '@/lib/cn';

/**
 * Hover and press, drawn as a tint on top of the control's own fill rather than as a second
 * background: an `after` layer inheriting the radius, coloured by `currentColor`, so one rule covers
 * a primary button, an outlined row and a transparent trigger. The opacities are tokens, because
 * what reads as a tint under light text is not what reads under dark.
 */
export const stateLayer = cn(
	'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
	'after:bg-current after:opacity-0 after:transition-opacity',
	'after:duration-(--duration-state)',
	'hover:after:opacity-(--state-layer-hover-opacity)',
	'active:after:opacity-(--state-layer-pressed-opacity)',
);

/**
 * The icon slot. A glyph is given as a rendered element and takes its size from the text around it,
 * so a control on a larger scale grows its icons with it and a call site never passes a size. Every
 * glyph is decoration beside a word the control already says, so none of them take the pointer.
 */
export const iconSlot = '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]';

/**
 * The shell of a text control — the input, and the textarea, which differ only in the element they
 * are drawn on and the shape of their size. Selection is not here: it is one rule in the theme,
 * because a reader expects the same colour wherever they drag across a page.
 *
 * Read-only is not here either, though it looks like it belongs: `:read-only` matches every element
 * that is not editable, a `<button>` and a `<div>` included, so the tint would follow a select's
 * trigger around for its whole life. Only a field that can be typed into and is being withheld — the
 * input, the textarea — puts it on, and a control with a state of its own spells that state instead.
 */
export const fieldShell = cn(
	'w-full min-w-0 rounded-md border border-input bg-background text-foreground',
	'placeholder:text-muted-foreground',
	'transition-colors duration-(--duration-state)',
	'disabled:cursor-not-allowed disabled:opacity-50',
	'data-disabled:cursor-not-allowed data-disabled:opacity-50',
	// Written by Field when the control fails validation; aria-invalid is the same fact for a form
	// that is not Base UI's.
	'data-invalid:border-destructive aria-invalid:border-destructive',
);

/**
 * The box a checkbox and a radio are drawn in: the same 16px square, the same invalid border, the
 * same disabled fade. What fills it once it is checked is theirs — a checkbox fills, a radio keeps
 * its ring and puts a dot in it — so only the part they agree on is here.
 */
export const toggleBox = cn(
	'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center',
	'border border-input bg-background',
	'transition-[color,background-color,border-color] duration-(--duration-state)',
	'data-checked:border-primary',
	'data-invalid:border-destructive',
	'data-disabled:cursor-not-allowed data-disabled:opacity-50',
);

/**
 * The glyph inside a toggle, arriving and leaving with the box. The distance it scales over is the
 * caller's: a tick is drawn at close to its own size, a dot grows from nothing.
 */
export const toggleMark = cn(
	'transition-[scale,opacity] duration-(--duration-state) ease-(--ease-spring)',
	'data-starting-style:opacity-0 data-ending-style:opacity-0',
);

/**
 * One row in a list of choices — a menu's action, a select's option. The fill is one `before` layer,
 * drawn by every row and coloured by two of them: inset by the popup's own corner and rounded to
 * match it, so a row changes colour rather than gaining a box. The tint is what the pointer or the
 * arrows leave; the row that is chosen is a notch darker, because chosen and hovered must not read
 * as the same thing, and it keeps its own fill while the pointer is over it. The padding on the
 * right is the caller's: a row that carries an action of its own needs more room.
 */
export const row = cn(
	'flex py-2 pl-4 text-sm leading-4 outline-none select-none',
	'relative z-0',
	"before:absolute before:inset-x-1 before:inset-y-0 before:z-[-1] before:rounded-sm before:content-['']",
	'data-highlighted:text-accent-foreground data-highlighted:not-data-selected:before:bg-accent',
	'data-selected:before:bg-selected',
);

/** The name over a group of rows: quieter than the rows, and never one of them. */
export const rowGroupLabel = 'px-4 py-2 text-sm leading-4 text-muted-foreground select-none';

/** The line between two groups of rows. */
export const rowSeparator = 'mx-1 my-1 h-px bg-border';
