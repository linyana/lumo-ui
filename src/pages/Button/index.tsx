import { useState } from 'react';
import { Check, ChevronRight, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/lumo/Button';
import { Spinner } from '@/components/lumo/Spinner';
import { DocPage, DocSection } from '@/pages/DocPage';

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export function ButtonPage() {
	const [saving, setSaving] = useState(false);

	return (
		<DocPage title="button" description="tailwind-variants API, token-driven appearance">
			<DocSection title="variants">
				<div className="flex flex-wrap gap-3">
					{variants.map((variant) => (
						<Button key={variant} variant={variant}>
							{variant}
						</Button>
					))}
				</div>
			</DocSection>

			<DocSection title="sizes">
				<div className="flex flex-wrap items-center gap-3">
					{sizes.map((size) => (
						<Button key={size} size={size}>
							{size}
						</Button>
					))}
					<Button size="icon" aria-label="add">
						<Plus />
					</Button>
				</div>
			</DocSection>

			<DocSection title="states">
				<div className="flex flex-wrap gap-3">
					<Button disabled>disabled</Button>
					<Button variant="outline" disabled>
						disabled outline
					</Button>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Button loading>loading</Button>
					<Button variant="outline" icon={<Plus />} loading>
						add
					</Button>
					<Button size="icon" loading aria-label="loading icon button">
						<Plus />
					</Button>
				</div>
			</DocSection>

			<DocSection
				title="interaction"
				note={
					<>
						hover and press are one state layer tinted by <code>currentColor</code>, so
						every variant reacts in the right direction without its own hover rule.
						press also nudges the button down 1px, except where{' '}
						<code>aria-haspopup</code> says it opens a popup — an overlay is positioned
						against that trigger's rect.
					</>
				}
			>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						loading={saving}
						onClick={() => {
							setSaving(true);
							setTimeout(() => setSaving(false), 1200);
						}}
					>
						save draft
					</Button>
					<Button variant="outline">hover me</Button>
					<Button variant="ghost">press me</Button>
				</div>
			</DocSection>

			<DocSection
				title="icon"
				note={
					<>
						one family, one source: a glyph arrives as itself — lucide by name, sized by
						the slot (<code>[&amp;_svg]:size-[1em]</code>), so nothing can drift in grid
						or stroke weight. loading is the one thing lucide cannot draw:{' '}
						<code>Spinner</code>, with <code>label={'{null}'}</code> inside a control
						that announces its own state.
					</>
				}
			>
				<div className="flex flex-wrap items-center gap-3">
					<Button icon={<Plus />}>add</Button>
					<Button variant="outline" icon={<Pencil />}>
						edit
					</Button>
					<Button variant="outline" icon={<Trash2 />}>
						delete
					</Button>
					<Button variant="outline" icon={<Check />}>
						saved
					</Button>
					<Button size="icon" variant="ghost" aria-label="close">
						<X />
					</Button>
					<Button size="icon" variant="ghost" aria-label="search" icon={<Search />} />
				</div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center text-sm">
						<ChevronRight className="size-[1em]" />
					</span>
					<span className="inline-flex items-center text-lg">
						<ChevronRight className="size-[1em]" />
					</span>
					<span className="inline-flex items-center text-2xl">
						<ChevronRight className="size-[1em]" />
					</span>
					<span className="inline-flex items-center text-2xl text-muted-foreground">
						<Spinner label={null} />
					</span>
				</div>
			</DocSection>
		</DocPage>
	);
}
