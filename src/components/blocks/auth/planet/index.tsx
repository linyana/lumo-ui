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
