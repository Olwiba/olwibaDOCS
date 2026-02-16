import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { source } from '~/lib/source';
import browserCollections from 'fumadocs-mdx:collections/browser';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import * as React from 'react';
import { Suspense } from 'react';
import { mdxComponents } from '@/lib/mdx-components';
import { DocsSidebar, type SidebarSection } from '@/components/DocsSidebar';
import { DocsMobileNav } from '@/components/DocsMobileNav';
import { DocsToc, type TocItem } from '@/components/DocsToc';
import { DocsCopyPage } from '@/components/DocsCopyPage';
import { SidebarProvider, Button } from '@olwiba/cn';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { findNeighbour } from 'fumadocs-core/page-tree';
import type { SerializedPageTree } from 'fumadocs-core/source/client';

interface PageLoaderData {
  path: string;
  url: string;
  pageTree: SerializedPageTree;
  frontmatter: {
    title: string;
    description: string | undefined;
  };
  toc: TocItem[];
  rawContent: string;
  neighbours: {
    previous: { url: string; name: string } | null;
    next: { url: string; name: string } | null;
  };
}

const sidebarSections: SidebarSection[] = [
  { name: 'Get Started', href: '/docs' },
  { name: 'Components', href: '/docs/components' },
  { name: 'Themes', href: '/docs/themes' },
];

function extractTextFromReactNode(node: React.ReactNode): string {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join('');
  if (typeof node === 'object' && 'props' in node) {
    const el = node as React.ReactElement & { props: { children?: React.ReactNode } };
    return extractTextFromReactNode(el.props.children);
  }
  return '';
}

export const Route = createFileRoute('/docs/$')({
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
    <div className="flex flex-1 flex-col px-2">
      <SidebarProvider className="min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:1.5rem] lg:[--sidebar-width:240px] lg:[--top-spacing:2rem]">
        <DocsSidebar tree={data.pageTree} sections={sidebarSections} />
        <div className="hidden lg:block w-4 self-stretch border-x border-dashed blueprint-pattern" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <DocsMobileNav tree={data.pageTree} sections={sidebarSections} />
          <div className="flex items-stretch xl:w-full">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="h-[var(--top-spacing)] shrink-0" />
              <div className="flex w-full min-w-0 max-w-2xl flex-1 flex-col gap-8 px-4 pb-6 text-neutral-800 md:px-6 lg:pb-8 dark:text-neutral-300">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h1 className="scroll-m-20 font-semibold text-4xl tracking-tight sm:text-3xl xl:text-4xl">
                      {loaderData.frontmatter.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <DocsCopyPage
                        page={loaderData.rawContent}
                        url={typeof window !== 'undefined' ? window.location.href : loaderData.url}
                      />
                      {loaderData.neighbours.previous && (
                        <Button asChild size="icon" variant="secondary" className="size-8">
                          <Link to={loaderData.neighbours.previous.url}>
                            <ArrowLeft className="size-4" />
                            <span className="sr-only">Previous</span>
                          </Link>
                        </Button>
                      )}
                      {loaderData.neighbours.next && (
                        <Button asChild size="icon" variant="secondary" className="size-8">
                          <Link to={loaderData.neighbours.next.url}>
                            <ArrowRight className="size-4" />
                            <span className="sr-only">Next</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  {loaderData.frontmatter.description && (
                    <p className="text-balance text-muted-foreground">
                      {loaderData.frontmatter.description}
                    </p>
                  )}
                </div>
                {loaderData.toc?.length > 0 && (
                  <div className="xl:hidden">
                    <DocsToc toc={loaderData.toc} variant="dropdown" />
                  </div>
                )}
                <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
                  {clientLoader.useContent(data.path, undefined)}
                </Suspense>
              </div>
              <div className="hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-6">
                {loaderData.neighbours.previous && (
                  <Button asChild size="sm" variant="secondary">
                    <Link to={loaderData.neighbours.previous.url}>
                      <ArrowLeft className="size-4" /> {loaderData.neighbours.previous.name}
                    </Link>
                  </Button>
                )}
                {loaderData.neighbours.next && (
                  <Button asChild size="sm" variant="secondary" className="ml-auto">
                    <Link to={loaderData.neighbours.next.url}>
                      {loaderData.neighbours.next.name} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {loaderData.toc?.length > 0 && (
              <>
              <div className="hidden xl:block w-4 self-stretch border-x border-dashed blueprint-pattern" aria-hidden="true" />
              <div className="hidden w-72 shrink-0 flex-col pb-4 lg:pb-6 xl:flex">
                <div className="h-[var(--top-spacing)] shrink-0" />
                <div className="sticky top-[calc(var(--header-height)+13px)] z-30 max-h-[calc(100svh-var(--header-height)-1px)] overflow-hidden overscroll-none">
                  <div className="no-scrollbar overflow-y-auto px-8 pb-2">
                    <DocsToc toc={loaderData.toc} />
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
