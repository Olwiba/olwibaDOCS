import { createDocsRouter } from '@olwiba/docs';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createDocsRouter(routeTree, {
    defaultPreload: 'intent',
    scrollRestoration: true,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
