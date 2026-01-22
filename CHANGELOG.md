# Changelog

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
