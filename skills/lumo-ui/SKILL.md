---
name: lumo-ui
description: Build React interfaces with Lumo UI, a Base UI and Tailwind v4 component library distributed through a shadcn registry. Use when installing @lumo components, composing screens, changing themes, or looking up component parts, props, variants, and examples.
---

# Lumo UI

## Read the current documentation

Fetch https://ui.lumo.cab/skills.md before implementing Lumo UI interfaces. It is the
maintained skill document, generated from the component registry, source, examples,
and repository rules. Use its installation instructions and component index rather
than guessing APIs or relying on an older component list.

Resolve root-relative documentation links against https://ui.lumo.cab, not against
the consuming project's filesystem or development server.

- https://ui.lumo.cab/llms.txt is the documentation index.
- https://ui.lumo.cab/docs/<name>.md contains an item's installation command, source,
  and examples. Replace `<name>` with an item from the index.
- https://ui.lumo.cab/llms-full.txt contains all component documentation in one file;
  prefer individual item pages when only a few components are needed.

Read the relevant item's source and examples before writing a call site. Follow the
consumer's aliases and existing project conventions. If the documentation cannot be
retrieved, use installed component source when available and report the limitation;
do not invent missing parts, props, or installation steps.
