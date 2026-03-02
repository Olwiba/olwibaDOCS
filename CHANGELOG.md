# Changelog

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

