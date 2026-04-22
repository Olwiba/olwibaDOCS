import { createRouter } from '@tanstack/react-router';
import { DocsNotFound } from './root';

// routeTree typed as any — consumers register their router type via the
// `Register` interface in their router file, which is where TanStack Router's
// type safety lives. This avoids unsatisfiable RouterContextOptions generics.
export function createDocsRouter(routeTree: any) {
  return createRouter({
    routeTree,
    defaultPreload: 'intent' as const,
    scrollRestoration: true,
    defaultNotFoundComponent: DocsNotFound,
  });
}
