import { CodeDiff } from '@/components/ui/code-diff';

const before = "export const theme = 'light';";
const after = "export const theme = 'dark';";

const variants = ['filled', 'ghost'] as const;

export default function Surfaces() {
	return (
		<div className="w-full space-y-3">
			{variants.map((variant) => (
				<CodeDiff
					key={variant}
					oldContent={before}
					newContent={after}
					language="ts"
					fileName={`${variant}.ts`}
					variant={variant}
				/>
			))}
		</div>
	);
}
