// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
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

export interface DocsFooterVersion {
  /** Bare semver. The `v` is added when rendering. */
  version: string;
  /** Where the pill links — normally the package's changelog. */
  href: string;
  /** Names the package. Only needed when a site ships more than one. */
  label?: string;
  /**
   * `pro` borrows the primary colour so two pills can be told apart without
   * reading them.
   */
  accent?: 'default' | 'pro';
}

export interface DocsFooterProps {
  children?: React.ReactNode;
  changelogUrl?: string;
  /** Right-aligned links rendered before the changelog link. */
  links?: DocsFooterLink[];
  /**
   * Released versions, rendered as pills linking to their changelogs.
   *
   * This replaces the `changelog.md` text link, which said the same thing in
   * more words and left the one fact a visitor actually wants — which version
   * is out. Rendered at the start of the footer, ahead of the credit line.
   *
   * Sits alongside `changelogUrl` rather than replacing it: the pill answers
   * "which version am I on" at a glance on the left, and the text link on the
   * right is still where someone goes to read what changed.
   */
  versions?: DocsFooterVersion[];
}

export function VersionPill({ version, href, label, accent = 'default' }: DocsFooterVersion) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label ? `${label} changelog` : 'Changelog'}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-5 transition-colors',
        accent === 'pro'
          ? 'border-primary/50 text-primary hover:bg-primary/10'
          : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {label && <span className="font-medium">{label}</span>}
      <span className="font-mono">v{version}</span>
    </a>
  );
}

export function DocsFooter({ children, changelogUrl, links, versions }: DocsFooterProps) {
  const hasVersions = (versions?.length ?? 0) > 0;
  const hasLinks = (links?.length ?? 0) > 0 || !!changelogUrl;

  return (
    <footer className="flex h-14 shrink-0 justify-center border-t">
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-l" aria-hidden="true" />
      <div className="flex h-full w-full max-w-[1600px] items-center gap-1 border-l border-r border-dashed px-4 lg:gap-2 lg:px-6">
        {children ?? (
          <>
            {/* Version first, then the credit line. The pill is the only part
                of this footer that changes, and reading it as "v1.2.3, built
                with love by" puts it where the eye already starts. */}
            {hasVersions && (
              <div className="flex shrink-0 items-center gap-1.5">
                {versions?.map((entry) => (
                  <VersionPill key={`${entry.label ?? ''}${entry.version}`} {...entry} />
                ))}
              </div>
            )}
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
              <div className="ml-auto flex items-center gap-2">
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

                {/* Mobile: collapse links into a drop-up menu so they never
                    wrap. Only rendered when there is something to put in it —
                    a site with pills and no links would otherwise get a button
                    that opens an empty menu. */}
                {((links?.length ?? 0) > 0 || changelogUrl) && (
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
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-r" aria-hidden="true" />
    </footer>
  );
}
