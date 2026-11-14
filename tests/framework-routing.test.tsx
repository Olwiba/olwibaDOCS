import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { DocsProvider, DocsLayout, DocsCard, type DocsLayoutProps } from '../src/react-router';
import { DocsProvider as TanStackDocsProvider } from '../src/components/DocsProvider';
import type { Root } from 'fumadocs-core/page-tree';

const tree: Root = { name: 'Kitchen sink', children: [{ type: 'page', name: 'Button', url: '/sink/button' }] };
const page: DocsLayoutProps['loaderData'] = {
  path: 'button', url: '/sink/button', frontmatter: { title: 'Button', description: 'Real product components' },
  rawContent: '# Button', toc: [], neighbours: { previous: null, next: { name: 'Input', url: '/sink/input' } },
};
const content = <DocsLayout loaderData={page} pageTree={tree} sections={[{ name: 'Overview', href: '/sink' }]}>
  <DocsCard title="Input" href="/sink/input" description="Try a real input" />
</DocsLayout>;

describe('docs framework compatibility', () => {
  it('renders the canonical shell and links within a React Router data router', () => {
    const router = createMemoryRouter([{ path: '*', element: <DocsProvider searchEnabled={false} theme={{ enabled: false }}>{content}</DocsProvider> }], { initialEntries: ['/sink/button'] });
    const html = renderToString(<RouterProvider router={router} />);
    expect(html).toContain('Real product components');
    expect(html).toContain('href="/sink/input"');
    expect(html).toContain('data-docs-variant="technical"');
    expect(html).not.toContain('next-themes');
  });

  it('preserves TanStack consumers through the existing provider and shared shell', async () => {
    const route = createRootRoute({ component: () => <TanStackDocsProvider searchEnabled={false} theme={{ enabled: false }}>{content}</TanStackDocsProvider> });
    const router = createRouter({ routeTree: route, history: createMemoryHistory({ initialEntries: ['/'] }) });
    await router.load();
    const html = renderToString(<TanStackRouterProvider router={router} />);
    expect(html).toContain('Real product components');
    expect(html).toContain('href="/sink/input"');
  });
});
