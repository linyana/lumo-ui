import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/lumo/ui/Skeleton';
import { Tabs } from '@/components/lumo/ui/Tabs';

/** What each tab asks for, and how much comes back: the length of the answer is the point here. */
const routes = [
	{ value: 'recent', label: 'recent', rows: 2 },
	{ value: 'shared', label: 'shared', rows: 6 },
	{ value: 'archived', label: 'archived', rows: 11 },
];

const WAIT = 900;

type Entry = { name: string; size: string };

/** Stands in for the request a tab makes when it opens: an answer that arrives a moment later. */
function request(rows: number): Promise<Entry[]> {
	return new Promise((resolve) => {
		setTimeout(
			() =>
				resolve(
					Array.from({ length: rows }, (_, index) => ({
						name: `note-${String(index + 1).padStart(2, '0')}.md`,
						size: `${(index + 1) * 2} kb`,
					})),
				),
			WAIT,
		);
	});
}

/**
 * A body that asks for its data when it mounts and holds a placeholder until the answer lands —
 * what a tab in a real app does every time it is opened. Nothing measured it ahead of the request:
 * the box is the placeholder's height first and the answer's second, and the glide between them is
 * the same one a swap gets.
 *
 * The `key` on it is what starts the request over: a new route is a new mount, so the state above
 * begins empty without an effect having to clear it.
 */
function Answer({ rows }: { rows: number }) {
	const [entries, setEntries] = useState<Entry[] | null>(null);

	useEffect(() => {
		let live = true;
		request(rows).then((next) => {
			if (live) setEntries(next);
		});
		return () => {
			live = false;
		};
	}, [rows]);

	if (entries === null) {
		return (
			<div className="space-y-2">
				<Skeleton className="h-4 w-2/3" />
				<Skeleton className="h-4 w-1/2" />
			</div>
		);
	}

	return (
		<ul className="divide-y">
			{entries.map((entry) => (
				<li
					key={entry.name}
					className="flex items-baseline justify-between gap-3 py-1.5 first:pt-0 last:pb-0"
				>
					<span className="font-mono text-sm">{entry.name}</span>
					<span className="text-xs text-muted-foreground">{entry.size}</span>
				</li>
			))}
		</ul>
	);
}

export default function Request() {
	const [value, setValue] = useState(routes[0]!.value);
	const route = routes.find((item) => item.value === value) ?? routes[0]!;

	return (
		<div className="w-full max-w-sm space-y-3">
			<Tabs.Root value={value} onValueChange={(next) => setValue(next)}>
				<Tabs.List>
					{routes.map((item) => (
						<Tabs.Tab key={item.value} value={item.value}>
							{item.label}
						</Tabs.Tab>
					))}
					<Tabs.Indicator />
				</Tabs.List>
				<Tabs.Panel value={value}>
					{/* Keyed by the route, so opening a tab asks again instead of reusing the last
					    answer — the reason each switch costs a request. */}
					<Answer key={route.value} rows={route.rows} />
				</Tabs.Panel>
			</Tabs.Root>
			<p className="text-sm text-muted-foreground">
				opening a tab asks again, and the answer is what sizes the panel: the placeholder
				first, the list second.
			</p>
		</div>
	);
}
