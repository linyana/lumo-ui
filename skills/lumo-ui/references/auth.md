# auth

> The frame the anonymous screens stand in: the form's own column, and a panel beside it while the frame has room for one. The panel is a backlit planet drawn on a canvas — or whatever node the screen hands it — and it steps aside below 36rem of the frame's width, so the form keeps the page on a phone and in a card.

## install

```bash
bunx shadcn@latest add @lumo/auth
```

- payload: `/r/auth.json`
- docs page: `/auth`
- comes with it: `@lumo/utils`
- lands in: 3 files under the project's `aliases.components`

## source

What ships is source, and the source is the API: there is no generated prop table to consult, so read the signatures below rather than guessing at one. A part this item needs from another item lives in that item’s page.

### src/components/blocks/auth/index.tsx

```tsx
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { RingedPlanet } from './planet';

export type AuthLayoutProps = Omit<ComponentProps<'div'>, 'title'> & {
	/** The form's own name, beside the mark — the one heading on the screen. */
	title: ReactNode;
	/** One line under it, saying what the form is for. */
	description?: ReactNode;
	/** The mark before the title, sized by the caller: an `img`, a glyph, a monogram. */
	logo?: ReactNode;
	/** The form itself, with its own stack of fields and its submit. */
	children: ReactNode;
	/** Under the form: the way to the other anonymous screen, a reset, a policy line. */
	footer?: ReactNode;
	/**
	 * What fills the panel beside the form, in place of the artwork — a photograph, a brand, a
	 * statement at full strength. The form keeps its own column either way.
	 */
	aside?: ReactNode;
	/** The panel's own words, under the artwork. Nothing is written there by default. */
	headline?: ReactNode;
	note?: ReactNode;
};

/**
 * The frame the two anonymous screens stand in: a form column, and a panel beside it on a wide
 * frame. The panel is the artwork and nothing else — no copy of the library's own — so the same
 * frame carries a sign-in, a register or a reset.
 *
 * It measures itself rather than the window, because the frame is often not the page: the panel
 * appears when the frame itself is 36rem wide, which is a laptop's page and not a card's.
 */
export function AuthLayout({
	title,
	description,
	logo,
	footer,
	aside,
	headline,
	note,
	className,
	children,
	...props
}: AuthLayoutProps) {
	return (
		<div
			data-slot="auth"
			className={cn('@container flex min-h-svh bg-layout-content', className)}
			{...props}
		>
			<aside
				data-slot="auth-panel"
				className={cn(
					'm-3 hidden flex-1 flex-col overflow-hidden rounded-xl p-8',
					'bg-scene-background text-scene-foreground @xl:flex @3xl:p-10 @4xl:p-14',
				)}
			>
				{aside ?? (
					<>
						<div
							data-slot="auth-artwork"
							className="-mx-8 flex flex-1 items-center justify-center py-10 @3xl:-mx-10 @4xl:-mx-14"
						>
							<RingedPlanet />
						</div>

						{(headline !== undefined || note !== undefined) && (
							<div data-slot="auth-panel-words">
								{headline !== undefined && (
									<p className="max-w-sm font-serif text-4xl leading-[1.05] tracking-tight text-balance @3xl:text-5xl @4xl:text-6xl">
										{headline}
									</p>
								)}
								{note !== undefined && (
									<p className="mt-5 max-w-64 text-sm leading-relaxed text-scene-foreground/65">
										{note}
									</p>
								)}
							</div>
						)}
					</>
				)}
			</aside>

			<main data-slot="auth-main" className="relative m-3 flex flex-1 flex-col">
				<div className="flex flex-1 items-center justify-center py-12">
					<div className="w-full max-w-sm">
						<div data-slot="auth-head" className="space-y-1.5">
							<div className="flex items-center gap-3">
								{logo !== undefined && (
									<span
										data-slot="auth-logo"
										className="flex shrink-0 items-center"
									>
										{logo}
									</span>
								)}
								<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
							</div>
							{description !== undefined && (
								<p className="text-sm text-pretty text-muted-foreground">
									{description}
								</p>
							)}
						</div>

						<div data-slot="auth-body" className="mt-8">
							{children}
						</div>

						{footer !== undefined && (
							<p
								data-slot="auth-footer"
								className="mt-8 text-sm text-muted-foreground"
							>
								{footer}
							</p>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export { RingedPlanet } from './planet';
```

### src/components/blocks/auth/planet/index.tsx

```tsx
import { useEffect, useRef } from 'react';
import { meta, ringedPlanet } from './piece';

/**
 * The artwork on the panel beside an anonymous form: a backlit planet with a moving tilted ring,
 * shaded on a 200×100 grid and drawn as a halftone dot per cell. The scene is a function of time,
 * so it is drawn on a canvas at the box's device resolution; a reader who prefers less motion — or
 * a tab in the background, or a panel scrolled out of view — gets the still frame instead.
 */
export function RingedPlanet() {
	const canvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const element = canvas.current;
		const context = element?.getContext('2d');
		if (!element || !context) return;
		const frame = ringedPlanet();
		const color = new Uint8Array(meta.cols * meta.rows);
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let visible = false;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let elapsed = 0;
		let previous = 0;

		const draw = () => {
			const bounds = element.getBoundingClientRect();
			if (!bounds.width || !bounds.height) return;
			const ratio = window.devicePixelRatio || 1;
			const width = Math.round(bounds.width * ratio);
			const height = Math.round(bounds.height * ratio);
			// Draw circles at the final device resolution, never enlarge a small bitmap.
			if (element.width !== width || element.height !== height) {
				element.width = width;
				element.height = height;
			}
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			context.fillStyle = meta.ground;
			context.fillRect(0, 0, bounds.width, bounds.height);
			const cells = frame(motion.matches ? 0 : elapsed, { color }).replaceAll('\n', '');
			const cell = Math.min(bounds.width / meta.cols, bounds.height / meta.rows);
			const ox = (bounds.width - cell * meta.cols) / 2;
			const oy = (bounds.height - cell * meta.rows) / 2;
			const paths = meta.palette.map(() => new Path2D());
			// The glyph steps encode area coverage, so radius follows its square root.
			const radii: Record<string, number> = {
				'·': Math.sqrt(0.3),
				'•': Math.sqrt(0.6),
				'●': 1,
			};
			for (let k = 0; k < color.length; k++) {
				const coverage = radii[cells[k]!];
				if (!coverage) continue;
				const radius = coverage * cell * 0.46;
				const x = ox + ((k % meta.cols) + 0.5) * cell;
				const y = oy + (Math.floor(k / meta.cols) + 0.5) * cell;
				const path = paths[color[k]!]!;
				path.moveTo(x + radius, y);
				path.arc(x, y, radius, 0, Math.PI * 2);
			}
			paths.forEach((path, index) => {
				context.fillStyle = meta.palette[index]!;
				context.fill(path);
			});
		};

		const active = () => visible && !document.hidden && !motion.matches;
		const tick = () => {
			timer = undefined;
			if (!active()) return;
			const now = performance.now();
			elapsed += (now - previous) / 1000;
			previous = now;
			draw();
			timer = setTimeout(tick, 1000 / meta.fps);
		};
		const update = () => {
			clearTimeout(timer);
			timer = undefined;
			if (visible && !document.hidden) draw();
			if (active()) {
				previous = performance.now();
				timer = setTimeout(tick, 1000 / meta.fps);
			}
		};
		const intersection = new IntersectionObserver(([entry]) => {
			visible = entry?.isIntersecting ?? false;
			update();
		});
		intersection.observe(element);
		const resize = new ResizeObserver(update);
		resize.observe(element);
		document.addEventListener('visibilitychange', update);
		window.addEventListener('resize', update);
		motion.addEventListener('change', update);

		return () => {
			clearTimeout(timer);
			intersection.disconnect();
			resize.disconnect();
			document.removeEventListener('visibilitychange', update);
			window.removeEventListener('resize', update);
			motion.removeEventListener('change', update);
		};
	}, []);

	return (
		<canvas
			ref={canvas}
			className="block aspect-[2/1] w-full"
			role="img"
			aria-label="A backlit planet with a moving tilted ring and distant twinkling stars"
		/>
	);
}
```

### src/components/blocks/auth/planet/piece.ts

```ts
/*
 * Adapted from ascii.rest (https://github.com/bas3line/ascii), the `planetscale` piece.
 * Copyright (c) 2026 bas3line, MIT licensed. The license text is at the end of this header and
 * travels with the file, because a project installing this block copies it.
 *
 * Ringed planet: an intact sphere with a tilted, moving annular band.
 * Sunlight lays a thin crescent across its surface, a hidden star lights
 * the rim, and faint data lights crawl over its night side. The surface
 * and ring share an equatorial frame while their textures turn at different speeds.
 *
 * The upstream logo grid, cuts and moon are replaced by a complete disc
 * and a depth-composited ring. Each frame is shaded on a square grid,
 * then drawn as a halftone: every cell is a dot whose size is its brightness,
 * ordered-dithered so gradients read as texture, in the nearest palette grey.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/** The picture at `t` seconds of play time, as `rows` lines of `cols` characters. */
export type Frame = (t: number, env?: { color?: Uint8Array }) => string;

export const meta = {
	name: 'ringed planet',
	note: 'a backlit planet with a slowly moving tilted ring',
	cols: 200,
	rows: 100,
	cell: 1,
	fps: 15,
	ground: '#050505',
	palette: [
		'#101010',
		'#181818',
		'#202020',
		'#282828',
		'#303030',
		'#3a3a3a',
		'#444444',
		'#4e4e4e',
		'#585858',
		'#636363',
		'#6e6e6e',
		'#797979',
		'#858585',
		'#919191',
		'#9d9d9d',
		'#a9a9a9',
		'#b5b5b5',
		'#c1c1c1',
		'#cccccc',
		'#d7d7d7',
		'#e1e1e1',
		'#eaeaea',
		'#f3f3f3',
		'#ffffff',
	],
} as const;

const W = 200,
	H = 100;
const CX = 100,
	CY = 50,
	R = 41; // the planet
const SUN = [-0.68, -0.68, 0.2] as const; // toward the sun: upper left, a little toward us
const RING_INNER = R * 1.2;
const RING_OUTER = R * 1.72;
const RING_PERIOD = 24; // seconds for the ring's granular texture to circle
const DOTS = ' ·•●';
const COVER = [0, 0.3, 0.6, 1]; // how much each dot fills, against the largest
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.47);

function hash(x: number, y: number): number {
	let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Value noise, wrapping every `period` lattice cells in x when period > 0.
function noise(x: number, y: number, period: number): number {
	const xi = Math.floor(x),
		yi = Math.floor(y);
	const fx = x - xi,
		fy = y - yi;
	const u = fx * fx * (3 - 2 * fx),
		v = fy * fy * (3 - 2 * fy);
	let x0 = xi,
		x1 = xi + 1;
	if (period) {
		x0 = ((xi % period) + period) % period;
		x1 = (x0 + 1) % period;
	}
	const a = hash(x0, yi),
		b = hash(x1, yi),
		c = hash(x0, yi + 1),
		d = hash(x1, yi + 1);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, octaves: number, period: number): number {
	let s = 0,
		n = 0,
		amp = 0.5,
		f = 1;
	for (let i = 0; i < octaves; i++) {
		s += amp * noise(x * f, y * f, period * f);
		n += amp;
		amp *= 0.5;
		f *= 2;
	}
	return s / n;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
	const k = clamp((v - a) / (b - a));
	return k * k * (3 - 2 * k);
};
const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);

export function ringedPlanet(): Frame {
	const P = meta.palette.map(hex);
	const N = W * H;
	const out: string[] = new Array(N);

	// Nearest palette colour, cached on a 32-step cube.
	const lut = new Uint8Array(32768).fill(255);
	const nearest = (r: number, g: number, b: number): number => {
		const k =
			(Math.min(31, (r * 31.99) | 0) << 10) |
			(Math.min(31, (g * 31.99) | 0) << 5) |
			Math.min(31, (b * 31.99) | 0);
		if (lut[k] !== 255) return lut[k]!;
		let best = 0,
			bd = 1e9;
		for (let i = 0; i < P.length; i++) {
			const dr = P[i]![0]! - r,
				dg = P[i]![1]! - g,
				db = P[i]![2]! - b;
			const d = 0.3 * dr * dr + 0.5 * dg * dg + 0.2 * db * db;
			if (d < bd) {
				bd = d;
				best = i;
			}
		}
		return (lut[k] = best);
	};

	// A complete disc replaces the upstream brand silhouette.
	const solid = new Float32Array(N);
	for (let k = 0; k < N; k++) {
		const x = k % W,
			r = (k / W) | 0;
		solid[k] = smooth(R + 0.6, R - 0.6, Math.hypot(x + 0.5 - CX, r + 0.5 - CY));
	}

	// Camera-space normals keep the light fixed; texture coordinates below
	// use the ring's moving equatorial frame instead of a separate body axis.
	const nx = new Float32Array(N),
		ny = new Float32Array(N),
		nz = new Float32Array(N);
	for (let k = 0; k < N; k++) {
		const x = k % W,
			r = (k / W) | 0;
		const a = (x + 0.5 - CX) / R,
			b = (r + 0.5 - CY) / R;
		const q = a * a + b * b;
		if (q >= 1.02) continue;
		const z = Math.sqrt(Math.max(0, 1 - q));
		nx[k] = a;
		ny[k] = b;
		nz[k] = z;
	}
	const LA = 96,
		LO = 256;
	const bands = new Float32Array(LA * LO);
	for (let i = 0; i < LA; i++) {
		for (let j = 0; j < LO; j++) {
			const la = i / LA,
				lo = j / LO;
			const warp = fbm(lo * 12, la * 6, 3, 12) * 0.08;
			const stripe = 0.5 + 0.5 * Math.sin((la + warp) * 38 + 1.6 * Math.sin(la * 17));
			bands[i * LO + j] = 0.75 * stripe + 0.25 * fbm(lo * 16, la * 30, 3, 16);
		}
	}

	// The stars, fixed.
	const star = new Float32Array(N);
	for (let k = 0; k < N; k++) {
		const x = k % W,
			r = (k / W) | 0;
		const h = hash(x * 3 + 7, r * 5 + 1);
		if (h > 0.986) star[k] = 0.35 + 0.65 * hash(x, r + 99);
	}

	const L = SUN.map((v) => v / Math.hypot(...SUN)) as [number, number, number];
	const LH = Math.hypot(L[0], L[1]);
	const BACK = [CX + 18, CY + 18] as const; // the star behind the planet
	// How far each cell is from the hidden star, and how squarely the limb under
	// it faces the sun, both fixed.
	const back = new Float32Array(N),
		facing = new Float32Array(N);
	for (let k = 0; k < N; k++) {
		const x = k % W,
			r = (k / W) | 0;
		back[k] = Math.hypot(x + 0.5 - BACK[0], r + 0.5 - BACK[1]);
		facing[k] =
			(nx[k]! * L[0] + ny[k]! * L[1]) / Math.max(1e-3, Math.hypot(nx[k]!, ny[k]!)) / LH;
	}

	return (t, { color } = {}) => {
		const spin = (t / 120) * LO; // the planet turns once in two minutes
		const ringSpin = (t / RING_PERIOD) * Math.PI * 2;
		const roll = -0.32 + 0.045 * Math.sin(t * 0.16);
		const cosRoll = Math.cos(roll),
			sinRoll = Math.sin(roll);
		// Shared tilt and roll keep the surface equator aligned with the ring.
		const opening = 0.36 + 0.025 * Math.sin(t * 0.12);
		const ringDepth = Math.sqrt(1 - opening * opening);

		for (let r = 0; r < H; r++) {
			for (let x = 0; x < W; x++) {
				const k = r * W + x;
				const y = r + 0.5;
				let v = 0,
					floor = 0;
				const fade = 1;
				const px = x + 0.5 - CX,
					py = y - CY;
				const d = Math.sqrt(px * px + py * py);
				const sp = solid[k]!;

				// space: black, stars, the backlight's corona round the rim
				const db = back[k]!;
				const toward = 0.15 + 0.85 * smooth(80, 25, db);
				const corona =
					Math.exp(-Math.max(0, d - R) / 1.6) * 0.55 +
					Math.exp(-Math.max(0, d - R) / 6) * 0.14 * toward;
				let bg = corona * toward * smooth(R - 2, R + 0.5, d);
				if (star[k]) {
					const tw =
						0.65 + 0.35 * Math.sin(t * (1.3 + hash(x, r) * 2.5) + hash(r, x) * 6.28);
					bg = Math.max(bg, star[k]! * tw * smooth(R + 3, R + 14, d));
				}
				v = bg;

				if (sp > 0.001) {
					// the planet: banded, lit from the upper left, dark on the night side
					const n0 = nx[k]!,
						n1 = ny[k]!,
						n2 = nz[k]!;
					const day = n0 * L[0] + n1 * L[1] + n2 * L[2];
					// Inverse ring rotation gives local latitude and longitude.
					const localX = n0 * cosRoll + n1 * sinRoll;
					const rolledY = -n0 * sinRoll + n1 * cosRoll;
					const equatorY = rolledY * opening + n2 * ringDepth;
					const pole = -rolledY * ringDepth + n2 * opening;
					const latitude = Math.asin(Math.max(-1, Math.min(1, pole)));
					const longitude = Math.atan2(equatorY, localX) - (spin / LO) * Math.PI * 2;
					const li = (latitude / Math.PI + 0.5) * (LA - 1);
					let lj = ((longitude / (Math.PI * 2) + 0.5) * LO) % LO;
					if (lj < 0) lj += LO;
					const tex = bands[(li | 0) * LO + (lj | 0)]!;
					const lit =
						smooth(-0.04, 0.2, day) * (0.03 + 0.7 * Math.pow(Math.max(0, day), 1.5));
					let s = lit * (0.6 + 0.65 * tex);
					// a thin bright crescent along the sunlit limb
					const limb = smooth(0.9, 0.995, d / R);
					const fc = facing[k]!;
					s += limb * smooth(0.1, 0.8, fc) * 0.9;
					// the backlight wraps the far rim
					s += smooth(0.86, 0.985, d / R) * 0.95 * toward * (1 - smooth(-0.3, 0.3, fc));
					// data lights on the night side: dotted rows along the bands, a pulse running each
					const night = 1 - smooth(-0.12, 0.06, day);
					// Constant-latitude rows follow the same equator as the ring.
					if (night > 0 && n2 > 0.15) {
						const row = (latitude * R) / 4;
						const ri = Math.round(row);
						if (Math.abs(row - ri) < 0.14) {
							const seg = Math.floor(
								(Math.atan2(Math.sin(longitude), Math.cos(longitude)) + Math.PI) *
									26,
							);
							if (hash(seg, ri + 40) > 0.5) {
								const pulse = Math.pow(
									0.5 +
										0.5 *
											Math.sin(
												seg * 0.5 - t * 2.4 * (0.6 + hash(ri, 3)) + ri * 2,
											),
									8,
								);
								s += night * (0.3 + 0.7 * pulse) * (0.3 + 0.7 * n2);
							}
						}
					}
					v = v * (1 - sp) + s * sp;
					floor = 0.07 * sp;
				}

				// Intersect the viewing ray with the ring plane, then compare
				// depths to put its near half in front and far half behind the globe.
				const along = px * cosRoll + py * sinRoll;
				const across = (-px * sinRoll + py * cosRoll) / opening;
				const ringRadius = Math.hypot(along, across);
				const depth = across * ringDepth;
				const surfaceDepth = Math.sqrt(Math.max(0, R * R - d * d));
				if (
					ringRadius > RING_INNER - 1 &&
					ringRadius < RING_OUTER + 1 &&
					(d >= R || depth > surfaceDepth)
				) {
					const edge =
						smooth(RING_INNER - 1, RING_INNER + 1, ringRadius) *
						(1 - smooth(RING_OUTER - 1, RING_OUTER + 1, ringRadius));
					const angle = Math.atan2(across, along) - ringSpin;
					// Circular noise coordinates make a seamless moving grain pattern.
					const grain = noise(
						Math.cos(angle) * 14 + 30,
						Math.sin(angle) * 14 + ringRadius * 0.35,
						0,
					);
					const lanes = 0.65 + 0.35 * Math.cos((ringRadius - RING_INNER) * 2.1);
					const gap = 1 - 0.8 * Math.exp(-(((ringRadius - R * 1.49) / 1.2) ** 2));
					const arc = 0.75 + 0.25 * Math.cos(angle * 3 + ringRadius * 0.08);
					const brightness =
						(0.28 + grain * 0.5) * lanes * gap * arc * (depth > 0 ? 1 : 0.7);
					const opacity = edge * 0.92;
					v = v * (1 - opacity) + brightness * opacity;
					floor = floor * (1 - opacity) + 0.12 * opacity;
				}

				// Dot size from brightness, dithered. Then the colour makes up what the
				// dot size could not: a small dot is drawn brighter and a large one
				// dimmer, so a gradient stays smooth across the dither's steps.
				const peak = Math.max(v, 1e-4);
				const level = clamp(floor + (1 - floor) * Math.pow(peak, 0.85) * 0.95) * fade;
				const step = Math.max(
					0,
					Math.min(3, Math.round(level * 3 + BAYER[(r & 3) * 4 + (x & 3)]!)),
				);
				out[k] = DOTS[step]!;
				if (color) {
					const want = step ? Math.min(1, (level + 0.06) / COVER[step]!) : 0;
					// grey only: a dim cell keeps a dim dot, so the dark side stays dark
					const g = clamp((0.3 + 0.7 * want) * (0.22 + 0.78 * smooth(0, 0.6, peak)));
					color[k] = nearest(g, g, g);
				}
			}
		}
		const lines: string[] = [];
		for (let r = 0; r < H; r++) lines.push(out.slice(r * W, (r + 1) * W).join(''));
		return lines.join('\n');
	};
}
```

## examples

Each is a page in this repository; the `@/` it imports resolve through the consumer’s own aliases once the files are installed.

### src/pages/Auth/demos/aside.tsx

```tsx
import { AuthLayout } from '@/components/blocks/auth';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * The panel is a slot: hand it anything and the artwork steps aside, while the form keeps the column
 * it had. Nothing on the panel is the frame's own, so a brand, a photograph or a statement all land
 * there without the form changing.
 */
export default function Aside() {
	return (
		<AuthLayout
			className="h-120 min-h-0 w-full overflow-hidden rounded-lg border"
			title="Reset password"
			description="We will send a link to the address on the account."
			aside={
				<figure className="flex flex-1 flex-col justify-between gap-8">
					<blockquote className="max-w-sm font-serif text-3xl leading-tight text-balance">
						“One frame, three screens: sign in, sign up, and the way back in.”
					</blockquote>
					<figcaption className="text-sm text-scene-foreground/65">
						the panel takes any node, and the form keeps its own column.
					</figcaption>
				</figure>
			}
			footer={
				<>
					Remembered it?{' '}
					<a href="#sign-in" className="text-foreground underline underline-offset-4">
						Sign in
					</a>
				</>
			}
		>
			<Form onFormSubmit={() => {}}>
				<Field.Root name="email">
					<Field.Label>email</Field.Label>
					<Input
						type="email"
						autoComplete="email"
						required
						placeholder="you@example.com"
					/>
					<Field.Error match="valueMissing">an address is required.</Field.Error>
					<Field.Error match="typeMismatch">that is missing an @.</Field.Error>
				</Field.Root>

				<Button type="submit" className="mt-2 w-full">
					send the link
				</Button>
			</Form>
		</AuthLayout>
	);
}
```

### src/pages/Auth/demos/sign-in.tsx

```tsx
import { useState } from 'react';
import { AuthLayout } from '@/components/blocks/auth';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * The frame holds one sign-in and nothing else: the fields are `Field`'s, the stack is `Form`'s and
 * the control is the `Button` this library presses everywhere. `required` and the input types are
 * the validation — the form reports each in its own field and only then reaches `onFormSubmit`.
 */
export default function SignIn() {
	const [signedIn, setSignedIn] = useState(false);

	return (
		<AuthLayout
			// The frame fills the page it is on; in a card, the card says how tall the page is.
			className="h-120 min-h-0 w-full overflow-hidden rounded-lg border"
			logo={<img src="/logo.svg" alt="" className="size-8" />}
			title="Sign in"
			description="Welcome back. Pick up where you left off."
			headline={
				<>
					Good things
					<br />
					start here.
				</>
			}
			note="A little structure. A world of possibility."
			footer={
				<>
					No account?{' '}
					<a href="#create" className="text-foreground underline underline-offset-4">
						Create one
					</a>
				</>
			}
		>
			<Form onFormSubmit={() => setSignedIn(true)}>
				<Field.Root name="email">
					<Field.Label>email</Field.Label>
					<Input
						type="email"
						autoComplete="email"
						required
						placeholder="you@example.com"
					/>
					<Field.Error match="valueMissing">an address is required.</Field.Error>
					<Field.Error match="typeMismatch">that is missing an @.</Field.Error>
				</Field.Root>

				<Field.Root name="password">
					<Field.Label>password</Field.Label>
					<Input
						type="password"
						autoComplete="current-password"
						required
						minLength={8}
						placeholder="at least 8 characters"
					/>
					<Field.Error match="valueMissing">a password is required.</Field.Error>
					<Field.Error match="tooShort">that is under 8 characters.</Field.Error>
				</Field.Root>

				<Button type="submit" className="mt-2 w-full">
					sign in
				</Button>

				{signedIn && <p className="text-sm text-muted-foreground">signed in.</p>}
			</Form>
		</AuthLayout>
	);
}
```
