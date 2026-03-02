// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { useEffect, useState } from 'react';
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
import { Link } from '@tanstack/react-router';
import { ScrollArea } from '@olwiba/cn';

interface PageItem {
  title: string;
  description?: string;
  url: string;
}

export type SearchDialogItem = { label: string; href: string; description?: string };

export type SearchDialogSharedProps = SharedProps;

export interface SearchDialogProps extends SharedProps {
  items?: SearchDialogItem[];
}

export function SearchDialog(props: SearchDialogProps) {
  const { items, ...restProps } = props;
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
  });
  const [allPages, setAllPages] = useState<PageItem[]>([]);

  useEffect(() => {
    if (!items) {
      fetch('/api/pages')
        .then((res) => res.json())
        .then((pages: PageItem[]) => setAllPages(pages))
        .catch(() => {});
    }
  }, [items]);

  const groupedPages = allPages.reduce<Record<string, PageItem[]>>((acc, page) => {
    const parts = page.url.split('/').filter(Boolean);
    const section = parts.length > 2 ? parts[1] : 'docs';
    const label = section.charAt(0).toUpperCase() + section.slice(1);
    if (!acc[label]) acc[label] = [];
    acc[label].push(page);
    return acc;
  }, {});

  return (
    <FumaSearchDialog
      isLoading={query.isLoading}
      onSearchChange={setSearch}
      search={search}
      {...restProps}
    >
      <SearchDialogOverlay />
      <SearchDialogContent className="mt-20 md:mt-0">
        <SearchDialogHeader>
          <Search className="size-5 text-muted-foreground" />
          <SearchDialogInput />
          <SearchDialogClose className="hidden sm:flex">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 border bg-muted px-1.5 font-medium font-mono text-[10px] flex">
              ESC
            </kbd>
          </SearchDialogClose>
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />

        {search ? null : items ? (
          <div className="flex flex-col pb-4">
            {items.map((item) => (
              <a
                className="block px-4 py-2 text-sm hover:bg-muted"
                href={item.href}
                key={item.href}
                onClick={() => restProps.onOpenChange?.(false)}
              >
                <span className="font-medium">{item.label}</span>
                {item.description && (
                  <span className="ml-2 text-muted-foreground text-xs">
                    {item.description}
                  </span>
                )}
              </a>
            ))}
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="flex flex-col pb-4">
              {Object.entries(groupedPages).map(([section, pages]) => (
                <div key={section}>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {section}
                  </div>
                  {pages.map((page) => (
                    <Link
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      to={page.url}
                      key={page.url}
                      onClick={() => restProps.onOpenChange?.(false)}
                    >
                      <span className="font-medium">{page.title}</span>
                      {page.description && (
                        <span className="ml-2 text-muted-foreground text-xs">
                          {page.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SearchDialogContent>
    </FumaSearchDialog>
  );
}
