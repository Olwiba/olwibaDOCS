'use client';

import { Link, useLocation } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  ScrollArea,
} from '@olwiba/cn';
import type { PageTree } from 'fumadocs-core/source';

export interface SidebarSection {
  name: string;
  href: string;
}

export interface DocsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  tree: PageTree.Root;
  /** Top-level navigation sections shown above the page tree */
  sections?: SidebarSection[];
}

export function DocsSidebar({ tree, sections, ...props }: DocsSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar
      className="fixed top-[calc(var(--header-height)+1px)] left-auto z-30 hidden h-[calc(100svh-var(--header-height)-1px)] overscroll-none bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden px-2">
        <ScrollArea className="h-[calc(90svh-50px)]">
          <div className="sticky -top-1 z-10 h-8 shrink-0 bg-gradient-to-b from-background via-background/80 to-background/50" />
          {sections && sections.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-muted-foreground">
                Sections
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                    {sections.map(({ name, href }) => (
                    <SidebarMenuItem key={name}>
                      <SidebarMenuButton
                        asChild
                        className="relative h-[30px] w-fit overflow-visible border border-transparent font-medium text-[0.8rem] data-[active=true]:border-accent data-[active=true]:bg-accent"
                        isActive={
                          href === '/docs'
                            ? pathname === href
                            : pathname.startsWith(href)
                        }
                      >
                        <Link to={href}>{name}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {tree.children.map((item) => {
            if (item.$id === 'root:index.mdx') return null;

            return (
              <SidebarGroup key={item.$id}>
                <SidebarGroupLabel className="font-medium text-muted-foreground">
                  {item.name}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  {item.type === 'folder' && (
                    <SidebarMenu className="gap-0.5">
                      {item.children.map((childItem) => {
                        if (childItem.type !== 'page') return null;
                        if (childItem.url === '/docs') return null;

                        return (
                          <SidebarMenuItem key={childItem.url}>
                            <SidebarMenuButton
                              asChild
                              className="relative h-[30px] w-fit overflow-visible border border-transparent font-medium text-[0.8rem] data-[active=true]:border-accent data-[active=true]:bg-accent"
                              isActive={childItem.url === pathname}
                            >
                              <Link to={childItem.url}>{childItem.name}</Link>
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
          <div className="sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
