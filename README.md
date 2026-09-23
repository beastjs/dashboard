# saia

A [Beast](https://www.npmjs.com/package/beast-tsrx) project powered by
[TSRX](https://tsrx.dev/) and [Octane](https://octanejs.dev/).

```bash
bun install
bun run dev
```

Edit `src/App.btsx` to get started. Declare typed props at the top of the BTSX
file; the Beast bundler adapter compiles it into native TSRX and then lets Octane
produce the browser module.

The starter pins the tested `octane@0.2.13` toolchain. Run the complete local
verification before shipping:

```bash
bun run check
```

Use `scope` when setup belongs to an exact child position instead of the whole
component:

```btsx
scope
  setup const label = "Owned by this child";
  p #{label}
```

Octane signals need no build option. Import `octane/signals` in a module to
enable native signal reads there:

```btsx
import { createScope } from "octane/signals"
```

Record application changes in [CHANGELOG.md](CHANGELOG.md).

## Theme context and Octane upgrades

`src/components/Theme.btsx` provides its value with `ThemeContext(value={value})`.
This direct context syntax works with the pinned Octane 0.2.13 and follows the
[Context.Provider removal](https://github.com/octanejs/octane/commit/a6d7f4986c47f16968a3cbd977f073a5cbb39c74).
Keep `useTheme()` consumers beneath the theme provider, which wraps the app
content in `App.btsx`.

When upgrading Octane, select compatible Beast, Octane bundler plugin, TSRX
tooling, and `@octanejs/shadcn` versions together, checking their peer ranges.
The pinned Beast version declares `octane: ^0.2.8`, which excludes Octane 0.3.
Run `bun run check` and verify theme toggling and persisted preferences in the
browser after connecting the provider. This migration addresses the provider
syntax change; it does not establish compatibility with every future release.

## Selected stack

- Bundler: rsbuild
- UI: shadcn (@octanejs/shadcn)
- Styling: Tailwind CSS v4

```ts
import { Button } from "@octanejs/shadcn/Button";
import "@octanejs/shadcn/theme.css";
```
