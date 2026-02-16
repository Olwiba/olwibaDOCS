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
export function createSource(options: Parameters<typeof loader>[0]) {
  const existingPlugins = Array.isArray(options.plugins) ? options.plugins : [];
  return loader({
    ...options,
    plugins: [
      lucideIconsPlugin(),
      ...existingPlugins,
    ],
  });
}

/**
 * Re-export loader for advanced use cases where you need full control.
 */
export { loader, lucideIconsPlugin };
