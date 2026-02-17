# Changelog

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
