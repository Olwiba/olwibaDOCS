# Changelog

## 0.1.29

### Fixed

- `types:check` now targets only publishable source (`src/**`) via `tsconfig.package.json` — site and script type errors no longer block the publish CI step

## 0.1.28

### Changed

- Bumped `@olwiba/dx` from `0.0.10` → `0.0.18` and `@olwiba/cn` from `0.1.15` → `0.1.20`.
- `sync-from-cn` script now exits non-zero on missing upstream files — an incomplete sync can no longer silently produce a stale release.
- Demo lazy-import map extracted into `site/demos/registry.ts` as a single source of truth; `ComponentPreview` and the builder route both consume it instead of maintaining separate import lists.
- Builder preview pared back to a thin consumer of the registry, eliminating ~40 lines of duplicated component wiring.

### Added

- `AGENTS.md` — ownership map, hard rules (never edit `@generated` files, published packages only, tag-driven releases), command reference, and step-by-step sync-and-release workflow for AI agents and contributors.
- `workflow_dispatch` trigger on the publish workflow, allowing manual publish runs from the GitHub Actions UI without pushing a tag.
- `sync:build` script chains `sync` + `types:check` + `build` for a single-command full verification pass after a CN sync.

## 0.1.27

No user-facing changes.

## 0.1.26

No user-facing changes.

## 0.1.25

No user-facing changes.

## 0.1.24

No user-facing changes.

## 0.1.23

### Changed

- Switched publish workflow to npmjs OIDC trusted publishing with provenance. The bootstrap `NPM_TOKEN` is no longer used; `npm publish --access public --provenance` runs against the configured trusted publisher and signs an attestation visible on npmjs.

## 0.1.22

### Changed

- **Migrated from GitHub Packages to npmjs.** `@olwiba/docs` now publishes to the public npm registry. Bootstrap release uses a temporary scoped npm token; subsequent releases will switch to OIDC trusted publishing with provenance.
- Bumped `@olwiba/cn` devDep to 0.1.15 and `@olwiba/dx` devDep to 0.0.10 (both now resolved from npmjs).
- Dropped the GitHub Packages bunfig.toml shim from the Dockerfile - all `@olwiba/*` packages resolve from public npmjs without auth.

### Added

- 7-day `minimumReleaseAge` supply-chain cooldown via tracked `bunfig.toml`.
- OSS scaffolding: LICENSE (MIT), CONTRIBUTING.md, SECURITY.md, .github issue and PR templates.
- README banner header with sponsor/license/issues badges, footer with built-by and buy-me-a-coffee links.
- Populated isometric preview manifest with 30 docs component PNGs (homepage IsometricPlane).

### Fixed

- Synced CN's per-frame `getComputedStyle` perf fix into AsciiText so the homepage canvas does not tank fps when the IsometricPlane is on screen.
- Synced CN's IsometricPlane compositor optimisations: `contain: layout paint style`, `isolation: isolate`, `backface-visibility: hidden`, `fetchPriority="low"`, `loading="lazy"`, dropped redundant `transform-gpu`.
- Synced CN's `@keyframes` hoist out of `@theme inline` so production Tailwind v4 builds actually emit them (animations were dead in prod, fine in dev).

### Removed

- Tracked `.npmrc` (stale GitHub Packages auth shim, now in `.gitignore`).
- Tracked `bash.exe.stackdump` (Windows debug noise, now in `.gitignore`).
- Unused `src/assets/dosrebel.flf` font (now bundled in `@olwiba/dx`).

## 0.1.12

### Changed

- Synced latest dev banner runtime from `olwibaCN`, including segmented color rendering, white-by-default segment colors, and responsive width fallback behavior.
- Docs dev server banner config now defines a compact fallback variant (`oDOCS`) so narrow terminals degrade cleanly before plain-text fallback.

## 0.1.10

### Fixed

- **`Sandbox` `shellPreview` frame** — Removed `contain`/isolate hacks that fought embedded layouts. Shell previews now use `p-0`, a flex column, and `min-h-0` so app chrome (e.g. `SidebarProvider` + contained sidebars) fills the preview height instead of sizing to the browser viewport.

## 0.1.9

### Fixed

- `ActiveThemeProvider` now keeps the docs theme selection in `sessionStorage` instead of a long-lived cookie, and clears the legacy `active_theme` cookie when no explicit initial theme is provided.

## 0.1.8

### Added

- `Sandbox` now supports `shellPreview` for application-shell and sidebar-heavy examples that need a taller, internally scrollable preview surface.
- Added `Sandbox` component docs page content to the docs package site.

### Fixed

- `scripts/sync-from-cn.ts` now resolves the Nexus sibling-repo layout first, with fallback to the legacy workspace paths, so the CN -> DOCS sync flow works in the new ecosystem setup.

## 0.1.7

### Added

- **Consumer Sandbox registry API** for reusable docs integration across projects:
  - `registerSandboxes(...)`
  - `getSandboxDefinition(...)`
  - `SandboxDefinition` and `SandboxRegistryInput` types
- `Sandbox` now resolves definitions through registry lookups, allowing consumers (for example `olwibaUI`) to provide their own sandbox IDs and multi-file examples without forking the component.

## 0.1.6

### Added

- **`Sandbox`** — new interactive MDX component for complex examples with:
  - preview/code mode toggle
  - folder-based, collapsible file tree
  - resizable/collapsible file sidebar
  - desktop/tablet/mobile/custom viewport controls
  - expandable modal view with ESC-to-close and overlay click close
  - per-file copy action in the code header
  - syntax-highlighted code with line numbers
- **`sandbox-registry`** and demo assets for registry-driven multi-file sandbox examples.
- `Sandbox` is now included in default `mdxComponents` and exported from package root.

### Changed

- **Sync infrastructure** (`scripts/sync-from-cn.ts`) now includes Sandbox-related files and demo assets from `olwibaCN`.
- **Code styling** (`src/styles/docs.css`) now includes line-number gutter and empty-line handling for code blocks using line numbers.

## 0.1.5

### Fixed

- **`SearchDialog`** — ESC button no longer renders as an empty element on mobile; the entire close button is now hidden on small screens instead of just the text label.
- **`CopyButton`** — copy tick icon now uses the theme primary color instead of hardcoded green.
- **`CopyCommandButton`** — copy tick icon now uses the theme primary color.
- **`DocsCopyPage`** — simplified to a single `DropdownMenu` for all screen sizes, replacing the split desktop `DropdownMenu` / mobile `Popover` approach. Consistent appearance across breakpoints.
- **`DocsLayout`** — Copy Page button correctly positioned below the title row on mobile (left-aligned), separate from the desktop right-column placement.
- **`DocsSidebar`** — folder group labels now render as links when the folder has an index page, making category index pages reachable from the sidebar.
- **`DocsMobileNav`** — folder group titles now render as links with active state when the folder has an index page.

## 0.1.3

### Added

- **Builder** — visual drag-and-drop component composer at `/builder`. Browse all `@olwiba/docs` components, click or drag them into a canvas, reorder and remove blocks, then copy the generated imports and JSX. Canvas state persists to `localStorage`.
- **Builder docs page** (`/docs/builder`) — explains how the Builder works and links to the tool.
- **Status Pages docs page** (`/docs/status`) — documents the built-in 404 page and how to override it with a custom `notFoundComponent`.
- **`DocsNotFound`** — exported component rendering the default AsciiText 404 page. Can be used directly as `notFoundComponent` on specific routes.
- **`createDocsRouter`** — new factory that wraps TanStack Router's `createRouter` with `defaultNotFoundComponent: DocsNotFound` pre-configured, so loader-thrown `notFound()` errors render the styled 404 page automatically.

### Fixed

- Default 404 page upgraded from a plain `<h1>` to the `AsciiText`-based styled page, consistent with the homepage aesthetic.
- Sidebar no longer renders non-folder page-tree items (e.g. "Getting Started", "Themes") as phantom non-clickable section headers. Only folder nodes (i.e. the Components tree) are rendered from the tree.
- Removed the "Sections" label from the sidebar nav group — section buttons now render without a heading for a cleaner look.

### Changed

- Builder button removed from the homepage hero — the Builder is discoverable via the header nav and docs.
- Sidebar section buttons updated to include Builder and Status alongside Get Started, Components, and Themes.

## 0.1.2

### Added

- GitHub publish workflow (`.github/workflows/publish-package.yml`) to publish to GitHub Packages and attach `.tgz` package artifacts to workflow runs/releases.
- Explicit type export mappings for root and subpath exports (`./source`, `./mdx`, `./server`, `./themes`).

### Fixed

- Package type declarations are now emitted (`tsup dts: true`) and published.
- Declaration build now includes Node typings for server utilities.
- `createDocsRoot` not-found component typing aligned with TanStack route typing.

## 0.1.1

### Added

- **`DocsFooter`** — accepts optional `changelogUrl` prop; renders a changelog link in the bottom-right when provided. URL is no longer hardcoded, so each consumer can point to their own repo.

## 0.1.0

### Added

- **Theme system** — `ActiveThemeProvider`, `useThemeConfig`, `ThemeSelector`, `ThemeCodeBlock`
  - 7 built-in themes: Default, Emerald, Blue, Purple, Rose, Orange, Slate
  - Cookie-based persistence (`active_theme`), synced from olwibaCN
  - `themes`, `Theme`, `getThemeStyles`, `getThemeCode` utilities exported
- **`DocsLayout`** — full page layout component combining sidebar, TOC, header, footer, and mobile nav in one import
- **`DocsHeader`** / **`DocsFooter`** — page-level heading and footer components
- **`DocsMobileNav`** — mobile navigation drawer
- **`DocsCopyPage`** — copies the full page content as markdown
- **`CodeFence`** — syntax-highlighted code block with copy button
- **`CopyCommandButton`** — pre-styled copy button for shell commands
- **`APIReference`** — structured API documentation component
- **`createDocsRoot(config)`** factory — moves the shared layout shell (blueprint columns, `ActiveThemeProvider`, `RootProvider`, `SearchDialog` wiring, `Scripts`, `HeadContent`) into the package so layout fixes propagate to all consumers via `bun update`
  - Accepts `meta`, `favicons`, `header`, `footer`, `initialTheme`, `cssUrl`, and optional `notFoundComponent`
  - Exports `DocsRootConfig`, `DocsRootMeta`, `DocsRootFavicon` types
  - Includes a default 404 component

### Fixed

- Search results are now custom-ranked: page titles > headings > body text, core docs > component pages — previously fumadocs default ordering was used
- `DocsToc` overhauled — improved active heading tracking and scroll behaviour
- `DocsSidebar` — layout and active state fixes
- Vite alias maps `@olwiba/docs` → `./src/index.ts` so the demo site resolves the package from local source without requiring a prior dist build

### Changed

- `PageTree` re-export replaced with granular types: `PageTreeRoot`, `PageTreeNode`, `PageTreeItem`, `PageTreeFolder`, `PageTreeSeparator`

## 0.0.4

### Fixed

- `createServer` now uses absolute paths via `process.cwd()` - works correctly when imported from node_modules

## 0.0.3

### Added

- `createServer` export (`@olwiba/docs/server`) - Production server for TanStack Start apps
  - Uses Hono to serve static assets from `dist/client`
  - Routes SSR/server functions to TanStack Start handler
  - Configurable port and static patterns
- Deployment documentation in README

### Changed

- Updated `start` script to use new server.ts with Hono
- Dockerfile now copies server.ts for production

## 0.0.2

### Added

- `DocsProvider` component - wraps fumadocs RootProvider with pre-configured SearchDialog
  - Accepts `searchItems` prop for quick links in search dialog
  - Simplifies setup for consuming apps (single import vs manual RootProvider + SearchDialog wiring)

### Changed

- Site now uses `DocsProvider` internally (dogfooding)

## 0.0.1

### Added

- Initial release
- Core components: `DocsSidebar`, `DocsToc`, `SearchDialog`, `SearchButton`, `ModeSwitcher`, `Callout`, `CopyButton`
- MDX components and utilities
- Source loader utilities for fumadocs integration
