import { Check, Copy as CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/lumo/Button';
import { cn } from '@/lib/cn';

export type CopyProps = {
	value: string;
	className?: string;
};

/** Copies `value`, then says so for a moment. Silently does nothing where the clipboard is denied. */
export function Copy({ value, className }: CopyProps) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1600);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<Button
			data-slot="code-copy"
			size="icon"
			variant="ghost"
			icon={copied ? <Check /> : <CopyIcon />}
			aria-label={copied ? 'copied' : 'copy code'}
			className={cn('size-7 text-muted-foreground', className)}
			onClick={() => {
				navigator.clipboard.writeText(value).then(
					() => setCopied(true),
					() => {},
				);
			}}
		/>
	);
}
