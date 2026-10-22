import { Steps } from '@/components/lumo/ui/Steps';

export default function Basic() {
	return (
		<Steps.Root current={1} className="w-full max-w-lg">
			<Steps.Item>
				<Steps.Title>account</Steps.Title>
				<Steps.Description>email and password</Steps.Description>
			</Steps.Item>
			<Steps.Item>
				<Steps.Title>workspace</Steps.Title>
				<Steps.Description>name and region</Steps.Description>
			</Steps.Item>
			<Steps.Item>
				<Steps.Title>invite</Steps.Title>
				<Steps.Description>who joins first</Steps.Description>
			</Steps.Item>
		</Steps.Root>
	);
}
