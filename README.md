# @olwiba/docs

> Documentation layouts, search, MDX helpers, and TanStack Start docs utilities built on `@olwiba/cn`.

## What This Is

`@olwiba/docs` is the published docs-shell package in the Nexus ecosystem.

Use it for:
- docs layouts and navigation
- search UI and docs page chrome
- MDX component mappings and sandbox helpers
- TanStack Start docs-site setup utilities
- shared docs theming and development helpers

Consumers should import shared docs-shell primitives from `@olwiba/docs`, not from `@olwiba/cn`.

## Package Chain

```text
@olwiba/cn   -> shared primitives and low-level UI building blocks
@olwiba/docs -> published docs shell, search, and MDX utilities
@olwiba/ui   -> app-level shells and higher-level product UI
```

Canonical docs-shell flow:
- shared docs behavior starts in `olwibaCN/src/components/docs/*`
- `olwibaDOCS` syncs and publishes the consumer-facing docs contract
- downstream repos import docs shell components from `@olwiba/docs`

## Installation

```bash
bun add @olwiba/docs @olwiba/cn
```

Peer dependencies:
- `@olwiba/cn`
- `@tanstack/react-router`
- `react`
- `react-dom`

For MDX processing you will typically also need:

```bash
bun add fumadocs-mdx rehype-pretty-code shiki
```

Import the package stylesheet in your app CSS:

```css
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
@import '@olwiba/docs/styles';
```

## Recommended Consumption Paths

### Root package exports

Import these from `@olwiba/docs`:
- `DocsProvider`
- `DocsLayout`
- `DocsHeader`
- `DocsFooter`
- `DocsSidebar`
- `DocsMobileNav`
- `DocsToc`
- `DocsCopyPage`
- `SearchButton`
- `SearchDialog`
- `CopyButton`
- `CopyCommandButton`
- `Callout`
- `CodeFence`
- `APIReference`
- `Sandbox`
- `registerSandboxes`
- `createDocsRoot`
- `createDocsRouter`
- `DocsNotFound`
- `ActiveThemeProvider`
- `ThemeSelector`
- `ThemeCodeBlock`
- `UIModeDropdown`
- `themes`
- `Theme`
- `getThemeStyles`
- `getThemeCode`
- `useCopyToClipboard`

### Subpath exports

Use subpaths when the import intent should be explicit:
- `@olwiba/docs/source` -> `createSource`, `loader`, `lucideIconsPlugin`
- `@olwiba/docs/mdx` -> `mdxComponents`
- `@olwiba/docs/server` -> `createServer`
- `@olwiba/docs/themes` -> theme helpers
- `@olwiba/docs/dev-banner` -> `createDevBannerPlugin`, `printBanner`

## Quick Start

### 1. Create the source loader

```ts
import { docs } from 'fumadocs-mdx:collections/server';
import { createSource } from '@olwiba/docs/source';

export const source = createSource({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
});
```

### 2. Provide docs search at the app root

```tsx
import { DocsProvider } from '@olwiba/docs';

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DocsProvider
          searchItems={[
            { label: 'Components', href: '/docs/components' },
          ]}
        >
          {children}
        </DocsProvider>
      </body>
    </html>
  );
}
```

### 3. Render a docs page shell

```tsx
import { Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import browserCollections from 'fumadocs-mdx:collections/browser';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import {
  DocsLayout,
  mdxComponents,
} from '@olwiba/docs';

export const Route = createFileRoute('/docs/$')({
  component: Page,
});

const clientLoader = browserCollections.docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <MDX components={{ ...defaultMdxComponents, ...mdxComponents }} />
    );
  },
});

function Page() {
  const loaderData = Route.useLoaderData();
  const data = useFumadocsLoader(loaderData);

  return (
    <DocsLayout
      loaderData={loaderData}
      pageTree={data.pageTree}
      sections={[{ name: 'Get Started', href: '/docs' }]}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {clientLoader.useContent(data.path, {})}
      </Suspense>
    </DocsLayout>
  );
}
```

### 4. Optional: use the packaged production server helper

```ts
import { createServer } from '@olwiba/docs/server';

export default createServer();
```

`createServer` wraps the TanStack Start SSR handler with a Hono static-file server for `dist/client`.

## Export Surface

### Docs shell components

- `DocsProvider`
- `DocsLayout`
- `DocsHeader`
- `DocsFooter`
- `DocsSidebar`
- `DocsMobileNav`
- `DocsToc`
- `DocsCopyPage`
- `SearchButton`
- `SearchDialog`
- `CopyButton`
- `CopyCommandButton`

### MDX and docs content helpers

- `Callout`
- `CodeFence`
- `APIReference`
- `Sandbox`
- `registerSandboxes`
- `getSandboxDefinition`
- `mdxComponents`

### App/root integration helpers

- `createDocsRoot`
- `createDocsRouter`
- `DocsNotFound`
- `createSource`
- `createServer`

### Theme and mode helpers

- `ActiveThemeProvider`
- `useThemeConfig`
- `ThemeSelector`
- `ThemeCodeBlock`
- `UIModeDropdown`
- `themes`
- `Theme`
- `getThemeStyles`
- `getThemeCode`
- `getUIMode`
- `setUIMode`
- `subscribeUIMode`

## MDX Components

Import the pre-configured MDX component map from `@olwiba/docs/mdx`:

```tsx
import { mdxComponents } from '@olwiba/docs/mdx';
import defaultMdxComponents from 'fumadocs-ui/mdx';

<MDX components={{ ...defaultMdxComponents, ...mdxComponents }} />
```

The mapping includes:
- headings, links, lists, tables, and code fences
- `Callout`
- `APIReference`
- `ThemeSelector`
- `ThemeCodeBlock`
- `Sandbox`
- tabs and accordion components from `@olwiba/cn`

## Sandbox Registry

Register project-specific sandbox examples once, then reference them in MDX with `<Sandbox id="..." />`:

```tsx
import { registerSandboxes, type SandboxDefinition } from '@olwiba/docs';

registerSandboxes({
  'my-block': {
    id: 'my-block',
    title: 'My Block',
    files: [{ path: 'app/page.tsx', language: 'tsx', code: '...' }],
    preview: React.lazy(() => import('~/demos/my-block')),
  } satisfies SandboxDefinition,
});
```

## Development

```bash
bun install
bun run dev
bun run web:dev
bun run build
```

What each command does:
- `bun run dev` -> watches the published package build with `tsup`
- `bun run web:dev` -> starts the local docs site on port `3001`
- `bun run build` -> builds the package for publishing

## Development Sync Flow

`olwibaCN` is the source of truth for shared docs UI building blocks.

When docs components are added or changed in `olwibaCN`, sync them into `olwibaDOCS`:

```bash
bun run sync
```

This runs `scripts/sync-from-cn.ts`, which copies files defined in `SYNC_MAP` and rewrites imports for this repo layout. If you add new synced components, update `SYNC_MAP` in the script first.

In the Nexus workspace, the sync script resolves the sibling `olwibaCN` repository automatically. It still falls back to the legacy `C:\Workspace\...` layout for older setups.

## Release Flow

`@olwiba/docs` releases are tag-driven.

1. Make and verify the upstream docs changes.
2. If the change began in `olwibaCN`, run `bun run sync` here after CN validation.
3. Update `CHANGELOG.md` and bump `package.json`.
4. Commit and push `master`.
5. Create a matching version tag, for example `v0.1.8`.
6. Push the tag: `git push origin v0.1.8`.

The `publish-package` GitHub Actions workflow runs automatically on `v*` tags and checks that the tag matches the package version before publishing. `workflow_dispatch` remains available as a manual fallback.

If the `DISCORD_WEBHOOK_URL` GitHub Actions secret is configured, the publish workflow also sends a Discord notification on both success and failure.

## Related

- [@olwiba/cn](https://github.com/Olwiba/olwibaCN) - Source-of-truth primitive layer
- [@olwiba/ui](https://github.com/Olwiba/olwibaUI) - App-level package that consumes `@olwiba/docs` where docs shell behavior is needed

## License

MIT
