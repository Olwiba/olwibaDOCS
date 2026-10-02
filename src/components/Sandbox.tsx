// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Folder,
  FolderOpen,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Smartphone,
  Sun,
  Tablet,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getSandboxDefinition } from './sandbox-registry';
import { CodeFence } from './CodeFence';
import { CopyButton } from './CopyButton';
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@olwiba/cn';


type SandboxViewport = 'desktop' | 'tablet' | 'mobile' | 'custom';
type SandboxMode = 'preview' | 'code';

type SandboxProps = {
  id: string;
  defaultMode?: SandboxMode;
  defaultViewport?: SandboxViewport;
  height?: number;
  shellPreview?: boolean;
};

type FileNode = {
  type: 'file';
  name: string;
  path: string;
};

type FolderNode = {
  type: 'folder';
  name: string;
  path: string;
  children: TreeNode[];
};

type TreeNode = FileNode | FolderNode;

// Demos render <SandboxControls> inside their own tree — inside the preview
// iframe, even — but the DOM is portaled to a strip below the preview frame.
// Example switches are documentation scaffolding: inside the frame they read
// as product chrome, which is exactly the wrong lesson for a page pattern.
const SandboxControlsContext = React.createContext<HTMLDivElement | null>(null);

export function SandboxControls({ children }: { children: React.ReactNode }) {
  const target = React.useContext(SandboxControlsContext);
  if (!target) return null;
  return createPortal(
    <div
      data-slot="sandbox-controls"
      className="border-t border-fd-border bg-fd-muted/20 px-4 py-3"
    >
      {children}
    </div>,
    target,
  );
}

type SandboxTheme = 'light' | 'dark';

// The theme a preview is showing: the site's, unless the toolbar toggle has
// set this sandbox apart. Demos that draw their own document (an email, a
// canvas) read it to match what is around them.
const SandboxThemeContext = React.createContext<SandboxTheme | null>(null);

/** The preview's light/dark theme inside a sandbox; null outside one. */
export function useSandboxTheme(): SandboxTheme | null {
  return React.useContext(SandboxThemeContext);
}

/**
 * The site's light/dark theme, followed live from the `dark` class on <html>.
 * Seeded light and corrected after mount, so server and client render alike.
 */
function useDocumentTheme(): SandboxTheme {
  const [theme, setTheme] = React.useState<SandboxTheme>('light');
  React.useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/**
 * Copies the parent's identified <style> elements into the preview, and keeps
 * them current. The active brand theme is one, injected and rewritten at
 * runtime, so a copy taken once at mount went stale on the first switch.
 */
function mirrorIdentifiedStyles(doc: Document) {
  const sources = Array.from(document.head.querySelectorAll<HTMLStyleElement>('style[id]'));
  const ids = new Set(sources.map((source) => source.id));
  for (const source of sources) {
    let copy = Array.from(
      doc.head.querySelectorAll<HTMLStyleElement>('style[data-sandbox-mirror]')
    ).find((node) => node.getAttribute('data-sandbox-mirror') === source.id);
    if (!copy) {
      copy = doc.createElement('style');
      copy.setAttribute('data-sandbox-mirror', source.id);
      doc.head.appendChild(copy);
    }
    if (copy.textContent !== source.textContent) copy.textContent = source.textContent;
  }
  for (const copy of Array.from(doc.head.querySelectorAll('style[data-sandbox-mirror]'))) {
    if (!ids.has(copy.getAttribute('data-sandbox-mirror') ?? '')) copy.remove();
  }
}

const viewportWidths: Record<Exclude<SandboxViewport, 'custom'>, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 390,
};

const IFRAME_PREVIEW_DOC = '<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><style>html,body{margin:0}#sandbox-root{display:flex;flex-direction:column}</style></head><body><div id="sandbox-root"></div></body></html>';

function IframePreview({
  children,
  className,
  autoHeight = false,
  themeOverride,
}: {
  children: React.ReactNode;
  className?: string;
  autoHeight?: boolean;
  /** Set when the toolbar holds this preview apart from the site's theme. */
  themeOverride: SandboxTheme | null;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);
  const [mountFailed, setMountFailed] = React.useState(false);
  const lastHeightRef = React.useRef(0);

  const setupIframeDocument = React.useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return false;
    const doc = iframe.contentDocument;
    if (!doc) return false;

    const root = doc.getElementById('sandbox-root');
    if (!root) return false;

    root.style.display = 'flex';
    root.style.flexDirection = 'column';

    if (!doc.head.querySelector('base')) {
      const base = doc.createElement('base');
      base.href = document.baseURI;
      doc.head.appendChild(base);
    }

    if (!doc.head.querySelector('[data-sandbox-styles="true"]')) {
      const marker = doc.createElement('meta');
      marker.setAttribute('data-sandbox-styles', 'true');
      doc.head.appendChild(marker);
      // Identified <style> elements are left to `mirrorIdentifiedStyles`,
      // which keeps them current instead of copying them once.
      const styleNodes = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style:not([id])')
      );
      for (const node of styleNodes) {
        doc.head.appendChild(node.cloneNode(true));
      }
    }

    setMountNode(root as HTMLElement);
    setMountFailed(false);
    return true;
  }, []);

  // The preview follows the page around it for as long as it is mounted, not
  // just at mount: classes and inline styles on <html> and <body>, and the
  // identified styles in <head>. Copying them once is why demos kept the theme
  // they loaded with when the site's was switched. An override from the
  // toolbar then sets the light/dark class over the copied one.
  React.useEffect(() => {
    if (!mountNode) return;
    const doc = mountNode.ownerDocument;
    const root = mountNode;

    const sync = () => {
      const html = doc.documentElement;
      const body = doc.body;
      const sourceHtml = document.documentElement;
      const sourceBody = document.body;

      html.className = sourceHtml.className;
      body.className = sourceBody.className;
      if (themeOverride) html.classList.toggle('dark', themeOverride === 'dark');

      const htmlStyle = sourceHtml.getAttribute('style');
      const bodyStyle = sourceBody.getAttribute('style');
      if (htmlStyle) html.setAttribute('style', htmlStyle);
      else html.removeAttribute('style');
      if (bodyStyle) body.setAttribute('style', bodyStyle);
      else body.removeAttribute('style');
      if (themeOverride) html.style.colorScheme = themeOverride;

      body.style.margin = '0';
      if (autoHeight) {
        // Content drives height: any forced 100% chain here would pin the
        // measured height to the iframe itself and go circular.
        html.style.height = '';
        body.style.height = '';
        body.style.minHeight = '';
        root.style.height = '';
        root.style.minHeight = '';
      } else {
        html.style.height = '100%';
        body.style.height = '100%';
        body.style.minHeight = '100%';
        root.style.height = '100%';
        root.style.minHeight = '100%';
      }

      mirrorIdentifiedStyles(doc);
    };

    sync();
    const observer = new MutationObserver(sync);
    const attributes = { attributes: true, attributeFilter: ['class', 'style'] };
    observer.observe(document.documentElement, attributes);
    observer.observe(document.body, attributes);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [mountNode, themeOverride, autoHeight]);

  React.useEffect(() => {
    let retries = 0;
    const maxRetries = 40;
    const timer = window.setInterval(() => {
      if (setupIframeDocument()) {
        window.clearInterval(timer);
        return;
      }
      retries += 1;
      if (retries >= maxRetries) {
        window.clearInterval(timer);
        setMountFailed(true);
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [setupIframeDocument]);

  React.useEffect(() => {
    if (!autoHeight || !mountNode) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const applyHeight = () => {
      const next = Math.ceil(mountNode.getBoundingClientRect().height);
      // Only write on change so a resize → reflow → resize loop can't form.
      if (next > 0 && next !== lastHeightRef.current) {
        lastHeightRef.current = next;
        iframe.style.height = `${next}px`;
      }
    };

    applyHeight();
    // Use the iframe's own ResizeObserver: observing across documents from
    // the parent window is not reliable in all engines.
    const ObserverCtor =
      mountNode.ownerDocument.defaultView?.ResizeObserver ?? ResizeObserver;
    const observer = new ObserverCtor(applyHeight);
    observer.observe(mountNode);
    return () => observer.disconnect();
  }, [autoHeight, mountNode]);

  return (
    // Marked so preview capture has a stable target. The demo itself lives in
    // an iframe, which a selector cannot reach into; screenshotting this
    // wrapper captures what the frame is displaying.
    <div
      data-slot="sandbox-preview"
      className={cn('relative w-full', !autoHeight && 'h-full', className)}
    >
      <iframe
        ref={iframeRef}
        className={cn('block w-full border-0 bg-transparent', !autoHeight && 'h-full')}
        onLoad={setupIframeDocument}
        sandbox="allow-same-origin allow-scripts allow-forms"
        srcDoc={IFRAME_PREVIEW_DOC}
        style={
          autoHeight
            ? { height: lastHeightRef.current ? `${lastHeightRef.current}px` : '288px' }
            : undefined
        }
        title="Sandbox preview"
      />
      {!mountNode && mountFailed ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Preview failed to mount inside iframe.
        </div>
      ) : null}
      {mountNode ? createPortal(children, mountNode) : null}
    </div>
  );
}

export function Sandbox({
  id,
  defaultMode = 'preview',
  defaultViewport = 'desktop',
  height,
  shellPreview = false,
}: SandboxProps) {
  const definition = getSandboxDefinition(id);

  const [mode, setMode] = React.useState<SandboxMode>(defaultMode);
  const [viewport, setViewport] = React.useState<SandboxViewport>(
    definition?.defaultViewport ?? defaultViewport
  );
  const [activeFilePath, setActiveFilePath] = React.useState<string>(
    definition?.files[0]?.path ?? ''
  );
  const [customWidth, setCustomWidth] = React.useState<number>(960);
  const [isResizing, setIsResizing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [sidebarWidth, setSidebarWidth] = React.useState(280);
  const [isSidebarResizing, setIsSidebarResizing] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [collapsedFolders, setCollapsedFolders] = React.useState<Set<string>>(
    new Set()
  );
  const [isExpanded, setIsExpanded] = React.useState(false);
  const siteTheme = useDocumentTheme();
  const [themeOverride, setThemeOverride] = React.useState<SandboxTheme | null>(null);
  // Switching the site's theme clears the override, so every preview follows
  // the toggle the visitor just used rather than a choice made earlier.
  React.useEffect(() => {
    setThemeOverride(null);
  }, [siteTheme]);
  const previewTheme = themeOverride ?? siteTheme;
  const [isMounted, setIsMounted] = React.useState(false);
  const [controlsTarget, setControlsTarget] = React.useState<HTMLDivElement | null>(null);
  const codeLayoutRef = React.useRef<HTMLDivElement | null>(null);

  const handlePointerMove = React.useCallback((event: PointerEvent) => {
    if (!isResizing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const nextWidth = Math.max(360, Math.min(relativeX, rect.width));
    setCustomWidth(Math.floor(nextWidth));
  }, [isResizing]);

  const handlePointerUp = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleSidebarPointerMove = React.useCallback(
    (event: PointerEvent) => {
      if (!isSidebarResizing || !codeLayoutRef.current) return;
      const rect = codeLayoutRef.current.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const nextWidth = Math.max(180, Math.min(relativeX, rect.width - 240));
      setSidebarWidth(Math.floor(nextWidth));
    },
    [isSidebarResizing]
  );

  const handleSidebarPointerUp = React.useCallback(() => {
    setIsSidebarResizing(false);
  }, []);

  React.useEffect(() => {
    if (!isResizing) return;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp, isResizing]);

  React.useEffect(() => {
    if (!isSidebarResizing) return;
    window.addEventListener('pointermove', handleSidebarPointerMove);
    window.addEventListener('pointerup', handleSidebarPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleSidebarPointerMove);
      window.removeEventListener('pointerup', handleSidebarPointerUp);
    };
  }, [handleSidebarPointerMove, handleSidebarPointerUp, isSidebarResizing]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!definition) return;
    setActiveFilePath(definition.files[0]?.path ?? '');
    setViewport(definition.defaultViewport ?? defaultViewport);
    setCollapsedFolders(new Set());
    setIsSidebarCollapsed(false);
  }, [defaultViewport, definition]);

  React.useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isExpanded]);

  if (!definition) {
    return (
      <div className="not-prose my-6 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Sandbox not found: <code>{id}</code>
      </div>
    );
  }

  const activeFile = definition.files.find((file) => file.path === activeFilePath);
  const Preview = definition.preview;
  const fileTree = React.useMemo<TreeNode[]>(() => {
    type InternalFolder = {
      type: 'folder';
      name: string;
      path: string;
      folders: Map<string, InternalFolder>;
      files: FileNode[];
    };

    const root: InternalFolder = {
      type: 'folder',
      name: '',
      path: '',
      folders: new Map(),
      files: [],
    };

    for (const file of definition.files) {
      const parts = file.path.split('/').filter(Boolean);
      let current = root;

      for (let i = 0; i < parts.length - 1; i += 1) {
        const part = parts[i];
        const nextPath = current.path ? `${current.path}/${part}` : part;
        const existing = current.folders.get(part);
        if (existing) {
          current = existing;
          continue;
        }
        const created: InternalFolder = {
          type: 'folder',
          name: part,
          path: nextPath,
          folders: new Map(),
          files: [],
        };
        current.folders.set(part, created);
        current = created;
      }

      const fileName = parts[parts.length - 1] ?? file.path;
      current.files.push({
        type: 'file',
        name: fileName,
        path: file.path,
      });
    }

    const toTree = (folder: InternalFolder): TreeNode[] => {
      const folders: FolderNode[] = Array.from(folder.folders.values())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((child) => ({
          type: 'folder',
          name: child.name,
          path: child.path,
          children: toTree(child),
        }));

      const files = [...folder.files].sort((a, b) => a.name.localeCompare(b.name));
      return [...folders, ...files];
    };

    return toTree(root);
  }, [definition.files]);

  const maxWidth = containerRef.current?.clientWidth ?? viewportWidths.desktop;
  const previewWidth =
    viewport === 'custom'
      ? Math.max(360, Math.min(customWidth, maxWidth))
      : viewport === 'desktop'
        ? undefined
        : Math.min(viewportWidths[viewport], maxWidth);
  const previewHeight = height ?? (shellPreview ? 640 : undefined);
  // Expanded is a near-fullscreen surface, so a fixed-height frame strands
  // vertical space at every viewport preset. Fixed-height previews stretch to
  // the modal instead; auto-height ones keep growing and scrolling the wrapper.
  const fillsExpandedHeight = isExpanded && previewHeight !== undefined;

  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const renderTree = (nodes: TreeNode[], depth = 0): React.ReactNode =>
    nodes.map((node) => {
      if (node.type === 'folder') {
        const isCollapsed = collapsedFolders.has(node.path);
        return (
          <div key={node.path}>
            <button
              className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              onClick={() => toggleFolder(node.path)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              type="button"
            >
              {isCollapsed ? (
                <ChevronRight className="size-3 shrink-0" />
              ) : (
                <ChevronDown className="size-3 shrink-0" />
              )}
              {isCollapsed ? (
                <Folder className="size-3 shrink-0" />
              ) : (
                <FolderOpen className="size-3 shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </button>
            {!isCollapsed ? renderTree(node.children, depth + 1) : null}
          </div>
        );
      }

      return (
        <button
          className={cn(
            'flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
            activeFilePath === node.path
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
          )}
          key={node.path}
          onClick={() => setActiveFilePath(node.path)}
          style={{ paddingLeft: `${depth * 12 + 24}px` }}
          type="button"
        >
          <FileText className="size-3 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
      );
    });

  const panel = (
    <SandboxControlsContext.Provider value={controlsTarget}>
    <div
      className={cn(
        'not-prose my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-background',
        isExpanded &&
          'fixed inset-4 z-[210] my-0 flex h-auto max-h-none flex-col rounded-xl shadow-2xl'
      )}
    >
        <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-3">
          {/* Wraps below lg. The viewport group is absolutely centred on wide
              screens, which reserves no width — so on a phone its four buttons
              simply overflowed the toolbar and dragged the page into
              horizontal scroll. Below lg it rejoins the flow as a full-width
              row of its own, where it fits. */}
          <div className="relative flex flex-wrap items-center justify-between gap-2">
            <div className="shrink-0">
              <Tabs
                className="m-0"
                value={mode}
                onValueChange={(value: string) => setMode(value as SandboxMode)}
              >
                <TabsList className="h-8">
                  <TabsTrigger className="h-7 px-2 text-xs" value="preview">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger className="h-7 px-2 text-xs" value="code">
                    <Code2 className="mr-1 size-3" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="order-last w-full lg:pointer-events-none lg:absolute lg:left-1/2 lg:order-none lg:w-auto lg:-translate-x-1/2">
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => setViewport('desktop')}
                size="sm"
                variant={viewport === 'desktop' ? 'default' : 'outline'}
              >
                <Monitor className="size-3" />
                Desktop
              </Button>
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => setViewport('tablet')}
                size="sm"
                variant={viewport === 'tablet' ? 'default' : 'outline'}
              >
                <Tablet className="size-3" />
                Tablet
              </Button>
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => setViewport('mobile')}
                size="sm"
                variant={viewport === 'mobile' ? 'default' : 'outline'}
              >
                <Smartphone className="size-3" />
                Mobile
              </Button>
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => setViewport('custom')}
                size="sm"
                variant={viewport === 'custom' ? 'default' : 'outline'}
              >
                Custom
              </Button>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {mode === 'preview' ? (
                <Button
                  aria-label={
                    previewTheme === 'dark' ? 'Preview in light mode' : 'Preview in dark mode'
                  }
                  className="h-7 px-2 text-xs"
                  onClick={() => setThemeOverride(previewTheme === 'dark' ? 'light' : 'dark')}
                  size="sm"
                  title={previewTheme === 'dark' ? 'Preview in light mode' : 'Preview in dark mode'}
                  variant="outline"
                >
                  {themeOverride ? (
                    themeOverride === 'dark' ? (
                      <Sun className="size-3" />
                    ) : (
                      <Moon className="size-3" />
                    )
                  ) : (
                    // Following the site, the icon follows its `dark` class in
                    // CSS, so it is right on the first frame rather than after
                    // the theme is read on mount.
                    <>
                      <Sun className="hidden size-3 dark:block" />
                      <Moon className="size-3 dark:hidden" />
                    </>
                  )}
                </Button>
              ) : null}
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => setIsExpanded((value) => !value)}
                size="sm"
                variant="outline"
              >
                {isExpanded ? (
                  <Minimize2 className="size-3" />
                ) : (
                  <Maximize2 className="size-3" />
                )}
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </div>
        </div>

        {mode === 'preview' ? (
          <>
          <div
            className={cn(
              'relative overflow-x-auto bg-fd-background p-4',
              isExpanded && 'flex-1 overflow-y-auto',
              fillsExpandedHeight && 'flex min-h-0 flex-col overflow-y-hidden'
            )}
          >
            <div
              className={cn(
                'mx-auto min-w-[360px]',
                fillsExpandedHeight && 'flex min-h-0 w-full flex-1 flex-col'
              )}
              ref={containerRef}
            >
              <div
                className={cn(
                  'relative mx-auto rounded-md border border-fd-border bg-background transition-[width]',
                  'min-h-[320px] overflow-hidden',
                  shellPreview ? 'p-0' : 'p-4',
                  isResizing && 'select-none',
                  fillsExpandedHeight && 'min-h-0 flex-1'
                )}
                style={{
                  width: previewWidth === undefined ? '100%' : `${previewWidth}px`,
                  ...(previewHeight && !fillsExpandedHeight
                    ? { height: `${previewHeight}px` }
                    : {}),
                }}
              >
                <IframePreview
                  autoHeight={!previewHeight}
                  className={cn(
                    'w-full',
                    previewHeight &&
                      (shellPreview ? 'h-full min-h-0 overflow-hidden' : 'h-full')
                  )}
                  themeOverride={themeOverride}
                >
                  <SandboxThemeContext.Provider value={previewTheme}>
                    <React.Suspense
                      fallback={
                        <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
                          Loading preview...
                        </div>
                      }
                    >
                      <Preview />
                    </React.Suspense>
                  </SandboxThemeContext.Provider>
                </IframePreview>

                {viewport === 'custom' ? (
                  <button
                    aria-label="Resize preview width"
                    className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-transparent"
                    onPointerDown={() => setIsResizing(true)}
                    type="button"
                  />
                ) : null}
              </div>
            </div>
            </div>
            <div className="shrink-0" ref={setControlsTarget} />
          </>
        ) : (
          <div
            className={cn(
              'flex min-h-[320px] bg-fd-background',
              isExpanded ? 'h-[calc(100vh-8.5rem)]' : 'h-[620px]'
            )}
            ref={codeLayoutRef}
          >
            <aside
              className="h-full overflow-auto border-r border-fd-border p-2"
              style={{ width: isSidebarCollapsed ? 46 : sidebarWidth }}
            >
              <div className="mb-1 flex items-center justify-between px-1 py-1">
                {!isSidebarCollapsed ? (
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Files
                  </span>
                ) : (
                  <span />
                )}
                <Button
                  className="h-6 w-6 p-0"
                  onClick={() => setIsSidebarCollapsed((value) => !value)}
                  size="sm"
                  variant="ghost"
                >
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen className="size-3.5" />
                  ) : (
                    <PanelLeftClose className="size-3.5" />
                  )}
                </Button>
              </div>
              {!isSidebarCollapsed ? renderTree(fileTree) : null}
            </aside>

            {!isSidebarCollapsed ? (
              <button
                aria-label="Resize file sidebar"
                className="w-1 cursor-ew-resize bg-fd-border/70 hover:bg-primary/50"
                onPointerDown={() => setIsSidebarResizing(true)}
                type="button"
              />
            ) : null}

            <div className="min-w-0 flex flex-1 flex-col overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-fd-border px-4 py-2 text-xs text-muted-foreground">
                <span className="truncate">{activeFile?.path ?? 'Select a file'}</span>
                {activeFile ? (
                  <CopyButton
                    className="size-6 opacity-100"
                    text={activeFile.code}
                  />
                ) : null}
              </div>
              <div className="min-h-0 flex-1">
                <CodeFence
                  className="sandbox-editor-code !my-0 h-full rounded-none border-0 shadow-none"
                  code={activeFile?.code ?? '// No file selected'}
                  language={activeFile?.language ?? 'tsx'}
                  preClassName="h-full overflow-auto !px-0 !py-3"
                  codeWrapClassName="inline-block min-w-full pr-2"
                  showCopyButton={false}
                  showLineNumbers
                />
              </div>
            </div>
          </div>
        )}
    </div>
    </SandboxControlsContext.Provider>
  );

  if (isExpanded && isMounted) {
    return createPortal(
      <>
        <button
          aria-label="Close expanded sandbox"
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[1px]"
          onClick={() => setIsExpanded(false)}
          type="button"
        />
        {panel}
      </>,
      document.body
    );
  }

  return panel;
}
