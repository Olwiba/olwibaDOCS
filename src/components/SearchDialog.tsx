'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog as FumaSearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { Search } from 'lucide-react';

export type SearchDialogItem = { label: string; href: string };
export type SearchDialogSharedProps = SharedProps;

export interface SearchDialogProps extends SharedProps {
  /** Quick links shown when search input is empty */
  items?: SearchDialogItem[];
}

export function SearchDialog({ items, ...props }: SearchDialogProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
  });

  return (
    <FumaSearchDialog
      isLoading={query.isLoading}
      onSearchChange={setSearch}
      search={search}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent className="mt-20 md:mt-0">
        <SearchDialogHeader>
          <Search className="size-5 text-muted-foreground" />
          <SearchDialogInput />
          <SearchDialogClose>
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 border bg-muted px-1.5 font-medium font-mono text-[10px] hidden sm:flex">
              ESC
            </kbd>
          </SearchDialogClose>
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />

        {search ? null : items && items.length > 0 ? (
          <div className="flex flex-col">
            {items.map((item) => (
              <a
                className="px-6 py-3 text-muted-foreground text-sm hover:bg-muted"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </SearchDialogContent>
    </FumaSearchDialog>
  );
}
