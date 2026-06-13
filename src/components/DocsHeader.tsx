// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { ModeSwitcher } from './ModeSwitcher';
import { cn } from '../lib/utils';
import { SearchButton } from './SearchButton';

export interface DocsHeaderProps {
  logo: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  githubUrl?: string;
  githubBadge?: string;
  rightSlot?: React.ReactNode;
}

export function DocsHeader({ logo, navItems, githubUrl, githubBadge, rightSlot }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 justify-center border-b bg-background/95 backdrop-blur-sm">
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-l" aria-hidden="true" />
      <div className="flex h-full w-full max-w-[1600px] items-center gap-2 border-l border-r border-dashed px-4 md:gap-5 md:px-6">
        <div id="docs-mobile-nav-trigger" className="empty:hidden lg:hidden" />
        <Link className="flex items-center gap-2" to="/">
          <span className="font-bold text-lg">
            {logo}
          </span>
        </Link>

        {navItems && navItems.length > 0 && (
          <nav className="hidden items-center gap-4 text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <SearchButton />
          {githubUrl && (
            <div className="relative overflow-visible">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors hover:text-foreground/80 sm:px-3 sm:py-1.5',
                  githubBadge && 'opacity-50',
                )}
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
              {githubBadge && (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary px-1 pb-0.5 text-[6px] font-bold text-primary-foreground rounded-xs sm:left-auto sm:-right-1 sm:-top-1 sm:translate-x-0 sm:translate-y-0 sm:rotate-12 sm:px-1 sm:pt-0.5 sm:pb-1 sm:text-[8px]">
                  {githubBadge}
                </span>
              )}
            </div>
          )}
          {rightSlot}
          <ModeSwitcher />
        </div>
      </div>
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-r" aria-hidden="true" />
    </header>
  );
}
