import { DocPage, DocSection } from '@/pages/DocPage';

export function MenuPage() {
	return (
		<DocPage title="menu" description="navigation rows: groups, icons, badges, submenus">
			<DocSection
				title="what the rail is made of"
				note={
					<>
						the menu knows nothing about the shell it sits in. it takes rows, draws
						them, and reports a selection; the shell decides what a selection means. a
						row that goes somewhere is{' '}
						<code className="rounded bg-muted px-1 py-0.5">Menu.Link</code>, not a
						button with an anchor inside — Base UI's button would put{' '}
						<code className="rounded bg-muted px-1 py-0.5">role="button"</code> on the
						anchor and take the link's own semantics away.
					</>
				}
			>
				<ul className="space-y-2 text-sm text-muted-foreground">
					<li>
						<code className="rounded bg-muted px-1 py-0.5">Group</code> — padding and a
						label, with an optional action of its own.
					</li>
					<li>
						<code className="rounded bg-muted px-1 py-0.5">Button</code> /{' '}
						<code className="rounded bg-muted px-1 py-0.5">Link</code> — a row that does
						something, or one that goes somewhere.
					</li>
					<li>
						<code className="rounded bg-muted px-1 py-0.5">Sub</code> — a row that owns
						sub rows: inline when the menu has width, a popover once it is a rail.
					</li>
					<li>
						<code className="rounded bg-muted px-1 py-0.5">Skeleton</code> — a
						placeholder row, for a menu that is still loading.
					</li>
				</ul>
			</DocSection>

			<DocSection
				title="active is the url"
				note={
					<>
						every row in this rail is handed to{' '}
						<code className="rounded bg-muted px-1 py-0.5">NavLink</code> through{' '}
						<code className="rounded bg-muted px-1 py-0.5">render</code>, and the row's
						highlight follows the location. there is no selection state to keep in sync,
						so a reload or a shared link lands on the same row.
					</>
				}
			>
				<p className="text-sm text-muted-foreground">
					the rail's submenu is the same mechanism one level down: a{' '}
					<code className="rounded bg-muted px-1 py-0.5">Sub</code> row expands in place
					here, and opens a popover instead once the rail is folded to icons.
				</p>
			</DocSection>
		</DocPage>
	);
}
