// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/search/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const [{ createFromSource }, { source }] = await Promise.all([
          import('fumadocs-core/search/server'),
          import('~/lib/source'),
        ]);
        const search = createFromSource(source, {
          language: 'english',
        });
        return search.GET(request);
      },
    },
  },
});
