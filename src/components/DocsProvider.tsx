'use client';

import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { DocsProviderBase, type DocsProviderProps } from './DocsProviderBase';

export type { DocsProviderProps } from './DocsProviderBase';

/** Default entry preserves the existing TanStack Router integration. */
export function DocsProvider(props: DocsProviderProps) {
  return <DocsProviderBase {...props} provider={RootProvider} />;
}
