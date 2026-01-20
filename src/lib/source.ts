import { loader, type LoaderOptions } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export type { LoaderOptions };

/**
 * Creates a Fumadocs source loader with olwiba defaults.
 * 
 * @example
 * ```ts
 * // In your app's source.ts
 * import { docs } from 'fumadocs-mdx:collections/server';
 * import { createSource } from '@olwiba/docs/source';
 * 
 * export const source = createSource({
 *   source: docs.toFumadocsSource(),
 *   baseUrl: '/docs',
 * });
 * ```
 */
export function createSource<T extends LoaderOptions>(options: T) {
  return loader({
    ...options,
    plugins: [
      lucideIconsPlugin(),
      ...(options.plugins ?? []),
    ],
  });
}

/**
 * Re-export loader for advanced use cases where you need full control.
 */
export { loader, lucideIconsPlugin };
