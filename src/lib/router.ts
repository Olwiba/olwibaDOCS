import { createRouter, type AnyRoute, type RouterOptions } from '@tanstack/react-router';
import { DocsNotFound } from './root';

export function createDocsRouter<TRouteTree extends AnyRoute>(
  routeTree: TRouteTree,
  options?: Omit<RouterOptions<TRouteTree>, 'routeTree'>,
) {
  return createRouter({
    defaultPreload: 'intent',
    scrollRestoration: true,
    ...options,
    routeTree,
    defaultNotFoundComponent: DocsNotFound,
  });
}
