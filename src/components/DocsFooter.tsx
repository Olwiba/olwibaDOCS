// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';

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
            <div className="ml-auto flex items-center gap-3 lg:gap-4">
              {links?.map((link) => (
                <a
                  key={link.href}
                  className="text-muted-foreground text-xs underline md:text-sm"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
              {changelogUrl && (
                <a
                  className="text-muted-foreground text-xs underline md:text-sm"
                  href={changelogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  changelog.md
                </a>
              )}
            </div>
          </>
        )}
      </div>
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-r" aria-hidden="true" />
    </footer>
  );
}
