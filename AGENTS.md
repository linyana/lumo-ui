# lumo-ui — agent guide

Personal React component library: **Base UI** (behaviour) + **Tailwind v4** (styling) +
**CSS variables** (theme). Distributed by copying source into projects through a GitHub
registry. No npm package.

## Rules

1. No hardcoded visual values. Use tokens from `src/styles/lumo-tokens.css` (`bg-primary`,
   `text-muted-foreground`, `rounded-md`) — never `bg-blue-500`, `#fff` or `rounded-[6px]`.
2. Don't add a new token without a reason.
3. Don't write focus styles in components. Focus is defined once, in `:focus-visible` in
   `lumo-tokens.css`.
4. Base UI supplies behaviour, we supply appearance. Never reimplement focus trapping,
   escape handling, scroll lock, positioning or ARIA.
5. Merge the consumer's `className` last, with `cn()`.
6. When adding a component, only touch `src/components/lumo/`, `src/lib/`, `src/styles/`.
7. Don't add comments that restate the code.

## Toolchain

- Bun for everything. No pnpm/npm/yarn commands, lockfiles or docs.
- `bun run check` = oxfmt + oxlint + tsc + the registry sync check, and `bun run check:fix`
  repairs all of it. Never commit a failing check.
- Style is enforced by `.oxfmtrc.jsonc`: tabs, single quotes, 100 columns, LF.

## Adding a component

1. Read `src/components/lumo/Button/` first.
2. One directory per component, PascalCase, implementation in `index.tsx`:
   `src/components/lumo/<Name>/index.tsx`. Never `<name>.tsx` or `<Name>/<Name>.tsx`.
3. A component with parts gives **each part its own directory** — `Dialog/Popup/index.tsx`,
   never `dialog/popup.tsx`. The parent `index.tsx` imports the parts and assembles them.
4. Export one namespace object: `export const Dialog = { Root, Trigger, Popup, ... }`, used
   as `<Dialog.Popup>`. A single-part component exports the function directly (`Button`).
5. `data-slot="<name>-<part>"` on every rendered element.
6. Add a `registry.json` item whose `files` name any one path in the new directory, then run
   `bun run registry:sync` to fill in the rest. Use it in `src/App.tsx`.

## Icons

Every glyph comes from lucide, imported by name where it is used (`icon={<Trash2 />}`): one family,
one grid (24, 2 stroke, round caps), tree-shaken. Nothing wraps them — there is no lumo icon
component, because a wrapper would only be a second set of names for the same drawings.

Two things lucide cannot supply:

- **A state.** Loading is `Spinner`, the library's only loading indicator, which sizes itself in `em`
  so a control loads at exactly the size of the icon it replaces. Pass `label={null}` inside a control
  that announces its own state — `Button` does, and its default `loadingIcon` is that element.
- **A glyph lucide does not ship.** Make one with `createLucideIcon`, which puts it on lucide's own
  grid and stroke so it reads as one of the set. Used once, keep it a local constant; used in many
  places, it earns a component of its own.

A slot takes a rendered element (`icon={<Trash2 />}`, `icon={<Spinner label={null} />}`) — never an
icon-component type, never a name from a glyph library. Size is the surrounding text's: every slot
carries `[&_svg]:size-[1em]`, so a call site passes no size and an icon inside a `text-lg` control
grows with it. Outside a slot, size it yourself and centre it — `align-middle`, or a flex row, since
a bare text line puts an inline svg and a spinner at different heights. Name slots by role (`icon`,
`loadingIcon`)
and add a second slot only when it means something different.

A glyph whose appearance is bound to the component's own state is a part instead —
`Collapsible.Icon` owns its rotation, because no generic icon could know when to turn.

## Variants

Use `tailwind-variants` and export the variants object. Mirror the variant onto the DOM
(`data-variant`, `data-size`) so consumers can target it from plain CSS.

## Wrapping Base UI

Base UI is already namespaced — keep that shape, never flatten it into `DialogPopup`. Each
part is one directory exporting one name; the parent `index.tsx` assembles them.

```tsx
// Dialog/Popup/index.tsx
export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseDialog.Popup data-slot="dialog-popup" className={cn('...', className)} {...props} />
	);
}

// Dialog/index.tsx
export const Dialog = { Root, Trigger, Portal, Close, Backdrop, Viewport, Popup, Title, Description };
```

A part that needs no styling is a one-line re-export: `Dialog/Root/index.tsx` is
`export const Root = BaseDialog.Root`.

Consumers compose with `render` rather than wrapper props:

```tsx
<Dialog.Trigger render={<Button />} />
```

Don't rename Base UI's state attributes: `data-open`, `data-closed`,
`data-starting-style`, `data-ending-style`, `data-highlighted`, `data-disabled`.

## Registry

- `type: "registry:block"` for components, with an explicit `target` per file; never
  `registry:ui`.
- Targets stay under `~/src/components/lumo/`, never `~/src/components/ui/` (shadcn's).
- **Declare every file in the component directory.** An undeclared file is silently left out
  of the consuming project and only breaks there, at build time.
- `registryDependencies` for lumo-ui items, `dependencies` for npm packages.
- `target` mirrors `path` exactly (`~/` + path), so a typo cannot silently land a file
  somewhere else; `scripts/check-registry.ts` enforces it.
- `bun run check` runs `scripts/check-registry.ts`, which fails on a file that exists but is
  not declared; `bun run registry:sync` writes it in instead.
