import { Code } from '@/components/lumo/ui/Code';

const source = ['export const name =', "\t'lumo-ui';"].join('\n');

const variants = ['filled', 'outlined', 'ghost'] as const;

export default function Surfaces() {
	return (
		<div className="w-full space-y-3">
			{variants.map((variant) => (
				<Code
					key={variant}
					code={source}
					language="ts"
					fileName={variant}
					variant={variant}
				/>
			))}
		</div>
	);
}
