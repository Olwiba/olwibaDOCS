import { createRouter } from '@tanstack/react-router';
import { DocsNotFound, DocsErrorFallback } from './root';

// routeTree typed as any — consumers register their router type via the
// `Register` interface in their router file, which is where TanStack Router's
// type safety lives. This avoids unsatisfiable RouterContextOptions generics.
export function createDocsRouter(routeTree: any) {
  // Every navigation opens at the top of the page, back included (DESIGN.md,
  // "Navigation scroll"). With restoration off the router scrolls to the top
  // after each render; the browser's own restoration is set to manual so it
  // cannot put the old position back on back.
  if (typeof window !== 'undefined') window.history.scrollRestoration = 'manual';

  return createRouter({
    routeTree,
    defaultPreload: 'intent' as const,
    scrollRestoration: false,
    defaultNotFoundComponent: DocsNotFound,
    defaultErrorComponent: DocsErrorFallback,
  });
}
