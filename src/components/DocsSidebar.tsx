// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { Link, useLocation } from '@tanstack/react-router';
import { Layers, Palette, Rocket } from 'lucide-react';
import { SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, } from '@olwiba/cn';
import { cn } from '../lib/utils';
import type { Root, Node, Item } from 'fumadocs-core/page-tree';

export interface SidebarSection {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const TOP_LEVEL_SECTIONS: SidebarSection[] = [
  { name: 'Get Started', href: '/docs', icon: Rocket },
  { name: 'Components', href: '/docs/components', icon: Layers },
  { name: 'Themes', href: '/docs/themes', icon: Palette },
];

export interface DocsSidebarProps extends React.ComponentProps<'div'> {
  tree: Root;
  sections?: SidebarSection[];
  folderIcons?: Record<string, React.ComponentType<{ className?: string }>>;
}

export function DocsSidebar({ tree, sections, folderIcons, ...props }: DocsSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const navSections = sections ?? TOP_LEVEL_SECTIONS;

  return (
    <div className="z-30 hidden w-fit self-stretch lg:flex lg:flex-col" {...props}>
      <div className="h-[var(--top-spacing)] shrink-0" />
      <div className="relative sticky top-[calc(var(--header-height)+13px)] z-30 h-[calc(100svh-var(--header-height)-13px)] overflow-hidden overscroll-none">
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-3 bg-gradient-to-b from-background to-transparent" />
        <div className="no-scrollbar h-full overflow-y-auto overflow-x-hidden">
          <div className="px-2 pb-12">
            {navSections.length > 0 && (
              <SidebarGroup>
                {navSections.map(({ name, href, icon: Icon }) => {
                  const isActive = href === '/docs' ? pathname === href : pathname.startsWith(href);
                  return (
                    <SidebarGroupLabel
                      key={name}
                      asChild
                      className={cn(
                        'gap-1.5 font-normal transition-colors cursor-pointer',
                        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Link to={href}>
                        {Icon && <Icon className="size-3.5 shrink-0" />}
                        {name}
                      </Link>
                    </SidebarGroupLabel>
                  );
                })}
              </SidebarGroup>
            )}

            {tree.children.map((item: Node) => {
              if (item.$id === 'root:index.mdx') return null;
              if (item.$id === 'root:themes.mdx') return null;

              const FolderIcon = folderIcons?.[item.name];

              return (
                <SidebarGroup key={item.$id}>
                  <SidebarGroupLabel className="gap-1.5 font-normal text-muted-foreground">
                    {FolderIcon && <FolderIcon className="size-3.5 shrink-0" />}
                    {item.type === 'folder' && item.index ? (
                      <Link to={item.index.url} className="hover:text-foreground transition-colors">
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    {item.type === 'folder' && (
                      <SidebarMenu className="gap-0.5">
                        {item.children
                          .filter((childItem: Node) => {
                            if (childItem.type !== 'page') return false;
                            if (childItem.url === '/docs') return false;
                            if (childItem.$id?.endsWith('index.mdx')) return false;
                            return true;
                          })
                          .map((childItem: Node) => {
                            const page = childItem as Item;
                            return (
                              <SidebarMenuItem key={page.url}>
                                <SidebarMenuButton
                                  asChild
                                  className="relative h-[30px] w-fit overflow-visible border border-transparent font-medium text-[0.8rem] data-[active=true]:border-accent data-[active=true]:bg-accent"
                                  isActive={page.url === pathname}
                                >
                                  <Link to={page.url}>{page.name}</Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                      </SidebarMenu>
                    )}
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
