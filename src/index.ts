// Components
export { Callout, type CalloutProps } from './components/Callout';
export { CopyButton } from './components/CopyButton';
export { DocsSidebar, type DocsSidebarProps, type SidebarSection } from './components/DocsSidebar';
export { DocsToc, type DocsTocProps, type TocItem } from './components/DocsToc';
export { ModeSwitcher, type ModeSwitcherProps } from './components/ModeSwitcher';
export { SearchButton, type SearchButtonProps } from './components/SearchButton';
export {
  SearchDialog,
  type SearchDialogProps,
  type SearchDialogItem,
  type SearchDialogSharedProps,
} from './components/SearchDialog';

// Hooks
export { useCopyToClipboard } from './hooks/use-copy-to-clipboard';

// Lib
export { cn } from './lib/utils';
export { createSource, loader, lucideIconsPlugin, type LoaderOptions } from './lib/source';
export { mdxComponents, type MdxComponents } from './lib/mdx-components';

// Re-export useful fumadocs types
export type { PageTree } from 'fumadocs-core/source';
