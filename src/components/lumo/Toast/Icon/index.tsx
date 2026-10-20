import type { ReactNode } from 'react';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import { Spinner } from '@/components/lumo/Spinner';
import { useToastItem } from '@/components/lumo/Toast/context';
import { cn } from '@/lib/cn';

/** The glyph a type earns. `loading` is a state rather than an icon, so it gets the spinner. */
function glyphOf(type: string | undefined): ReactNode {
	switch (type) {
		case 'success':
			return <CircleCheck />;
		case 'error':
			return <CircleX />;
		case 'info':
			return <Info />;
		case 'loading':
			return <Spinner className="size-4" label={null} />;
		default:
			return null;
	}
}

/** Only the two outcomes worth reading at a glance take a colour; the rest stay muted. */
function toneOf(type: string | undefined) {
	if (type === 'success') return 'text-success';
	if (type === 'error') return 'text-destructive';
	return 'text-muted-foreground';
}

export type IconProps = {
	/** Overrides the type carried by the toast this sits in. */
	type?: string;
	/** A glyph of your own, which wins over the type. */
	icon?: ReactNode;
	className?: string;
};

/** Draws the toast's type, read off the root it sits in. Nothing to draw renders nothing. */
export function Icon({ type, icon, className }: IconProps) {
	const toast = useToastItem();
	const resolved = type ?? toast?.type;
	const glyph = icon ?? glyphOf(resolved);

	if (glyph === null) return null;

	return (
		<span
			data-slot="toast-icon"
			className={cn(
				'mt-0.5 flex size-4 shrink-0 items-center justify-center',
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
				toneOf(resolved),
				className,
			)}
		>
			{glyph}
		</span>
	);
}
