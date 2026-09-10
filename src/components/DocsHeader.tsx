// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { ModeSwitcher } from './ModeSwitcher';
import { cn } from '../lib/utils';
import { SearchButton } from './SearchButton';
import { MoreHorizontal } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@olwiba/cn';


export interface DocsHeaderProps {
  logo: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  githubUrl?: string;
  githubBadge?: string;
  showSearch?: boolean;
  showModeSwitcher?: boolean;
  rightSlot?: React.ReactNode;
  /**
   * Controls that stay in the bar on desktop and collapse into a menu below
   * `md`.
   *
   * The header is a fixed-height row with no wrapping, so every control a site
   * adds to `rightSlot` is a control that has to fit on a phone. It did not:
   * a signed-in administrator had search, two repository links, Admin, a mode
   * dropdown and Sign out all competing for one line, and the row simply ran
   * off the side of the screen.
   *
   * Anything secondary belongs here instead. Search and the theme switcher are
   * the two worth keeping visible at every width; the rest can live one tap
   * away without losing anything.
   */
  overflowSlot?: React.ReactNode;
  /** Accessible name for the overflow trigger. */
  overflowLabel?: string;
}

export function DocsHeader({
  logo,
  navItems,
  githubUrl,
  githubBadge,
  showSearch = true,
  showModeSwitcher = true,
  rightSlot,
  overflowSlot,
  overflowLabel = 'More',
}: DocsHeaderProps) {
  const [soonOpen, setSoonOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 justify-center border-b bg-background/95 backdrop-blur-sm">
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-l" aria-hidden="true" />
      <div className="flex h-full w-full min-w-0 max-w-[1600px] items-center gap-2 border-l border-r border-dashed px-4 md:gap-5 md:px-6">
        <div id="docs-mobile-nav-trigger" className="empty:hidden lg:hidden" />
        {/* The wordmark is the one thing here that can afford to give up room,
            so it is the only child allowed to shrink. Without `min-w-0` a flex
            item refuses to go below its content width and pushes the controls
            past the edge instead. */}
        <Link className="flex min-w-0 items-center gap-2" to="/">
          <span className="truncate font-bold text-lg">
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

        <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
          {showSearch && <SearchButton />}
          {githubUrl &&
            (githubBadge ? (
              // Unavailable, so it is a disabled control rather than a link
              // wearing a sticker. The badge used to sit centred on top of the
              // icon at 6px on mobile, where there is no room beside it —
              // covering the thing it was annotating and reading as damage.
              //
              // A tooltip says the same thing at every size and needs no space
              // until asked. Rendered as a real <button> with aria-disabled
              // rather than the `disabled` attribute: a disabled button stops
              // emitting pointer events in every browser, so the tooltip
              // explaining *why* it is disabled would never open.
              <TooltipProvider delayDuration={150}>
                <Tooltip open={soonOpen} onOpenChange={setSoonOpen}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-disabled="true"
                    // Controlled, and opened on click as well as hover: Radix
                    // tooltips are hover/focus only, so on a touch screen —
                    // the case this was reported from — there would otherwise
                    // be no way to find out why the button does nothing.
                    onClick={(event) => {
                      event.preventDefault();
                      setSoonOpen((open) => !open);
                    }}
                    className="flex cursor-not-allowed items-center gap-2 rounded-md px-1.5 py-1 text-sm opacity-50 sm:px-3 sm:py-1.5"
                  >
                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span className="hidden sm:inline">GitHub</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>{githubBadge}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors hover:text-foreground/80 sm:px-3 sm:py-1.5',
                )}
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
            ))}
          {rightSlot}
          {overflowSlot && (
            <>
              {/* Two renderings of the same nodes, not two sets of controls.
                  The inline copy is display:none on a phone so it costs no
                  width, and the menu copy only mounts while the menu is open,
                  so the two are never interactive at once. */}
              <div className="hidden items-center gap-2 md:flex">{overflowSlot}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={overflowLabel}
                    className="flex size-9 shrink-0 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                {/* The slot holds whole controls — links, buttons — rather than
                    menu items, so this is a panel that stacks them, not a list
                    that re-styles them. */}
                <DropdownMenuContent align="end" className="w-56 p-1">
                  <div className="flex flex-col items-stretch gap-1 [&>*]:w-full [&>*]:justify-start">
                    {overflowSlot}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {showModeSwitcher && <ModeSwitcher />}
        </div>
      </div>
      <div className="h-full w-4 shrink-0 border-dashed lg:w-12 lg:border-r" aria-hidden="true" />
    </header>
  );
}
