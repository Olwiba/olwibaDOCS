// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from '@tanstack/react-router';
import { PanelLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Root, Node, Item } from 'fumadocs-core/page-tree';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  Button,
  ScrollArea,
} from '@olwiba/cn';


const TOP_LEVEL_SECTIONS = [
  { name: 'Get Started', href: '/docs' },
];

export interface DocsMobileNavProps {
  tree: Root;
  sections?: { name: string; href: string }[];
}

export function DocsMobileNav({ tree, sections }: DocsMobileNavProps) {
  const navSections = sections ?? TOP_LEVEL_SECTIONS;
  const [open, setOpen] = React.useState(false);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null);
  const location = useLocation();
  const pathname = location.pathname;

  // Null is a supported outcome, not a failure — see the fallback in the
  // return. Read after mount because the header that owns the mount point
  // renders in the same pass.
  React.useEffect(() => {
    setPortalTarget(document.getElementById('docs-mobile-nav-trigger'));
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const trigger = (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => setOpen(true)}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Navigation</span>
    </Button>
  );

  return (
    <>
      {portalTarget ? (
        createPortal(trigger, portalTarget)
      ) : (
        // No mount point in the host's header. Previously this rendered
        // nothing at all, which left the sheet reachable only by a button that
        // did not exist — the nav was simply gone on mobile, silently, and the
        // component looked fine in isolation. Two sites shipped that way.
        //
        // Rendering inline instead means a consumer gets a working nav by
        // default and opts *in* to placing it in their header, rather than
        // opting out of a feature by forgetting an id.
        <div className="flex items-center px-4 pt-4 lg:hidden">{trigger}</div>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <ScrollArea className="h-full w-full">
            <div className="px-4 py-6">
              <div className="mb-4">
                <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                  Sections
                </p>
                <div className="flex flex-col gap-0.5">
                  {navSections.map(({ name, href }) => (
                    <Link
                      key={name}
                      to={href}
                      className={cn(
                        'rounded-md px-2 py-1.5 text-[0.8rem] font-medium',
                        (href === '/docs'
                          ? pathname === href
                          : pathname.startsWith(href))
                          ? 'border border-accent bg-accent'
                          : 'border border-transparent text-muted-foreground hover:bg-accent/50'
                      )}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>

              {tree.children.map((item: Node) => {
                if (item.$id === 'root:index.mdx') return null;
                // Skip pages whose URL is already in navSections
                if (item.type === 'page' && navSections.some((s) => s.href === (item as Item).url)) return null;

                if (item.type === 'page') {
                  const page = item as Item;
                  return (
                    <Link
                      key={page.url}
                      to={page.url}
                      className={cn(
                        'mb-1 block rounded-md px-2 py-1.5 text-[0.8rem] font-medium',
                        page.url === pathname
                          ? 'border border-accent bg-accent'
                          : 'border border-transparent text-muted-foreground hover:bg-accent/50'
                      )}
                    >
                      {page.name}
                    </Link>
                  );
                }

                if (item.type !== 'folder') return null;

                return (
                  <div key={item.$id} className="mb-4">
                    {item.index ? (
                      <Link
                        to={item.index.url}
                        className={cn(
                          'mb-2 block px-2 text-xs font-medium transition-colors',
                          pathname === item.index.url
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                        {item.name}
                      </p>
                    )}
                    <div className="flex flex-col gap-0.5">
                      {item.children
                        .filter(
                          (child: Node) =>
                            child.type === 'page' &&
                            (child as Item).url !== '/docs' &&
                            !child.$id?.endsWith('index.mdx')
                        )
                        .map((child: Node) => {
                          const page = child as Item;
                          return (
                            <Link
                              key={page.url}
                              to={page.url}
                              className={cn(
                                'rounded-md px-2 py-1.5 text-[0.8rem] font-medium',
                                page.url === pathname
                                  ? 'border border-accent bg-accent'
                                  : 'border border-transparent text-muted-foreground hover:bg-accent/50'
                              )}
                            >
                              {page.name}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
