import { useReducedMotion, type Transition } from 'motion/react';

/**
 * The springs the library moves with. A spring is numbers, not a token, so the numbers live here
 * once instead of at every call site — and `useSpring` is how a component asks for one.
 */

/**
 * A box following the size of what is inside it: a panel opening, a track taking a new height.
 *
 * The damping is what decides whether it stops at the size or goes past it — `2 × √stiffness` is
 * critical, and anything under that overshoots by about `exp(-πζ/√(1-ζ²))`, which on a tall panel
 * is a visible few pixels of wobble at the end. 30 against 300 was ζ 0.87, so it overshot; 36 is
 * ζ 1.04 and lands on the number. A spring given both stiffness and damping ignores `bounce`,
 * which is why the pair is the whole story here.
 */
export const springSize: Transition = {
	type: 'spring',
	stiffness: 300,
	damping: 36,
	restDelta: 0.01,
};

/** A pane travelling into place — the tab track, a step handing over to the next. */
export const springSlide: Transition = {
	type: 'spring',
	stiffness: 350,
	damping: 35,
	bounce: 0,
	restDelta: 0.01,
};

/**
 * The preset, or no journey at all when the reader asked for less motion. Tokens collapse CSS
 * durations on their own; a spring is a number in JS, so it has to be asked.
 */
export function useSpring(preset: Transition): Transition {
	return useReducedMotion() === true ? { duration: 0 } : preset;
}
