'use client';

import * as React from 'react';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { SearchDialog, type SearchDialogItem } from './SearchDialog';

export interface DocsProviderProps {
  children: React.ReactNode;
  /** Quick links shown in search dialog when input is empty */
  searchItems?: SearchDialogItem[];
}

export function DocsProvider({ children, searchItems = [] }: DocsProviderProps) {
  const SearchDialogComponent = React.useCallback(
    (props: React.ComponentProps<typeof SearchDialog>) => (
      <SearchDialog items={searchItems} {...props} />
    ),
    [searchItems]
  );

  return (
    <RootProvider
      search={{
        SearchDialog: SearchDialogComponent,
      }}
    >
      {children}
    </RootProvider>
  );
}
