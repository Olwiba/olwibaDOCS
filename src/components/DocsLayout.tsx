// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { DocsSidebar, type SidebarSection } from './DocsSidebar';
import { DocsMobileNav } from './DocsMobileNav';
import { DocsToc, type TocItem } from './DocsToc';
import { DocsCopyPage } from './DocsCopyPage';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SerializedPageTree } from 'fumadocs-core/source/client';
import type { Root } from 'fumadocs-core/page-tree';
import {
  SidebarProvider,
  Button,
} from '@olwiba/cn';


export interface PageLoaderData {
  path: string;
  url: string;
  pageTree: SerializedPageTree;
  frontmatter: {
    title: string;
    description: string | undefined;
  };
  toc: TocItem[];
  rawContent: string;
  neighbours: {
    previous: { url: string; name: string } | null;
    next: { url: string; name: string } | null;
  };
}

export function extractTextFromReactNode(node: React.ReactNode): string {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join('');
  if (typeof node === 'object' && 'props' in node) {
    const el = node as React.ReactElement & { props: { children?: React.ReactNode } };
    return extractTextFromReactNode(el.props.children);
  }
  return '';
}

export interface DocsLayoutProps {
  loaderData: PageLoaderData;
  pageTree: Root;
  sections?: SidebarSection[];
  defaultOpenFolders?: boolean;
  /** Pinned to the bottom of the sidebar viewport; pushed up by the footer at page end. */
  sidebarBottomSlot?: React.ReactNode;
  children: React.ReactNode;
}

export function DocsLayout({ loaderData, pageTree, sections, defaultOpenFolders, sidebarBottomSlot, children }: DocsLayoutProps) {
  return (
    <div className="flex flex-1 flex-col lg:px-2">
      <SidebarProvider className="min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:1.5rem] lg:[--sidebar-width:240px] lg:[--top-spacing:2rem]">
        <DocsSidebar tree={pageTree} sections={sections} defaultOpenFolders={defaultOpenFolders} bottomSlot={sidebarBottomSlot} />
        <div className="hidden lg:block w-4 self-stretch border-x border-dashed blueprint-pattern" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <DocsMobileNav tree={pageTree} sections={sections} />
          <div className="flex items-stretch xl:w-full">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="h-[var(--top-spacing)] shrink-0" />
              <div className="flex w-full min-w-0 flex-1 flex-col gap-8 px-4 pb-6 text-neutral-800 md:px-6 lg:pb-8 dark:text-neutral-300">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h1 className="scroll-m-20 font-semibold text-4xl tracking-tight sm:text-3xl xl:text-4xl">
                      {loaderData.frontmatter.title}
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-2">
                      <div className="hidden sm:block">
                        <DocsCopyPage
                          page={loaderData.rawContent}
                          url={typeof window !== 'undefined' ? window.location.href : loaderData.url}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {loaderData.neighbours.previous && (
                          <Button asChild size="icon" variant="secondary" className="size-8">
                            <Link to={loaderData.neighbours.previous.url}>
                              <ArrowLeft className="size-4" />
                              <span className="sr-only">Previous</span>
                            </Link>
                          </Button>
                        )}
                        {loaderData.neighbours.next && (
                          <Button asChild size="icon" variant="secondary" className="size-8">
                            <Link to={loaderData.neighbours.next.url}>
                              <ArrowRight className="size-4" />
                              <span className="sr-only">Next</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:hidden w-fit">
                    <DocsCopyPage
                      page={loaderData.rawContent}
                      url={typeof window !== 'undefined' ? window.location.href : loaderData.url}
                    />
                  </div>
                  {loaderData.frontmatter.description && (
                    <p className="text-balance text-muted-foreground">
                      {loaderData.frontmatter.description}
                    </p>
                  )}
                </div>
                {loaderData.toc?.length > 0 && (
                  <div className="xl:hidden">
                    <DocsToc toc={loaderData.toc} variant="dropdown" />
                  </div>
                )}
                {children}
              </div>
              <div className="hidden h-16 w-full items-center gap-2 px-4 sm:flex md:px-6">
                {loaderData.neighbours.previous && (
                  <Button asChild size="sm" variant="secondary">
                    <Link to={loaderData.neighbours.previous.url}>
                      <ArrowLeft className="size-4" /> {loaderData.neighbours.previous.name}
                    </Link>
                  </Button>
                )}
                {loaderData.neighbours.next && (
                  <Button asChild size="sm" variant="secondary" className="ml-auto">
                    <Link to={loaderData.neighbours.next.url}>
                      {loaderData.neighbours.next.name} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {loaderData.toc?.length > 0 && (
              <>
              <div className="hidden xl:block w-4 self-stretch border-x border-dashed blueprint-pattern" aria-hidden="true" />
              <div className="hidden w-fit shrink-0 flex-col pb-4 lg:pb-6 xl:flex">
                <div className="h-[var(--top-spacing)] shrink-0" />
                <div className="sticky top-[calc(var(--header-height)+13px)] z-30 max-h-[calc(100svh-var(--header-height)-1px)] overflow-hidden overscroll-none">
                  <div className="no-scrollbar overflow-y-auto px-2 pb-2">
                    <DocsToc toc={loaderData.toc} />
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
