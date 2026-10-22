import { Code } from '@/components/lumo/ui/Code';

const source = [
	"import { clsx, type ClassValue } from 'clsx';",
	"import { twMerge } from 'tailwind-merge';",
	'',
	'/** Merges class names, last one wins. */',
	'export function cn(...inputs: ClassValue[]) {',
	'\treturn twMerge(clsx(inputs));',
	'}',
].join('\n');

export default function Basic() {
	return <Code code={source} language="ts" fileName="cn.ts" className="w-full" />;
}
