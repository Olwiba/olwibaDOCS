import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { CopyButton } from '@/components/CopyButton';
import { builderComponents, builderComponentMap } from '~/builder/manifest';
import { generateBuilderCode, type BuilderBlock } from '~/builder/generate-code';

const STORAGE_KEY = 'olwiba-docs-builder-v1';

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
};

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
});

function BuilderPage() {
  const [query, setQuery] = React.useState('');
  const [blocks, setBlocks] = React.useState<BuilderBlock[]>([]);
  const [dropActive, setDropActive] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as BuilderBlock[];
      if (Array.isArray(parsed)) setBlocks(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return builderComponents;

    return builderComponents.filter((component) => {
      const searchText = [
        component.title,
        component.description,
        ...component.tags,
      ].join(' ').toLowerCase();
      return searchText.includes(normalizedQuery);
    });
  }, [query]);

  const generatedCode = React.useMemo(() => generateBuilderCode(blocks), [blocks]);

  const addBlock = React.useCallback((componentId: string) => {
    if (!builderComponentMap.has(componentId)) return;
    setBlocks((current) => [
      ...current,
      { componentId, instanceId: `${componentId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
    ]);
  }, []);

  const moveBlock = React.useCallback((from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    setBlocks((current) => {
      if (from >= current.length || to >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const removeBlock = React.useCallback((instanceId: string) => {
    setBlocks((current) => current.filter((block) => block.instanceId !== instanceId));
  }, []);

  const clearBlocks = React.useCallback(() => {
    setBlocks([]);
  }, []);

  return (
    <div className="flex min-h-[calc(100svh-var(--header-height)-var(--footer-height))] flex-1 flex-col p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag components from the left into the canvas, then copy generated code.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col rounded-lg border bg-background">
          <div className="border-b p-3">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components..."
              className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
            {filtered.map((component) => (
              <button
                key={component.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/olwiba-docs-component', component.id);
                  event.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => addBlock(component.id)}
                className="w-full rounded-md border p-3 text-left transition-colors hover:bg-muted"
              >
                <div className="text-sm font-medium">{component.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{component.description}</div>
              </button>
            ))}
            {!filtered.length && (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                No components match "{query}".
              </div>
            )}
          </div>
        </section>

        <Group orientation="vertical" className="min-h-0 rounded-lg border bg-background">
          <Panel defaultSize={60} minSize={35}>
            <section className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-medium">Canvas</h2>
                <button
                  type="button"
                  onClick={clearBlocks}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropActive(true);
                }}
                onDragLeave={() => setDropActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  const componentId = event.dataTransfer.getData('application/olwiba-docs-component');
                  if (componentId) addBlock(componentId);
                  setDropActive(false);
                }}
                className={[
                  'no-scrollbar flex-1 overflow-y-auto p-4 transition-colors',
                  dropActive ? 'bg-muted/60' : '',
                ].join(' ')}
              >
                {!blocks.length ? (
                  <div className="flex h-full min-h-52 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                    Drop components here
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map((block, index) => {
                      const component = builderComponentMap.get(block.componentId);
                      if (!component) return null;
                      const Demo = demos[component.demo];

                      return (
                        <div
                          key={block.instanceId}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData('application/olwiba-docs-canvas-index', String(index));
                            event.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            const fromIndex = Number(event.dataTransfer.getData('application/olwiba-docs-canvas-index'));
                            if (!Number.isNaN(fromIndex)) moveBlock(fromIndex, index);
                          }}
                          className="rounded-lg border"
                        >
                          <div className="flex items-center justify-between border-b px-3 py-2">
                            <div className="inline-flex items-center gap-2 text-sm font-medium">
                              <GripVertical className="size-4 text-muted-foreground" />
                              {component.title}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBlock(block.instanceId)}
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              Remove
                            </button>
                          </div>
                          <div className="p-4">
                            {Demo ? (
                              <React.Suspense fallback={<div className="text-sm text-muted-foreground">Loading demo...</div>}>
                                <Demo />
                              </React.Suspense>
                            ) : (
                              <div className="text-sm text-muted-foreground">Demo unavailable.</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </Panel>
          <Separator className="h-1 bg-border" />
          <Panel defaultSize={40} minSize={20}>
            <section className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-medium">Generated Code</h2>
                <CopyButton text={generatedCode} className="opacity-100" />
              </div>
              <pre className="no-scrollbar flex-1 overflow-auto bg-muted/40 p-4 text-xs leading-5">
                <code>{generatedCode}</code>
              </pre>
            </section>
          </Panel>
        </Group>
      </div>
    </div>
  );
}
