# lumo-ui — agent guide

Personal React component library: **Base UI** (behaviour) + **Tailwind v4** (styling) +
**CSS variables** (theme). Distributed as a shadcn registry — no npm package. The CLI is what
installs it: it copies each file into the *consumer's* aliases (`@/components/ui`, `@/lib`),
rewrites the imports to match them, merges the theme into the consumer's CSS, and skips a file that
is already there with the same content, so one Button serves every install.

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
6. When adding a component, only touch `src/components/ui/`, `src/components/blocks/`,
   `src/lib/`, `src/styles/`.
7. Don't add comments that restate the code.

## Toolchain

- Bun for everything. No pnpm/npm/yarn commands, lockfiles or docs.
- `bun run check` = oxfmt + oxlint + tsc + the registry sync check, and `bun run check:fix`
  repairs all of it. Never commit a failing check.
- Style is enforced by `.oxfmtrc.jsonc`: tabs, single quotes, 100 columns, LF.
- `bun run build` is `bun run registry:build && vite build`: the registry's JSON is generated into
  `public/r/` and then shipped with the site, because the site *is* the registry
  (`https://<host>/r/button.json`). Cloudflare deploy runs it as the build step, so it stays a
  generation step and never a gate. `bun run build:check` is the local build and is the one that
  has to pass.
- `bun run registry:check` is shadcn's own validator; `bun run registry:sync` is
  `scripts/check-registry.ts --fix`.

## Adding a component

1. Read `src/components/ui/button.tsx` first.
2. Pick the layer: `ui/` is a primitive that stands on its own, `blocks/` is a composition of
   primitives (the shell). The layer decides the shape and the registry type, so the check
   refuses a mismatch.
3. A `ui/` component is **one file**: `src/components/ui/<name>.tsx` — kebab-case, the same
   spelling as its registry item — and its parts are functions in that file, assembled at the end
   into one namespace object: `dialog.tsx` holds Root, Trigger, Popup and the rest. Never
   `ui/button/index.tsx`.
4. A `blocks/` component is **a directory**: `src/components/blocks/<name>/index.tsx`, lower-case
   throughout, with a directory per part where that helps (`layout/sidebar/index.tsx`).
5. Export one namespace object: `export const Dialog = { Root, Trigger, Popup, ... }`, used
   as `<Dialog.Popup>`. A single-part component exports the function directly (`Button`).
   Keep every part exported: another component may reach for one (`CodeDiff` takes `Copy`
   from `Code`).
6. `data-slot="<name>-<part>"` on every rendered element.
7. Add a `registry.json` item named after the file or directory (`code-diff`,
   `layout`) with its `type`, and run `bun run registry:sync` to fill in every file. Use it in
   `src/pages/` so the docs show it.

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

That is also the axis a component here is compared on. `render` is Base UI's — and it is what
shadcn's own unstyled layer uses (`@shadcn/react`, a port of base-ui's `useRender`), so a Radix-era
`asChild` is not a contract this library keeps: a component takes `render`, and the state attributes
below are Base UI's own.

Don't rename Base UI's state attributes: `data-open`, `data-closed`,
`data-starting-style`, `data-ending-style`, `data-highlighted`, `data-disabled`.

## Registry

The manifest mirrors the tree, because the tree *is* the install: `files[].path` is where the file
lives here and `files[].type` is the layer it belongs to. Where it lands in a project is the CLI's
decision, from that type and the consumer's `components.json`.

- `registry:ui` for a file under `src/components/ui/`, `registry:block` for a directory under
  `src/components/blocks/`, `registry:lib` for a file under `src/lib/`. The item is named after
  the file or directory (kebab-case); `scripts/check-registry.ts` fails on a mismatch, on a ui
  component that is not a single file, and on a component no item claims.
- **No `target`** on those files. A ui component lands on `aliases.ui`, a lib helper on
  `aliases.lib`; naming a path here is how you end up with a second copy beside the one the
  consumer already has, instead of sharing it. The one exception is a block, whose parts share a
  directory the CLI would otherwise strip: it carries `target: "@components/<path>"`.
- **Declare every file in the component directory.** An undeclared file is silently left out of the
  consuming project and only breaks there, at build time.
- `registryDependencies` spell the namespace, `@lumo/<name>`; `dependencies` carry npm packages.
  Everything a copied file imports has to be on one of the two lists — the check reads the code and
  fails otherwise.
- An npm dependency is named bare (`tailwind-variants`), never with a range: an install resolves
  `latest`, and that is the policy here — no version of this library ever ships an older one. What
  keeps that honest is the other half of the rule: the check fails on a package an item ships that
  `package.json` does not declare, so the repository is always on something. Bump here with
  `bun add <name>@latest` when a major moves; `bun outdated` is how you find out.
- The theme is not a file. `scripts/theme.ts` reads `src/styles/lumo-tokens.css` and
  `lumo-palette.css` and writes them into two items as `cssVars` + `css`, which the CLI merges
  into the consumer's stylesheet: `theme` (`registry:style`, written over whatever is there) and
  `palette` (`registry:item`, added only where the consumer has no colours). Edit the CSS, never
  `registry.json`; `bun run registry:sync` rewrites the items from it.
- `bun run check` runs `scripts/check-registry.ts`, which fails on any of the drift above;
  `bun run registry:sync` writes it in instead.

## Consuming

```json
"registries": { "@lumo": "https://<host>/r/{name}.json" }
```

`bunx shadcn@latest add @lumo/button`, then `@lumo/theme` once (required) and `@lumo/palette` if
the project has no colours of its own. The namespace is declared in the consumer's
`components.json` (or `package.json`), which is also where its aliases come from — a file already
installed with the same content is skipped, so adding a second component shares the first.
