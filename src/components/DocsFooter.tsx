// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@olwiba/cn';

export interface DocsFooterLink {
  label: string;
  href: string;
}

export interface DocsFooterProps {
  children?: React.ReactNode;
  changelogUrl?: string;
  /** Right-aligned links rendered before the changelog link. */
  links?: DocsFooterLink[];
}

export function DocsFooter({ children, changelogUrl, links }: DocsFooterProps) {
  const hasLinks = (links?.length ?? 0) > 0 || !!changelogUrl;

  return (
    <footer className="flex h-14 shrink-0 justify-center border-t">
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-l" aria-hidden="true" />
      <div className="flex h-full w-full max-w-[1600px] items-center gap-1 border-l border-r border-dashed px-4 lg:gap-2 lg:px-6">
        {children ?? (
          <>
            <p className="text-muted-foreground text-xs md:text-sm">
              Built with 💖 by <a
                className="underline"
                href="https://github.com/Olwiba"
                target="_blank"
                rel="noopener noreferrer"
              >
                Olwiba
              </a>
            </p>
            {hasLinks && (
              <div className="ml-auto flex items-center">
                {/* Desktop: inline links */}
                <div className="hidden items-center gap-3 md:flex lg:gap-4">
                  {links?.map((link) => (
                    <a
                      key={link.href}
                      className="text-muted-foreground text-sm underline"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                  {changelogUrl && (
                    <a
                      className="text-muted-foreground text-sm underline"
                      href={changelogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      changelog.md
                    </a>
                  )}
                </div>
                {/* Mobile: collapse links into a drop-up menu so they never wrap */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground size-8 md:hidden"
                      aria-label="More links"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="end">
                    {links?.map((link) => (
                      <DropdownMenuItem asChild key={link.href}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      </DropdownMenuItem>
                    ))}
                    {changelogUrl && (
                      <DropdownMenuItem asChild>
                        <a href={changelogUrl} target="_blank" rel="noopener noreferrer">
                          changelog.md
                        </a>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </>
        )}
      </div>
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-r" aria-hidden="true" />
    </footer>
  );
}
