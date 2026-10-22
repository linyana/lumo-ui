import { Code } from '@/components/lumo/ui/Code';

export default function Unknown() {
	return (
		<Code
			code={'++[>+<-]\n// a grammar we do not ship'}
			language="brainfuck"
			fileName="hello.bf"
			className="w-full"
		/>
	);
}
