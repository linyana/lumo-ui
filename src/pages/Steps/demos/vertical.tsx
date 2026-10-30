import { Steps } from '@/components/ui/steps';

export default function Vertical() {
	return (
		<Steps.Root current={1} orientation="vertical" className="w-full max-w-sm text-sm">
			<Steps.Item>
				<Steps.Title>draft</Steps.Title>
				<Steps.Description>the author writes, the editor reads.</Steps.Description>
			</Steps.Item>
			<Steps.Item>
				<Steps.Title>review</Steps.Title>
				<Steps.Description>
					two approvals, or one from the owner. comments land in the thread and nothing
					else moves.
				</Steps.Description>
			</Steps.Item>
			<Steps.Item>
				<Steps.Title>publish</Steps.Title>
				<Steps.Description>scheduled, or now.</Steps.Description>
			</Steps.Item>
		</Steps.Root>
	);
}
