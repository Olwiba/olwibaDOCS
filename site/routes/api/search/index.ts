// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import { createFileRoute } from '@tanstack/react-router';
import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '~/lib/source';

const search = createFromSource(source, {
  language: 'english',
});

type SearchResult = {
  type: string;
  url: string;
} & Record<string, unknown>;

function getCategoryRank(url: string): number {
  // Core docs pages (e.g. /docs, /docs/themes) rank highest
  if (!url.includes('/components/')) return 0;
  // Component pages rank second
  return 1;
}

function getTypeRank(type: string): number {
  if (type === 'page') return 0;
  if (type === 'heading') return 1;
  return 2; // text / content matches
}

function rankResults<T extends SearchResult>(results: T[]): T[] {
  return results.sort((a, b) => {
    const typeA = getTypeRank(a.type);
    const typeB = getTypeRank(b.type);
    if (typeA !== typeB) return typeA - typeB;

    const catA = getCategoryRank(a.url);
    const catB = getCategoryRank(b.url);
    return catA - catB;
  });
}

export const Route = createFileRoute('/api/search/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const response = await search.GET(request);
        const results = (await response.json()) as SearchResult[];
        return Response.json(rankResults(results));
      },
    },
  },
});
