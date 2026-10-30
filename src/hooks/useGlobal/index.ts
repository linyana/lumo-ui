import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof packageManagers)[number];

export function isPackageManager(value: unknown): value is PackageManager {
	return packageManagers.some((manager) => manager === value);
}

type GlobalStateData = {
	packageManager: PackageManager;
};

export interface GlobalState extends GlobalStateData {
	update: (patch: Partial<GlobalStateData>) => void;
}

const initData: GlobalStateData = {
	packageManager: 'bun',
};

export const useGlobal = create<GlobalState>()(
	persist(
		(set) => ({
			...initData,
			update: (patch) => set(patch),
		}),
		{
			name: 'lumo-ui-global',
			partialize: (state) => ({ packageManager: state.packageManager }),
			merge: (persisted, current) => {
				const value =
					typeof persisted === 'object' &&
					persisted !== null &&
					'packageManager' in persisted
						? persisted.packageManager
						: undefined;
				return {
					...current,
					packageManager: isPackageManager(value) ? value : current.packageManager,
				};
			},
		},
	),
);
