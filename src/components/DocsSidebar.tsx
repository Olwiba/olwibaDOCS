// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { useRef, useState, useEffect } from 'react';
import { useLocation, useRouter } from '@tanstack/react-router';
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
  Enchanted,
} from '@olwiba/cn';


export interface SidebarSection {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  enchanted?: boolean;
  collapsedByDefault?: boolean;
}

const TOP_LEVEL_SECTIONS: SidebarSection[] = [
  { name: 'Get Started', href: '/docs', icon: Rocket },
];

export interface DocsSidebarProps extends React.ComponentProps<'div'> {
  tree: Root;
  sections?: SidebarSection[];
  folderIcons?: Record<string, React.ComponentType<{ className?: string }>>;
  defaultOpenFolders?: boolean;
}

interface SidebarFolderProps {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  pages: Item[];
  isActive: boolean;
  inSection: boolean;
  defaultOpen: boolean;
  pathname: string;
  enchanted?: boolean;
}

function SidebarFolder({ name, href, icon: FolderIcon, pages, isActive, inSection, defaultOpen, pathname, enchanted }: SidebarFolderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const HeaderRow = enchanted ? Enchanted : 'div';
  const router = useRouter();

  // Open when the user navigates into this section (direct URL, search, etc.).
  useEffect(() => {
    if (inSection) setOpen(true);
  }, [inSection]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <HeaderRow className="flex w-full items-center">
          {/* Chevron: toggle only, no navigation */}
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'flex h-8 w-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground',
              )}
            >
              <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>

          <SidebarMenuButton
            isActive={isActive}
            className={cn('flex-1', !isActive && 'text-muted-foreground')}
            onClick={() => {
              if (!open) setOpen(true);
              void router.navigate({ href });
            }}
          >
            <>
              {FolderIcon && <FolderIcon className="size-4 shrink-0" />}
              {name}
            </>
          </SidebarMenuButton>
        </HeaderRow>

        {/* Width ghost: always in DOM so sidebar width is stable on open/close */}
        <div className="h-0 w-fit overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <SidebarMenuSub>
            {pages.map((page) => (
              <SidebarMenuSubItem key={page.url}>
                <SidebarMenuSubButton>
                  {page.name}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </div>

        <CollapsibleContent>
          <SidebarMenuSub>
            {pages.map((page) => (
              <SidebarMenuSubItem key={page.url}>
                <SidebarMenuSubButton
                  isActive={page.url === pathname}
                  onClick={() => {
                    void router.navigate({ href: page.url });
                  }}
                >
                    {page.name}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function DocsSidebar({ tree, sections, folderIcons, defaultOpenFolders, ...props }: DocsSidebarProps) {
  const location = useLocation();
  const router = useRouter();
  const pathname = location.pathname;
  const navSections = sections ?? TOP_LEVEL_SECTIONS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);

  // Match each section to its folder in the tree by checking child URLs.
  // We intentionally don't use item.index?.url because fumadocs may return
  // a fallback "/docs/folder" URL for directories it hasn't fully indexed yet.
  type FolderNode = Node & { type: 'folder'; children: Node[] };

  const folderBySection = new Map<string, FolderNode>();
  for (const item of tree.children) {
    if (item.type !== 'folder') continue;
    for (const section of navSections) {
      if (section.href === '/docs') continue;
      const hasMatchingChild = (item as FolderNode).children.some(
        (c: Node) => c.type === 'page' && (c as Item).url.startsWith(section.href + '/')
      );
      if (hasMatchingChild && !folderBySection.has(section.href)) {
        folderBySection.set(section.href, item as FolderNode);
      }
    }
  }

  return (
    <div className="z-30 hidden w-fit self-stretch lg:flex lg:flex-col transition-[width] duration-150 ease-out" {...props}>
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

                  {navSections.map(({ name, href, icon: Icon, enchanted, collapsedByDefault }) => {
                    const inSection = href === '/docs' ? pathname === href : pathname.startsWith(href);
                    const isActive = pathname === href;
                    const folder = folderBySection.get(href);

                    // Section with sub-pages — render as split collapsible
                    if (folder) {
                      const FolderIcon = Icon ?? folderIcons?.[name];
                      const pages = folder.children.filter((child: Node): child is Item => {
                        if (child.type !== 'page') return false;
                        if (child.$id?.endsWith('index.mdx')) return false;
                        return true;
                      });
                      const isExpanded = inSection || ((defaultOpenFolders ?? false) && !(collapsedByDefault ?? false));

                      return (
                        <SidebarFolder
                          key={href}
                          name={name}
                          href={href}
                          icon={FolderIcon}
                          pages={pages}
                          isActive={isActive}
                          inSection={inSection}
                          defaultOpen={isExpanded}
                          pathname={pathname}
                          enchanted={enchanted}
                        />
                      );
                    }

                    // Section with no sub-pages — flat link (uses prefix match so e.g. /docs stays active on child pages)
                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                          isActive={inSection}
                          className={cn(!inSection && 'text-muted-foreground')}
                          onClick={() => {
                            void router.navigate({ href });
                          }}
                        >
                            {Icon && <Icon className="size-4" />}
                            {name}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
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
