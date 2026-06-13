'use client';

import * as React from 'react';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import {
  SearchDialog,
  type SearchDialogBrowsePage,
  type SearchDialogItem,
} from './SearchDialog';

export interface DocsProviderProps {
  children: React.ReactNode;
  /** Quick links shown in search dialog when input is empty */
  searchItems?: SearchDialogItem[];
  /** Browse pages shown when input is empty and no quick links are provided */
  browsePages?: SearchDialogBrowsePage[];
}

export function DocsProvider({ browsePages, children, searchItems }: DocsProviderProps) {
  const dialogItems = searchItems !== undefined && searchItems.length > 0 ? searchItems : undefined;
  const dialogBrowsePages = browsePages !== undefined && browsePages.length > 0 ? browsePages : undefined;

  const SearchDialogComponent = React.useCallback(
    (props: React.ComponentProps<typeof SearchDialog>) => (
      <SearchDialog
        {...props}
        {...(dialogItems ? { items: dialogItems } : {})}
        {...(dialogBrowsePages ? { browsePages: dialogBrowsePages } : {})}
      />
    ),
    [dialogBrowsePages, dialogItems]
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
