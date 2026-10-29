# lumo-ui — agent guide

Personal React component library: **Base UI** (behaviour) + **Tailwind v4** (styling) +
**CSS variables** (theme). Distributed by copying source into projects through a GitHub
registry. No npm package.

## Rules

1. No hardcoded visual values. Use tokens from `src/styles/lumo-tokens.css` (`bg-primary`,
   `text-muted-foreground`, `rounded-md`) — never `bg-blue-500`, `#fff` or `rounded-[6px]`.
2. Don't add a new token without a reason.
3. Don't write focus styles in components. Focus is defined once, in `:focus-visible` in
   `lumo-tokens.css`. The field family — a text field's shell, a checkbox, a radio, a switch — is
   the one exception: it drops the outline and moves its own edge to `--input-strong`, the same step
   a hover takes.
4. Base UI supplies behaviour, we supply appearance. Never reimplement focus trapping,
   escape handling, scroll lock, positioning or ARIA.
5. Merge the consumer's `className` last, with `cn()`.
6. When adding a component, only touch `src/components/lumo/` (`ui/` or `blocks/`), `src/lib/`,
   `src/styles/`.
7. Don't add comments that restate the code.

## Toolchain

- Bun for everything. No pnpm/npm/yarn commands, lockfiles or docs.
- `bun run check` = oxfmt + oxlint + tsc + the registry sync check, and `bun run check:fix`
  repairs all of it. Never commit a failing check.
- Style is enforced by `.oxfmtrc.jsonc`: tabs, single quotes, 100 columns, LF.
- `bun run build` is only `vite build`, because Cloudflare deploy runs it as the build step
  and a gate there fails a deploy over formatting. `bun run build:check` is the local build
  and is the one that has to pass.

## Adding a component

1. Read `src/components/lumo/ui/Button.tsx` first.
2. Pick the layer: `ui/` is a primitive that stands on its own, `blocks/` is a composition of
   primitives (the shell). The layer decides the shape and the registry type, so the check
   refuses a mismatch.
3. A `ui/` component is **one file**: `src/components/lumo/ui/<Name>.tsx`, PascalCase. Its
   parts are functions in that file, assembled at the end into one namespace object —
   `Dialog.tsx` holds Root, Trigger, Popup and the rest. Never `ui/Button/index.tsx`.
4. A `blocks/` component is **a directory**: `src/components/lumo/blocks/<Name>/index.tsx`,
   with a directory per part where that helps (`Layout/Sidebar/index.tsx`).
5. Export one namespace object: `export const Dialog = { Root, Trigger, Popup, ... }`, used
   as `<Dialog.Popup>`. A single-part component exports the function directly (`Button`).
   Keep every part exported: another component may reach for one (`CodeDiff` takes `Copy`
   from `Code`).
6. `data-slot="<name>-<part>"` on every rendered element.
7. Add a `registry.json` item whose `files` name one path — the file for a ui component, any
   file in the directory for a block — then run `bun run registry:sync` to fill in the rest.
   Use it in `src/pages/` so the docs show it.

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
// ui/Dialog.tsx — one file, every part a function in it
export function Popup({ className, ...props }: PopupProps) {
	return (
		<BaseDialog.Popup data-slot="dialog-popup" className={cn('...', className)} {...props} />
	);
}

export const Dialog = { Root, Trigger, Portal, Close, Backdrop, Viewport, Popup, Title, Description };
```

A part that needs no styling is a one-line assignment in the same file:
`export const Root = BaseDialog.Root`.

Consumers compose with `render` rather than wrapper props:

```tsx
<Dialog.Trigger render={<Button />} />
```

Don't rename Base UI's state attributes: `data-open`, `data-closed`,
`data-starting-style`, `data-ending-style`, `data-highlighted`, `data-disabled`.

## Registry

- `type: "registry:ui"` for a component under `ui/`, `"registry:block"` for one under `blocks/`;
  `scripts/check-registry.ts` fails on a mismatch, on a ui component that is not a single
  file, and on a component no item claims. Every item carries an explicit `target` per file,
  and each file stays `registry:file` — the type the CLI copies verbatim.
- Targets stay under `~/src/components/lumo/`, never `~/src/components/ui/` (shadcn's).
- **Declare every file in the component directory.** An undeclared file is silently left out
  of the consuming project and only breaks there, at build time.
- `registryDependencies` for lumo-ui items, `dependencies` for npm packages.
- `target` mirrors `path` exactly (`~/` + path), so a typo cannot silently land a file
  somewhere else; `scripts/check-registry.ts` enforces it.
- `bun run check` runs `scripts/check-registry.ts`, which fails on a file that exists but is
  not declared; `bun run registry:sync` writes it in instead.
