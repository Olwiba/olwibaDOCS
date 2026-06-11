import * as React from 'react';

/** Single source of truth for lazy demo components — used by ComponentPreview and the builder. */
export const demoRegistry: Record<string, React.LazyExoticComponent<React.FC>> = {
  'copy-button': React.lazy(() => import('~/demos/copy-button')),
  'code-fence': React.lazy(() => import('~/demos/code-fence')),
  'api-reference': React.lazy(() => import('~/demos/api-reference')),
  'mode-switcher': React.lazy(() => import('~/demos/mode-switcher')),
  'theme-selector': React.lazy(() => import('~/demos/theme-selector')),
  'theme-code-block': React.lazy(() => import('~/demos/theme-code-block')),
  'callout': React.lazy(() => import('~/demos/callout')),
  'search-button': React.lazy(() => import('~/demos/search-button')),
  'docs-copy-page': React.lazy(() => import('~/demos/docs-copy-page')),
  'docs-toc': React.lazy(() => import('~/demos/docs-toc')),
  'docs-sidebar': React.lazy(() => import('~/demos/docs-sidebar')),
  'docs-mobile-nav': React.lazy(() => import('~/demos/docs-mobile-nav')),
  'docs-header': React.lazy(() => import('~/demos/docs-header')),
  'docs-footer': React.lazy(() => import('~/demos/docs-footer')),
  'docs-provider': React.lazy(() => import('~/demos/docs-provider')),
  'active-theme': React.lazy(() => import('~/demos/active-theme')),
  'mdx-components': React.lazy(() => import('~/demos/mdx-components')),
  'not-found': React.lazy(() => import('~/demos/not-found')),
};
