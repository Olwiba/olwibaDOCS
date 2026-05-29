'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

const demos: Record<string, React.LazyExoticComponent<React.FC>> = {
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

const ControlsPortalContext = React.createContext<HTMLDivElement | null>(null);

export function DemoControls({ children }: { children: React.ReactNode }) {
  const target = React.useContext(ControlsPortalContext);
  if (!target) return null;
  return createPortal(
    <div className="border-t border-fd-border px-6 py-4">
      {children}
    </div>,
    target,
  );
}

interface ComponentPreviewProps {
  name: string;
  title?: string;
}

export function ComponentPreview({ name, title }: ComponentPreviewProps) {
  const Demo = demos[name];
  const [portalTarget, setPortalTarget] = React.useState<HTMLDivElement | null>(null);

  return (
    <ControlsPortalContext.Provider value={portalTarget}>
      <div className="border border-dashed border-fd-border rounded-lg overflow-visible not-prose my-6">
        {title && (
          <div className="px-4 py-2 border-b border-fd-border bg-fd-muted/50">
            <span className="text-sm text-fd-muted-foreground">{title}</span>
          </div>
        )}
        <div
          data-slot="component-preview-canvas"
          className="p-8 bg-fd-background flex items-center justify-center min-h-[200px]"
        >
          {Demo ? (
            <React.Suspense fallback={<div className="text-fd-muted-foreground">Loading...</div>}>
              <Demo />
            </React.Suspense>
          ) : (
            <p className="text-fd-muted-foreground">Demo coming soon for: {name}</p>
          )}
        </div>
        <div ref={setPortalTarget} />
      </div>
    </ControlsPortalContext.Provider>
  );
}
