import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import type { SearchDialogBrowsePage } from '@olwiba/docs';

// Source is only reachable through a dynamic import inside createServerOnlyFn,
// keeping the fumadocs server runtime (node:path) out of the client bundle.
const loadBrowsePages = createServerOnlyFn(async (): Promise<SearchDialogBrowsePage[]> => {
  const { source } = await import('~/lib/source');
  return source.getPages().map((page) => ({
    title: page.data.title,
    description: page.data.description,
    url: page.url,
  }));
});

export const getBrowsePages = createServerFn({ method: 'GET' }).handler(async () =>
  loadBrowsePages(),
);
