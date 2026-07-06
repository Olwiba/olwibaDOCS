import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import type { ReactElement, ReactNode } from 'react';
import type { TocItem } from '@/components/DocsToc';

function extractTextFromReactNode(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join('');
  if (typeof node === 'object' && 'props' in node) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return extractTextFromReactNode(element.props.children);
  }
  return '';
}

// Keep fumadocs' server runtime out of the client bundle: the source module is
// only reachable through dynamic imports inside createServerOnlyFn, so the
// Start compiler can strip it from the browser build (it pulls in node:path,
// which is undefined in the browser). Same pattern as olwibaCN docs/-loader.ts.
const loadDocsData = createServerOnlyFn(async (slugs: string[]) => {
  const [{ notFound }, { findNeighbour }, { source }] = await Promise.all([
    import('@tanstack/react-router'),
    import('fumadocs-core/page-tree'),
    import('~/lib/source'),
  ]);

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
    toc: (page.data.toc ?? []).map((item: { title?: ReactNode; url: string; depth: number }) => ({
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

export const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => loadDocsData(slugs));
