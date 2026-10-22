import { KeyRound, Truck, Users } from 'lucide-react';
import { Steps } from '@/components/lumo/ui/Steps';

export default function Dots() {
	return (
		<div className="grid w-full max-w-lg gap-8 sm:grid-cols-2">
			<Steps.Root variant="dot" orientation="vertical" className="text-sm">
				<Steps.Item>
					<Steps.Title>requirements</Steps.Title>
					<Steps.Description>what has to be true first</Steps.Description>
				</Steps.Item>
				<Steps.Item>
					<Steps.Title>installation</Steps.Title>
					<Steps.Description>two commands, one file</Steps.Description>
				</Steps.Item>
				<Steps.Item>
					<Steps.Title>usage</Steps.Title>
					<Steps.Description>compose, do not configure</Steps.Description>
				</Steps.Item>
			</Steps.Root>
			<Steps.Root current={1} orientation="vertical" size="sm">
				<Steps.Item icon={<KeyRound />}>
					<Steps.Title>sign in</Steps.Title>
				</Steps.Item>
				<Steps.Item icon={<Users />}>
					<Steps.Title>pick a team</Steps.Title>
				</Steps.Item>
				<Steps.Item icon={<Truck />}>
					<Steps.Title>ship it</Steps.Title>
				</Steps.Item>
			</Steps.Root>
		</div>
	);
}
