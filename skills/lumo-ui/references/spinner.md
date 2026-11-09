# spinner

> Default loading indicator: a container-query sized ring of pulsing dots, 2em across by default, set from a size prop in ems so it tracks the text around it or in any CSS length when it should not. Cancel the status role where the surrounding control already announces its own state.

## install

```bash
bunx shadcn@latest add @lumo/spinner
```

- payload: `/r/spinner.json`
- docs page: `/spinner`
- comes with it: `@lumo/utils`
- lands in: `spinner.tsx` under the project's `aliases.ui`

## source

What ships is source, and the source is the API: there is no generated prop table to consult, so read the signatures below rather than guessing at one. A part this item needs from another item lives in that item’s page.

### src/components/ui/spinner.tsx

```tsx
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SpinnerProps = ComponentProps<'span'> & {
	/**
	 * The box: a number is ems of the text around it, a string is any CSS length. It wins over a
	 * `size-*` class, so a call site sizes the spinner one way or the other.
	 */
	size?: number | string;
	/** Visually hidden status text. Pass `null` inside a control that already announces itself. */
	label?: ReactNode;
};

/** Eight dots, each a fifth of the box, on a ring a third of it across. */
const dotCount = 8;
const dotScale = 0.2;
const radiusScale = 0.34;

export function Spinner({ className, style, size, label = 'Loading', ...props }: SpinnerProps) {
	const box = typeof size === 'number' ? `${size}em` : size;

	return (
		<>
			<style href="lumo-spinner" precedence="default">
				{`@keyframes lumo-spinner-pulse {
	0%,
	100% {
		opacity: 0.25;
		transform: scale(0.65);
	}

	12.5% {
		opacity: 1;
		transform: scale(1);
	}

	25% {
		opacity: 0.75;
		transform: scale(0.85);
	}

	50% {
		opacity: 0.35;
		transform: scale(0.7);
	}
}`}
			</style>
			<span
				data-slot="spinner"
				role={label ? 'status' : undefined}
				className={cn(
					'@container-size relative inline-flex aspect-square size-[2em] align-middle',
					'items-center justify-center',
					className,
				)}
				style={{ width: box, height: box, ...style }}
				{...props}
			>
				<span aria-hidden="true" className="relative block size-full">
					{Array.from({ length: dotCount }, (_, index) => {
						const angle = (index / dotCount) * Math.PI * 2;
						const x = `${(Math.sin(angle) * radiusScale * 100).toFixed(2)}cqmin`;
						const y = `${(-Math.cos(angle) * radiusScale * 100).toFixed(2)}cqmin`;

						return (
							<span
								key={index}
								className="absolute top-1/2 left-1/2"
								style={{
									width: `calc(${dotScale} * 100cqmin)`,
									height: `calc(${dotScale} * 100cqmin)`,
									transform: `translate(-50%, -50%) translate(${x}, ${y})`,
								}}
							>
								<span
									data-slot="spinner-dot"
									className="block size-full rounded-full bg-current"
									style={{
										animation:
											'lumo-spinner-pulse var(--duration, 1s) linear infinite',
										animationDelay: `calc(var(--duration, 1s) / ${dotCount} * ${index - dotCount})`,
									}}
								/>
							</span>
						);
					})}
				</span>
				{label ? <span className="sr-only">{label}</span> : null}
			</span>
		</>
	);
}
```

## examples

Each is a page in this repository; the `@/` it imports resolve through the consumer’s own aliases once the files are installed.

### src/pages/Spinner/demos/basic.tsx

```tsx
import { Spinner } from '@/components/ui/spinner';

export default function Basic() {
	return <Spinner />;
}
```

### src/pages/Spinner/demos/inline.tsx

```tsx
import { Spinner } from '@/components/ui/spinner';

/** A number is ems of the text around it, so the ring follows the type it sits in. */
export default function Inline() {
	return (
		<div className="space-y-3 text-sm">
			<div className="flex items-center gap-2">
				<Spinner size={1} label={null} />
				<span className="text-muted-foreground">size={1}, next to text-sm</span>
			</div>
			<div className="flex items-center gap-3 text-2xl">
				<Spinner size={1} label={null} />
				<span className="text-muted-foreground text-sm">
					the same size={1}, next to text-2xl
				</span>
			</div>
		</div>
	);
}
```

### src/pages/Spinner/demos/sizes.tsx

```tsx
import { Spinner } from '@/components/ui/spinner';

export default function Sizes() {
	return (
		<div className="flex flex-wrap items-center gap-6 text-foreground">
			<Spinner />
			<Spinner size={3} />
			<Spinner size="2.5rem" className="text-muted-foreground" label="saving" />
		</div>
	);
}
```
