'use client';

import * as React from 'react';
import type { RootProviderProps } from 'fumadocs-ui/provider/base';
import { SearchDialog, type SearchDialogBrowsePage, type SearchDialogItem } from './SearchDialog';

export interface DocsProviderProps {
  children: React.ReactNode;
  /** Quick links shown when search is empty. */
  searchItems?: SearchDialogItem[];
  /** Browse pages shown when no quick links are provided. */
  browsePages?: SearchDialogBrowsePage[];
  /** Disable when the consumer does not expose a docs search endpoint. */
  searchEnabled?: boolean;
  /** Opt out of document-level theming in an embedded product area. */
  theme?: RootProviderProps['theme'];
}

/** Shared search configuration; framework-specific entries supply their provider. */
export function DocsProviderBase({
  provider: Provider, browsePages, children, searchItems, searchEnabled = true, theme,
}: DocsProviderProps & { provider: React.ComponentType<RootProviderProps> }) {
  const dialogItems = searchItems?.length ? searchItems : undefined;
  const dialogBrowsePages = browsePages?.length ? browsePages : undefined;
  const SearchDialogComponent = React.useCallback(
    (props: React.ComponentProps<typeof SearchDialog>) => (
      <SearchDialog {...props} {...(dialogItems ? { items: dialogItems } : {})}
        {...(dialogBrowsePages ? { browsePages: dialogBrowsePages } : {})} />
    ),
    [dialogBrowsePages, dialogItems],
  );
  return <Provider theme={theme} search={{ enabled: searchEnabled, SearchDialog: SearchDialogComponent }}>
    {children}
  </Provider>;
}
