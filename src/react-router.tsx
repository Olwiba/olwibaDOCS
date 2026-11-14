'use client';

import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { DocsProviderBase, type DocsProviderProps } from './components/DocsProviderBase';

/** React Router 7/8 integration; no TanStack router or Start runtime required. */
export function DocsProvider(props: DocsProviderProps) {
  return <DocsProviderBase {...props} provider={RootProvider} />;
}
export type { DocsProviderProps } from './components/DocsProviderBase';

// Portable docs components. TanStack app/bootstrap/server helpers remain on
// their existing entries and are intentionally absent from this graph.
export { DocsLayout, type DocsLayoutProps, type PageLoaderData } from './components/DocsLayout';
export { DocsSidebar, type DocsSidebarProps, type SidebarSection, type SidebarItemDecoration } from './components/DocsSidebar';
export { DocsMobileNav, type DocsMobileNavProps } from './components/DocsMobileNav';
export { DocsHeader, type DocsHeaderProps } from './components/DocsHeader';
export { DocsFooter, type DocsFooterProps } from './components/DocsFooter';
export { DocsCardGrid, DocsCard, type DocsCardGridProps, type DocsCardProps } from './components/DocsCardGrid';
export { DocsToc, type DocsTocProps, type TocItem } from './components/DocsToc';
export { CodeFence } from './components/CodeFence';
export { CopyButton } from './components/CopyButton';
export { APIReference } from './components/APIReference';
export { Callout, type CalloutProps } from './components/Callout';
export { Sandbox, SandboxControls, useSandboxTheme } from './components/Sandbox';
export { registerSandboxes, type SandboxDefinition, type SandboxRegistryInput } from './components/sandbox-registry';
export { ComponentNameContext, ControlsPortalContext, DemoControls, LiveUsageCode, useUsageCode } from './components/demo-controls';
export type { Root as PageTreeRoot, Node as PageTreeNode, Item as PageTreeItem } from 'fumadocs-core/page-tree';
