'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Button } from '@olwiba/cn';
import { cn } from '../lib/utils';

export interface SearchButtonProps {}

export function SearchButton(_props: SearchButtonProps = {}) {
  const { setOpenSearch } = useSearchContext();

  return (
    <Button
      className={cn(
        'relative h-8 w-full max-w-[75%] justify-start bg-muted/50 font-normal text-sm text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64'
      )}
      onClick={() => setOpenSearch(true)}
      variant="outline"
    >
      <span className="hidden lg:inline-flex">Search documentation...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 select-none items-center gap-1 border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
