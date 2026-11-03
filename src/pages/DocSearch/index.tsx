import { Autocomplete } from '@base-ui/react/autocomplete';
import {
	ArrowDown,
	ArrowUp,
	ArrowUpRight,
	CornerDownLeft,
	FileText,
	Search,
	X,
} from 'lucide-react';
import { useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { inputVariants } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';
import { row } from '@/lib/control';
import { cn } from '@/lib/utils';
import { componentPreviews } from '@/pages/previews';

export type SearchPage = {
	path: string;
	label: string;
	section: string;
	external?: boolean;
};

type DocSearchProps = {
	pages: SearchPage[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	finalFocus: () => HTMLElement | null;
};

function normalize(value: string) {
	return value
		.normalize('NFKC')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '');
}

function subscribeToDesktop(onChange: () => void) {
	const media = window.matchMedia('(min-width: 768px)');
	media.addEventListener('change', onChange);
	return () => media.removeEventListener('change', onChange);
}

const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

function PagePreview({ page, onOpen }: { page: SearchPage; onOpen: () => void }) {
	const Demo = componentPreviews.get(page.path)?.Demo;
	const link = page.external ? (
		<a href={`/${page.path}`} target="_blank" rel="noreferrer" />
	) : (
		<Link to={`/${page.path}`} />
	);

	return (
		<section
			data-slot="doc-search-preview"
			aria-label={`${page.label} preview`}
			className="flex min-h-0 min-w-0 flex-1 flex-col border-s bg-background"
		>
			<div className="flex shrink-0 items-center justify-between gap-3 px-5 py-4">
				<div className="min-w-0">
					<p className="truncate text-sm font-medium">{page.label}</p>
					<p className="text-xs text-muted-foreground">
						{Demo ? 'Preview' : page.section}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					nativeButton={false}
					render={link}
					icon={<ArrowUpRight />}
					aria-label={`Open ${page.label}`}
					onClick={onOpen}
				/>
			</div>
			<div className="min-h-0 flex-1 overflow-auto overscroll-contain p-6">
				{Demo ? (
					<Toast.Provider>
						<div className="flex min-h-full flex-wrap items-center justify-center gap-2">
							<Demo />
						</div>
						<Toast.Toaster />
					</Toast.Provider>
				) : (
					<div className="flex min-h-full flex-col items-center justify-center gap-4 text-center">
						<FileText aria-hidden="true" className="size-6 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							{page.external
								? 'Open this document in a new tab.'
								: 'Open this page to read the documentation.'}
						</p>
						<Button
							variant="secondary"
							nativeButton={false}
							render={link}
							onClick={onOpen}
						>
							Open {page.label}
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}

function SearchContent({
	pages,
	open,
	onClose,
	input,
}: {
	pages: SearchPage[];
	open: boolean;
	onClose: () => void;
	input: RefObject<HTMLInputElement | null>;
}) {
	const [query, setQuery] = useState('');
	const [highlighted, setHighlighted] = useState<SearchPage>();
	const desktop = useSyncExternalStore(subscribeToDesktop, isDesktop, () => false);
	const navigate = useNavigate();
	const results = useMemo(() => {
		const words = query.trim().split(/\s+/).map(normalize).filter(Boolean);
		const needle = normalize(query);
		return pages
			.filter((page) => {
				const text = normalize(`${page.label} ${page.path} ${page.section}`);
				return words.every((word) => text.includes(word));
			})
			.sort((a, b) => {
				const exact = (page: SearchPage) =>
					needle !== '' &&
					(normalize(page.label) === needle || normalize(page.path) === needle);
				return Number(exact(b)) - Number(exact(a));
			});
	}, [pages, query]);
	const active = highlighted && results.includes(highlighted) ? highlighted : results[0];

	return (
		<Autocomplete.Root
			items={pages}
			filteredItems={results}
			itemToStringValue={(page) => page.label}
			value={query}
			onValueChange={setQuery}
			onItemHighlighted={setHighlighted}
			inline
			open={open}
			autoHighlight="always"
			keepHighlight
		>
			<div className="flex shrink-0 items-center gap-3 border-b p-3">
				<Dialog.Title className="sr-only">Search</Dialog.Title>
				<div className="relative min-w-0 flex-1">
					<Search
						aria-hidden="true"
						className={cn(
							'pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2',
							'text-muted-foreground',
						)}
					/>
					<Autocomplete.Input
						ref={input}
						data-slot="doc-search-input"
						aria-label="Search"
						placeholder="Search…"
						autoComplete="off"
						spellCheck={false}
						className={cn(inputVariants({ size: 'lg' }), 'ps-9')}
					/>
				</div>
				<Dialog.Close
					render={<Button variant="ghost" size="icon" icon={<X />} />}
					aria-label="Close search"
				/>
			</div>
			<div className="flex min-h-0 flex-1">
				<div className="flex min-h-0 w-full flex-col md:w-72 md:shrink-0">
					<p className="shrink-0 px-4 pt-4 pb-2 text-xs text-muted-foreground">
						{results.length} {results.length === 1 ? 'page' : 'pages'}
					</p>
					<Autocomplete.List
						data-slot="doc-search-results"
						aria-label="Pages"
						className={cn(
							'min-h-0 flex-1 overflow-y-auto overscroll-contain py-1 scroll-py-2',
							'data-empty:flex-none',
						)}
					>
						{(page: SearchPage) => (
							<Autocomplete.Item
								key={page.path}
								value={page}
								data-slot="doc-search-result"
								onClick={() => {
									if (page.external) {
										window.open(
											`/${page.path}`,
											'_blank',
											'noopener,noreferrer',
										);
									} else {
										navigate(`/${page.path}`);
									}
									onClose();
								}}
								className={cn(row, 'cursor-pointer flex-col gap-1 py-3 pe-4')}
							>
								<span className="font-medium">{page.label}</span>
								<span className="text-xs text-muted-foreground">
									{page.section}
								</span>
							</Autocomplete.Item>
						)}
					</Autocomplete.List>
					<Autocomplete.Empty data-slot="doc-search-empty">
						<div className="flex flex-col items-center gap-3 px-4 py-8 text-center text-sm">
							<p className="text-muted-foreground">
								No pages found. Try another name.
							</p>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => {
									setQuery('');
									input.current?.focus();
								}}
							>
								Clear search
							</Button>
						</div>
					</Autocomplete.Empty>
					<Autocomplete.Status className="sr-only">
						{results.length} pages found.
					</Autocomplete.Status>
				</div>
				{desktop && active && (
					<PagePreview key={active.path} page={active} onOpen={onClose} />
				)}
				{desktop && !active && (
					<div
						className={cn(
							'flex flex-1 items-center justify-center border-s bg-muted/30 p-6',
							'text-sm text-muted-foreground',
						)}
					>
						Search for a page to see its preview.
					</div>
				)}
			</div>
			<div
				className={cn(
					'flex shrink-0 flex-wrap items-center gap-4 border-t px-4 py-3',
					'text-xs text-muted-foreground',
				)}
			>
				<span className="inline-flex items-center gap-1">
					<ArrowUp aria-hidden="true" className="size-3" />
					<ArrowDown aria-hidden="true" className="size-3" />
					Navigate
				</span>
				<span className="inline-flex items-center gap-1">
					<CornerDownLeft aria-hidden="true" className="size-3" /> Open
				</span>
				<span className="ms-auto">Esc to close</span>
			</div>
		</Autocomplete.Root>
	);
}

export function DocSearch({ pages, open, onOpenChange, finalFocus }: DocSearchProps) {
	const input = useRef<HTMLInputElement>(null);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup
						data-slot="doc-search"
						initialFocus={input}
						finalFocus={finalFocus}
						className="flex h-132 max-w-4xl flex-col overflow-hidden p-0"
					>
						<SearchContent
							pages={pages}
							open={open}
							onClose={() => onOpenChange(false)}
							input={input}
						/>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
