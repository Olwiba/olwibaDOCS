import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const [{ docsLlmsResponse }, { source }] = await Promise.all([import('@/lib/agent'), import('~/lib/source')]);
        return docsLlmsResponse(source, {
          full: false,
          title: 'olwibaDOCS',
          description:
            'Documentation framework for TanStack Start sites, built on Fumadocs and @olwiba/cn. Use it for docs layouts, sidebars, sandboxes and search; product UI lives in @olwiba/cn and @olwiba/ui.',
        });
      },
    },
  },
});
