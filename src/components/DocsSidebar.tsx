// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { useRef, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Rocket, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Root, Node, Item } from 'fumadocs-core/page-tree';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@olwiba/cn';


export interface SidebarSection {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const TOP_LEVEL_SECTIONS: SidebarSection[] = [
  { name: 'Get Started', href: '/docs', icon: Rocket },
];

export interface DocsSidebarProps extends React.ComponentProps<'div'> {
  tree: Root;
  sections?: SidebarSection[];
  folderIcons?: Record<string, React.ComponentType<{ className?: string }>>;
  defaultOpenFolders?: boolean;
  completedItems?: string[];
}

export function DocsSidebar({ tree, sections, folderIcons, defaultOpenFolders, completedItems, ...props }: DocsSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const navSections = sections ?? TOP_LEVEL_SECTIONS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);

  // URLs covered by navSections — skip matching tree pages to avoid duplicates
  const sectionHrefs = new Set(navSections.map((s) => s.href));

  return (
    <div className="z-30 hidden w-fit self-stretch lg:flex lg:flex-col" {...props}>
      <div className="h-[var(--top-spacing)] shrink-0" />
      <div className="relative sticky top-[calc(var(--header-height)+13px)] z-30 h-[calc(100svh-var(--header-height)-13px)] overflow-hidden overscroll-none">
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-3 bg-gradient-to-b from-background to-transparent"
          style={{ opacity: showTopFade ? 1 : 0, transition: 'opacity 300ms ease' }}
        />
        <div
          ref={scrollRef}
          className="no-scrollbar h-full overflow-y-auto overflow-x-hidden"
          onScroll={() => setShowTopFade((scrollRef.current?.scrollTop ?? 0) > 0)}
        >
          <div className="px-2 pb-12">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">

                  {/* Static nav section buttons (e.g. "Get Started") */}
                  {navSections.map(({ name, href, icon: Icon }) => {
                    const isActive = href === '/docs' ? pathname === href : pathname.startsWith(href);
                    return (
                      <SidebarMenuItem key={name}>
                        <SidebarMenuButton asChild isActive={isActive} className={cn(!isActive && 'text-muted-foreground')}>
                          <Link to={href}>
                            {Icon && <Icon className="size-4" />}
                            {name}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  {/* Tree items — root-level pages as buttons, folders as collapsible */}
                  {tree.children.map((item: Node) => {
                    // Skip index — covered by "Get Started" in navSections
                    if (item.$id === 'root:index.mdx') return null;
                    // Skip pages whose URL is already covered by a navSection
                    if (item.type === 'page' && sectionHrefs.has((item as Item).url)) return null;

                    if (item.type === 'page') {
                      const page = item as Item;
                      return (
                        <SidebarMenuItem key={page.url}>
                          <SidebarMenuButton asChild isActive={page.url === pathname} className={cn(page.url !== pathname && 'text-muted-foreground')}>
                            <Link to={page.url}>{page.name}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }

                    if (item.type === 'folder') {
                      const folderName =
                        typeof item.name === 'string' ? item.name : 'folder';
                      const FolderIcon = folderIcons?.[folderName];
                      const folderPrefix = item.index?.url;
                      const isExpanded = folderPrefix
                        ? pathname.startsWith(folderPrefix)
                        : item.children.some((c: Node) => c.type === 'page' && (c as Item).url === pathname);

                      const pages = item.children.filter((child: Node): child is Item => {
                        if (child.type !== 'page') return false;
                        if (child.$id?.endsWith('index.mdx')) return false;
                        return true;
                      });

                      return (
                        <Collapsible key={item.$id} defaultOpen={defaultOpenFolders ?? isExpanded} className="group/collapsible">
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton asChild isActive={pathname === item.index?.url} className={cn(!isExpanded && pathname !== item.index?.url && 'text-muted-foreground')}>
                                <Link to={item.index?.url ?? `/docs/${folderName.toLowerCase()}`}>
                                  <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                  {FolderIcon && <FolderIcon className="size-4 shrink-0" />}
                                  {item.name}
                                  <span className="ml-auto text-xs tabular-nums text-muted-foreground/60">{pages.length}</span>
                                </Link>
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            {/* Width ghost: always in DOM so sidebar width is stable on open/close */}
                            <div className="h-0 w-fit overflow-hidden pointer-events-none select-none" aria-hidden="true">
                              <SidebarMenuSub>
                                {pages.map((page) => (
                                  <SidebarMenuSubItem key={page.url}>
                                    <SidebarMenuSubButton>{page.name}</SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </div>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {pages.map((page) => {
                                  const isComplete = !completedItems || completedItems.includes(page.url);
                                  return (
                                    <SidebarMenuSubItem key={page.url}>
                                      <SidebarMenuSubButton asChild isActive={page.url === pathname}>
                                        <Link to={page.url}>
                                          {page.name}
                                          {!isComplete && <span className="ml-1 text-muted-foreground/50">*</span>}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    return null;
                  })}

                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
