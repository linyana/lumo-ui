import { Steps } from '@/components/lumo/ui/Steps';

export default function Failed() {
	return (
		<Steps.Root current={1} className="w-full max-w-lg">
			<Steps.Item>
				<Steps.Title>build</Steps.Title>
			</Steps.Item>
			<Steps.Item>
				<Steps.Title>test</Steps.Title>
			</Steps.Item>
			<Steps.Item status="error">
				<Steps.Title>deploy</Steps.Title>
				<Steps.Description>exited 1 after 12s</Steps.Description>
			</Steps.Item>
		</Steps.Root>
	);
}
