import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ErrorPage } from '@/components/ErrorPage';

function DocsNotFound() {
  return (
    <div className="flex flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] items-center justify-center p-6">
      <ErrorPage
        renderLink={({ href, children }) => <Link to={href}>{children}</Link>}
        backAction={{ label: 'Go back', onClick: () => window.history.back() }}
      />
    </div>
  );
}
import { createServerFn } from '@tanstack/react-start';
import { source } from '~/lib/source';
import browserCollections from 'fumadocs-mdx:collections/browser';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import * as React from 'react';
import { Suspense } from 'react';
import { mdxComponents } from '@/lib/mdx-components';
import { ComponentPreview } from '~/components/ComponentPreview';
import { CopyCommandButton } from '@/components/CopyCommandButton';
import { type TocItem } from '@/components/DocsToc';
import { type SidebarSection } from '@/components/DocsSidebar';
import { DocsLayout, extractTextFromReactNode, type PageLoaderData } from '@/components/DocsLayout';
import { findNeighbour } from 'fumadocs-core/page-tree';

const sidebarSections: SidebarSection[] = [
  { name: 'Get Started', href: '/docs' },
  { name: 'Builder', href: '/docs/builder' },
  { name: 'Themes', href: '/docs/themes' },
  { name: 'Status', href: '/docs/status' },
  { name: 'Components', href: '/docs/components', enchanted: true },
];

export const Route = createFileRoute('/docs/$')({
  notFoundComponent: DocsNotFound,
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = (await serverLoader({ data: slugs })) as PageLoaderData;
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    const pageTree = source.getPageTree();
    const neighbours = findNeighbour(pageTree, page.url);
    const rawContent = await page.data.getText('raw');

    return {
      path: page.path,
      url: page.url,
      pageTree: await source.serializePageTree(pageTree),
      frontmatter: {
        title: page.data.title,
        description: page.data.description,
      },
      toc: (page.data.toc ?? []).map((item: { title?: React.ReactNode; url: string; depth: number }) => ({
        title: extractTextFromReactNode(item.title),
        url: item.url,
        depth: item.depth,
      })) as TocItem[],
      rawContent,
      neighbours: {
        previous: neighbours.previous ? { url: neighbours.previous.url, name: extractTextFromReactNode(neighbours.previous.name) } : null,
        next: neighbours.next ? { url: neighbours.next.url, name: extractTextFromReactNode(neighbours.next.name) } : null,
      },
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <div className="w-full flex-1">
        <MDX
          components={{
            ...defaultMdxComponents,
            ...mdxComponents,
            ComponentPreview,
            CopyCommandButton,
          }}
        />
      </div>
    );
  },
});

function Page() {
  const loaderData = Route.useLoaderData() as PageLoaderData;
  const data = useFumadocsLoader(loaderData);

  return (
    <DocsLayout loaderData={loaderData} pageTree={data.pageTree} sections={sidebarSections}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        {clientLoader.useContent(data.path, undefined)}
      </Suspense>
    </DocsLayout>
  );
}
