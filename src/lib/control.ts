/**
 * The appearance every control shares.
 *
 * Four idioms repeat across the library — the tint a control shows while it is hovered or pressed,
 * the way an icon is sized from the text around it, the shell of a text field, and the box a tick or
 * a dot is drawn in. Each is written once here, so a checkbox and a radio look like one family, and
 * a press feels the same wherever it happens.
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
 */
export const fieldShell = cn(
	'w-full min-w-0 rounded-md border border-input bg-background text-foreground',
	'placeholder:text-muted-foreground',
	'transition-colors duration-(--duration-state)',
	'disabled:cursor-not-allowed disabled:opacity-50',
	'data-disabled:cursor-not-allowed data-disabled:opacity-50',
	// Still selectable, so still a field — but a settled one, like a value that is being shown.
	'read-only:bg-muted',
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
