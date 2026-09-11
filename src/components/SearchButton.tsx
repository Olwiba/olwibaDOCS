// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';
import { Button } from '@olwiba/cn';
import { cn } from '../lib/utils';

export interface SearchButtonProps {}

/**
 * A search field on desktop, a search icon on a phone.
 *
 * It used to be `w-full max-w-[75%]` at every width, which on a 390px screen
 * meant the search box claimed three quarters of the header and left the
 * wordmark crushed to a four-pixel sliver beside it. Nothing overflowed — the
 * row simply gave all its room to the widest thing in it.
 *
 * Below `md` this is a square button. The keyboard hint goes with the field,
 * since a phone has no ⌘K to offer.
 */
export function SearchButton(_props: SearchButtonProps = {}) {
  const { setOpenSearch } = useSearchContext();

  return (
    <Button
      aria-label="Search"
      className={cn(
        'relative h-8 shrink-0 bg-muted/50 font-normal text-sm text-muted-foreground shadow-none',
        'w-8 justify-center px-0',
        'md:w-40 md:justify-start md:px-3 md:pr-12 lg:w-56 xl:w-64',
      )}
      onClick={() => setOpenSearch(true)}
      variant="outline"
    >
      <Search className="size-4 md:hidden" />
      <span className="hidden md:inline-flex lg:hidden">Search...</span>
      <span className="hidden lg:inline-flex">Search documentation...</span>
      <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 select-none items-center gap-1 border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 md:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
