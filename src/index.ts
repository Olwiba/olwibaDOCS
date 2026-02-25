// Components
export { Callout, type CalloutProps } from './components/Callout';
export { CopyButton } from './components/CopyButton';
export { CodeFence } from './components/CodeFence';
export { DocsProvider, type DocsProviderProps } from './components/DocsProvider';
export { DocsSidebar, type DocsSidebarProps, type SidebarSection } from './components/DocsSidebar';
export { DocsMobileNav, type DocsMobileNavProps } from './components/DocsMobileNav';
export { DocsCopyPage } from './components/DocsCopyPage';
export { DocsToc, type DocsTocProps, type TocItem } from './components/DocsToc';
export { APIReference } from './components/APIReference';
export { DocsHeader, type DocsHeaderProps } from './components/DocsHeader';
export { DocsFooter, type DocsFooterProps } from './components/DocsFooter';
export { DocsLayout, type DocsLayoutProps, type PageLoaderData, extractTextFromReactNode } from './components/DocsLayout';
export { ModeSwitcher, type ModeSwitcherProps } from './components/ModeSwitcher';
export { CopyCommandButton } from './components/CopyCommandButton';
export { SearchButton, type SearchButtonProps } from './components/SearchButton';
export {
  SearchDialog,
  type SearchDialogProps,
  type SearchDialogItem,
  type SearchDialogSharedProps,
} from './components/SearchDialog';

// Theme
export { ActiveThemeProvider, useThemeConfig } from './components/ActiveTheme';
export { ThemeSelector } from './components/ThemeSelector';
export { ThemeCodeBlock } from './components/ThemeCodeBlock';
export { themes, Theme, getThemeStyles, getThemeCode } from './lib/themes';

// Hooks
export { useCopyToClipboard } from './hooks/use-copy-to-clipboard';

// Lib
export { cn } from './lib/utils';
export { createSource, loader, lucideIconsPlugin, type LoaderOptions } from './lib/source';
export { mdxComponents, type MdxComponents } from './lib/mdx-components';
export { createDocsRoot, DocsNotFound, type DocsRootConfig, type DocsRootMeta, type DocsRootFavicon } from './lib/root';
export { createDocsRouter } from './lib/router';

// Re-export useful fumadocs page-tree types
export type { Root as PageTreeRoot, Node as PageTreeNode, Item as PageTreeItem, Folder as PageTreeFolder, Separator as PageTreeSeparator } from 'fumadocs-core/page-tree';
