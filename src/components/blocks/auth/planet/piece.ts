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
