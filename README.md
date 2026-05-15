<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="./public/olwibaDOCS--light.gif" />
    <source media="(prefers-color-scheme: dark)" srcset="./public/olwibaDOCS.gif" />
    <img src="./public/olwibaDOCS.gif" alt="olwibaDOCS" style="width: 100%;" />
  </picture>
</p>

<p align="center">
  <strong>Docs shell for the Olwiba ecosystem.</strong>
</p>

<p align="center">
  <a href="https://docs.olwiba.com">Documentation</a>
</p>

<p align="center">
  <a href="https://github.com/Olwiba/olwibaDOCS/issues/new?template=bug_report.md">🪲 Report a bug</a> ·
  <a href="https://github.com/Olwiba/olwibaDOCS/issues/new?template=feature_request.md">✨ Feature request</a>
</p>

<p align="center">
  <a href="https://github.com/sponsors/Olwiba"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=22c55e" alt="Sponsor" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Olwiba/olwibaDOCS?label=license&logo=github" alt="License" /></a>
  <a href="https://github.com/Olwiba/olwibaDOCS/issues"><img src="https://img.shields.io/github/issues/Olwiba/olwibaDOCS" alt="Issues" /></a>
</p>

## What This Is

`@olwiba/docs` is the published docs-shell package in the Nexus ecosystem.

It provides layout, navigation, search, MDX components, theming, and TanStack Start integration utilities for building docs sites.

Consumers should import shared docs-shell primitives from `@olwiba/docs`, not from `@olwiba/cn`.

## Package Chain

```text
@olwiba/cn   -> shared primitives and low-level UI building blocks
@olwiba/docs -> published docs shell, search, and MDX utilities
@olwiba/ui   -> app-level shells and higher-level product UI
```

## Installation

```bash
bun add @olwiba/docs @olwiba/cn
```

Peer dependencies: `@olwiba/cn`, `@tanstack/react-router`, `react`, `react-dom`

```css
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
@import '@olwiba/docs/styles';
```

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
        <DocsProvider searchItems={[{ label: 'Components', href: '/docs/components' }]}>
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
import { DocsLayout, mdxComponents } from '@olwiba/docs';

export const Route = createFileRoute('/docs/$')({ component: Page });

const clientLoader = browserCollections.docs.createClientLoader({
  component({ default: MDX }) {
    return <MDX components={{ ...defaultMdxComponents, ...mdxComponents }} />;
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

### 4. Optional: production server helper

```ts
import { createServer } from '@olwiba/docs/server';

export default createServer();
```

`createServer` wraps the TanStack Start SSR handler with a Hono static-file server for `dist/client`.

## What's Included

**Docs shell** Layout, header, footer, sidebar, TOC, and mobile nav  
**Search** Dialog, button, and search integration  
**MDX** Component map, code fences, callouts, and API reference  
**Sandbox** Interactive code playground with `<Sandbox id="..." />` in MDX  
**Themes** Active theme provider, selectors, and UI mode helpers  
**Server** TanStack Start SSR + static file server helper  

## Subpath Exports

- `@olwiba/docs/source` — `createSource`, `loader`, `lucideIconsPlugin`
- `@olwiba/docs/mdx` — `mdxComponents`
- `@olwiba/docs/server` — `createServer`
- `@olwiba/docs/themes` — theme helpers
- `@olwiba/docs/dev-banner` — `createDevBannerPlugin`, `printBanner`

## Ecosystem

- [@olwiba/cn](https://github.com/Olwiba/olwibaCN) — primitive layer, source of truth for shared docs UI
- [@olwiba/ui](https://github.com/Olwiba/olwibaUI) — app-level shells

## Contributing

Bug reports, pull requests & feature requests are welcome.
Open an issue first for anything beyond a small fix.

<br/>
<br/>

<p align="center">
  Built with 💖 by <a href="https://github.com/Olwiba">Olwiba</a>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/olwiba"><img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black" alt="Buy Me A Coffee" /></a>
</p>
