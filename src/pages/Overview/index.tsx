import { ArrowUpRight, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { Toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { DocPage } from '@/pages/DocPage';
import { previewGroups as groups, type ComponentPreview, type Room } from '@/pages/previews';

const rooms: Record<Room, string> = {
	compact: 'h-52',
	regular: 'h-72',
	tall: 'h-96',
	// One demo is a whole rail rather than a row or a panel, and is the only one that outgrows
	// `tall`: the list is not cut at either end.
	xtall: 'h-116',
};

/**
 * How a group of tiles arrives: it rises the one step a `Tabs.Panel` moves by, on the overlay's own
 * timing, so switching groups reads here the way it reads anywhere else in the library.
 */
const arrive = cn(
	'transition-[opacity,translate] duration-(--duration-overlay) ease-(--ease-overlay)',
	'starting:translate-y-(--shift-content) starting:opacity-0',
);

type PreviewProps = ComponentPreview;

/**
 * One tile: the demo, and one white pill over it that names the component and is the way in. The
 * pill appears when the tile is pointed at or reached by keyboard — the demo under it keeps its own
 * interactions, so the tile itself is not a link.
 */
function Preview({ path, label, Demo, room = 'regular' }: PreviewProps) {
	return (
		<Card.Root
			data-slot="overview-card"
			className={cn(
				'group/tile relative mb-4 break-inside-avoid gap-0 overflow-hidden py-0',
				rooms[room],
			)}
		>
			{/*
				Nothing is scaled to fit: a transform here would hand `getBoundingClientRect` a size
				the demo never had, which is exactly what Transition measures. A demo taller than the
				tile scrolls instead, so no part of it is out of reach.
			*/}
			<Card.Content
				className={cn(
					'min-h-0 overflow-auto p-5',
					'scrollbar-none [&::-webkit-scrollbar]:hidden',
				)}
			>
				<div className="flex min-h-full flex-wrap items-center justify-center gap-2">
					<Demo />
				</div>
			</Card.Content>
			<div
				data-slot="overview-card-open"
				className="absolute inset-e-3 top-3 flex items-center"
			>
				<Button
					size="sm"
					variant="secondary"
					nativeButton={false}
					// A link, not a button: the tile navigates, and an anchor keeps the middle-click,
					// the context menu and the status bar the browser gives every link.
					render={<Link to={`/${path}`} />}
					aria-label={label}
					icon={<ArrowUpRight />}
					// Hidden until the tile is pointed at, but reachable before it is: a link that
					// could not be seen while it held focus would be a target with no target.
					className={cn(
						'rounded-full border bg-background px-3 text-muted-foreground',
						// The pill drops into its corner out of the edge it belongs to, so the tile answers
						// the pointer with motion rather than with a change in its own fill.
						'-translate-y-1 scale-95 opacity-0',
						'transition-[color,opacity,translate,scale] ease-(--ease-spring) duration-(--duration-turn)',
						'group-hover/tile:translate-y-0 group-hover/tile:scale-100 group-hover/tile:opacity-100',
						'focus-visible:translate-y-0 focus-visible:scale-100 focus-visible:opacity-100',
						// The pill is white, and the demo under it may be drawn on a white page of its own, so
						// the edge is what keeps it a pill there. What moves under the pointer is the ink: the
						// name and the arrow deepen to the foreground.
						'hover:text-foreground after:hidden',
					)}
				>
					{label}
				</Button>
			</div>
		</Card.Root>
	);
}

export function OverviewPage() {
	const [query, setQuery] = useState('');
	const [active, setActive] = useState<string>('all');
	/**
	 * Whether a group has been picked yet: the list the page opens on is not one that arrived from
	 * anywhere, so only a switch is re-keyed and so animated.
	 */
	const [switched, setSwitched] = useState(false);
	const list = useRef<HTMLDivElement | null>(null);
	const needle = query.trim().toLowerCase();
	const shown = groups
		.filter((group) => active === 'all' || group.title === active)
		.flatMap((group) =>
			group.previews.filter(({ path, label }) =>
				`${label} ${path}`.toLowerCase().includes(needle),
			),
		);

	// A group change replaces the list, and the reader is somewhere inside the old one. The shell owns
	// the box that scrolls, so the page cannot put it back; the list can be brought into view instead,
	// and its scroll margin is the bar already pinned above it.
	const select = (next: string) => {
		setSwitched(true);
		setActive(next);
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		list.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'instant' : 'smooth' });
	};

	return (
		<DocPage wide className="pt-0">
			{/* The toast demo reads its queue from context, and shows it in the fixed strip. */}
			<Toast.Provider>
				<div className="space-y-6">
					{/*
						The filter stays put: the column it filters is longer than the screen. The groups
						are one of many, so they are a `Tabs.List` — the library's own shape for a choice
						that is picked from a row — and the bar is the root, which only holds them.
					*/}
					<Tabs.Root
						value={active}
						onValueChange={(next) => select(String(next))}
						data-slot="overview-filter"
						className={cn(
							'sticky top-0 z-10 -mx-8 flex flex-wrap items-center gap-3',
							'bg-layout-content px-8 py-3',
						)}
					>
						{/* A phone cannot hold seven groups, so the track scrolls rather than overflows. */}
						<Tabs.List
							aria-label="component groups"
							className={cn(
								'rounded-xl',
								'max-w-full overflow-x-auto',
								'scrollbar-none [&::-webkit-scrollbar]:hidden',
							)}
						>
							<Tabs.Tab value="all">All</Tabs.Tab>
							{groups.map((group) => (
								<Tabs.Tab key={group.title} value={group.title}>
									{group.title}
								</Tabs.Tab>
							))}
							<Tabs.Indicator className="rounded-lg" />
						</Tabs.List>
						<div className="relative ms-auto w-full sm:w-56">
							<Search
								aria-hidden
								className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								type="search"
								size="lg"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="filter components"
								aria-label="filter components"
								autoComplete="off"
								spellCheck={false}
								className="rounded-xl ps-9"
							/>
						</div>
					</Tabs.Root>

					{/*
						The group is the key: a list chosen again is an element that arrives, so it can be
						animated into place. A search is not a key — a grid that re-entered on every keypress
						would be a grid that flickers.
					*/}
					<div
						key={switched ? active : undefined}
						ref={list}
						data-slot="overview-results"
						className={cn('scroll-mt-20', switched && arrive)}
					>
						{shown.length === 0 ? (
							<div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
								<p>no component matches “{query.trim() || active}”.</p>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => {
										setQuery('');
										select('all');
									}}
								>
									clear filters
								</Button>
							</div>
						) : (
							/* Columns, not a grid: a tile keeps its own height and the next one starts right
							   under it, which is what makes the column read as one run down the page. */
							<div
								data-slot="overview-columns"
								className="columns-1 gap-4 md:columns-2 xl:columns-3"
							>
								{shown.map((preview) => (
									<Preview {...preview} key={preview.path} />
								))}
							</div>
						)}
					</div>
				</div>
				<Toast.Toaster />
			</Toast.Provider>
		</DocPage>
	);
}
