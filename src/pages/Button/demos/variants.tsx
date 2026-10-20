import { Button } from '@/components/lumo/ui/Button';

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;

export default function Variants() {
	return (
		<>
			{variants.map((variant) => (
				<Button key={variant} variant={variant}>
					{variant}
				</Button>
			))}
		</>
	);
}
