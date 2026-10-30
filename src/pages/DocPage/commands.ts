import type { PackageManager } from '@/hooks/useGlobal';

const runners: Record<PackageManager, string> = {
	bun: 'bunx',
	pnpm: 'pnpm dlx',
	npm: 'npx',
	yarn: 'yarn dlx',
};

const installers: Record<PackageManager, string> = {
	bun: 'bun add',
	pnpm: 'pnpm add',
	npm: 'npm install',
	yarn: 'yarn add',
};

/** Only consumer install commands opt in; CSS and repository tooling stay untouched. */
export function packageCommand(command: string, manager: PackageManager): string | null {
	if (command.startsWith('bunx shadcn@latest ')) {
		return `${runners[manager]} ${command.slice('bunx '.length)}`;
	}
	if (command.startsWith('bun add ')) {
		return `${installers[manager]} ${command.slice('bun add '.length)}`;
	}
	return null;
}
