# olwibaDOCS

> Olwiba's take on Fumadocs - A documentation framework abstraction for TanStack Start.

Part of the [Genesis ecosystem](https://github.com/Olwiba/genesis).

## Installation

```bash
# Using bun (recommended)
bun add @olwiba/docs

# Using npm
npm install @olwiba/docs
```

### Peer Dependencies

This package requires:

- `@olwiba/cn` - UI primitives (Button, Alert, Tabs, etc.)
- `@tanstack/react-router` - Routing
- `react` & `react-dom`

Additionally, for MDX processing you'll need:

```bash
bun add fumadocs-mdx rehype-pretty-code shiki
```

## Quick Start

### 1. Configure Fumadocs MDX

Create `source.config.ts` in your project root:

```ts
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import rehypePrettyCode from 'rehype-pretty-code';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light-default',
          },
        },
      ]);
      return plugins;
    },
  },
});
```

### 2. Create Source Loader

Create `src/lib/source.ts`:

```ts
import { docs } from 'fumadocs-mdx:collections/server';
import { createSource } from '@olwiba/docs/source';

export const source = createSource({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
});
```

### 3. Create Search API Route

Create `src/routes/api/search/index.ts`:

```ts
import { createFileRoute } from '@tanstack/react-router';
import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

const search = createFromSource(source, {
  language: 'english',
});

export const Route = createFileRoute('/api/search/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return search.GET(request);
      },
    },
  },
});
```

### 4. Set Up Root Layout

```tsx
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { SearchDialog } from '@olwiba/docs';

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider
          search={{
            SearchDialog: (props) => (
              <SearchDialog
                quickLinks={[
                  { label: 'Components', href: '/docs/components' },
                ]}
                {...props}
              />
            ),
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
```

### 5. Create Docs Route

Create `src/routes/docs/$.tsx`:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { source } from '@/lib/source';
import browserCollections from 'fumadocs-mdx:collections/browser';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import {
  DocsSidebar,
  DocsToc,
  mdxComponents,
  type TocItem,
} from '@olwiba/docs';
import { SidebarProvider } from '@olwiba/cn';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      pageTree: await source.serializePageTree(source.getPageTree()),
      frontmatter: {
        title: page.data.title,
        description: page.data.description,
      },
      toc: page.data.toc as TocItem[],
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <MDX
        components={{
          ...defaultMdxComponents,
          ...mdxComponents,
        }}
      />
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());
  const loaderData = Route.useLoaderData();

  return (
    <SidebarProvider>
      <DocsSidebar
        tree={data.pageTree}
        sections={[
          { name: 'Get Started', href: '/docs' },
          { name: 'Components', href: '/docs/components' },
        ]}
      />
      <main>
        <h1>{loaderData.frontmatter.title}</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {clientLoader.useContent(data.path, {})}
        </Suspense>
      </main>
      <DocsToc toc={loaderData.toc} />
    </SidebarProvider>
  );
}
```

### 6. Import Styles

In your main CSS file:

```css
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
@import '@olwiba/docs/dist/styles/docs.css';
```

## Components

### DocsSidebar

Navigation sidebar for documentation pages.

```tsx
import { DocsSidebar } from '@olwiba/docs';

<DocsSidebar
  tree={pageTree}
  sections={[
    { name: 'Get Started', href: '/docs' },
    { name: 'Components', href: '/docs/components' },
  ]}
  baseUrl="/docs"
/>
```

### DocsToc

Table of contents with scroll tracking.

```tsx
import { DocsToc } from '@olwiba/docs';

// List variant (sidebar)
<DocsToc toc={toc} variant="list" />

// Dropdown variant (mobile)
<DocsToc toc={toc} variant="dropdown" />
```

### SearchButton

Trigger button for the search dialog.

```tsx
import { SearchButton } from '@olwiba/docs';

<SearchButton
  placeholder="Search documentation..."
  shortPlaceholder="Search..."
/>
```

### SearchDialog

Full search dialog with Fumadocs integration.

```tsx
import { SearchDialog } from '@olwiba/docs';

<SearchDialog
  quickLinks={[
    { label: 'Components', href: '/docs/components' },
  ]}
/>
```

### Callout

Styled callout/admonition component.

```tsx
import { Callout } from '@olwiba/docs';

<Callout title="Note" variant="info">
  This is an informational callout.
</Callout>
```

### ModeSwitcher

Dark/light mode toggle.

```tsx
import { ModeSwitcher } from '@olwiba/docs';

<ModeSwitcher defaultTheme="dark" />
```

### CopyButton

Copy-to-clipboard button for code blocks.

```tsx
import { CopyButton } from '@olwiba/docs';

<CopyButton text={codeString} />
```

## MDX Components

Import the pre-configured MDX components:

```tsx
import { mdxComponents } from '@olwiba/docs/mdx';
import defaultMdxComponents from 'fumadocs-ui/mdx';

<MDX components={{ ...defaultMdxComponents, ...mdxComponents }} />
```

Includes styled versions of:
- Headings (h1-h4)
- Links
- Lists (ul, ol, li)
- Tables
- Code blocks with copy button
- Blockquotes
- Steps component
- Tabs (Tabs, TabsList, TabsTrigger, TabsContent)
- Accordion
- Alert
- Callout
- Button

## Hooks

### useCopyToClipboard

```tsx
import { useCopyToClipboard } from '@olwiba/docs';

const { copyToClipboard, isCopied } = useCopyToClipboard(2000);

await copyToClipboard('text to copy');
```

## Source Utilities

### createSource

Creates a Fumadocs source loader with olwiba defaults.

```tsx
import { createSource } from '@olwiba/docs/source';
import { docs } from 'fumadocs-mdx:collections/server';

export const source = createSource({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
});
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  TocItem,
  DocsTocProps,
  DocsSidebarProps,
  SidebarSection,
  CalloutProps,
  SearchDialogProps,
  PageTree,
} from '@olwiba/docs';
```

## Deployment

### Why Hono?

TanStack Start v1 (post-vinxi migration) compiles to `dist/server/server.js` which is a **fetch handler only** - not a standalone server. It handles SSR and server functions but doesn't serve static files (JS, CSS, images).

We use [Hono](https://hono.dev/) to:
1. Serve static assets from `dist/client/assets/`
2. Pass all other requests to TanStack Start's SSR handler

Hono was chosen because it's lightweight (~14kb), has native Bun support, and works directly with fetch-based handlers.

### Production Server

The `server.ts` file configures the production server:

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

// Serve static assets from dist/client
app.use('/assets/*', serveStatic({ root: './dist/client' }))
app.use('/favicon.ico', serveStatic({ root: './dist/client' }))

// Let TanStack Start handle everything else (SSR, server functions)
app.all('*', async (c) => {
  const handler = await import('./dist/server/server.js')
  return handler.default.fetch(c.req.raw)
})

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
}
```

### Docker

The included `Dockerfile` builds a production image using Bun:

```bash
# Build and run locally
docker build -t olwiba-docs .
docker run -p 3000:3000 olwiba-docs
```

**Build stages:**
1. **deps** - Installs dependencies with private registry access
2. **builder** - Runs `web:build` (fumadocs-mdx + vite build)
3. **runner** - Production image with `dist/`, `server.ts`, and minimal deps

**Environment variables:**
- `NPM_TOKEN` - Required at build time for private `@olwiba` packages
- `PORT` - Server port (default: 3000)

For Coolify deployment, set `NPM_TOKEN` as a **Build Variable**.

## Development Sync Flow

`olwibaCN` is the source of truth for shared docs UI building blocks.

When docs components are added or changed in `olwibaCN`, sync them into `olwibaDOCS`:

```bash
bun run sync
```

This runs `scripts/sync-from-cn.ts`, which copies files defined in `SYNC_MAP` and rewrites imports for this repo layout. If you add new synced components (for example `Sandbox` files or demos), update `SYNC_MAP` in the script first.

## License

MIT
