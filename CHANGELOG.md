# Changelog

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
