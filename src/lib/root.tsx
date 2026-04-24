import * as React from 'react';
import { createRootRoute, HeadContent, Outlet, Scripts, type NotFoundRouteProps } from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { ErrorPage } from '@/components/ErrorPage';
import { ActiveThemeProvider } from '@/components/ActiveTheme';
import { SearchDialog } from '@/components/SearchDialog';
import { type Theme } from '@/lib/themes';

export interface DocsRootMeta {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export interface DocsRootFavicon {
  rel: 'icon' | 'apple-touch-icon';
  sizes?: string;
  type?: string;
  href: string;
}

export interface DocsRootConfig {
  meta: DocsRootMeta;
  favicons?: DocsRootFavicon[];
  header: React.ComponentType;
  footer: React.ComponentType;
  initialTheme?: typeof Theme[keyof typeof Theme];
  cssUrl: string;
  notFoundComponent?: (props: NotFoundRouteProps) => React.ReactNode;
  /** Optional wrapper rendered around the full page body — use this to inject a root-level provider (e.g. OlwibaUIProvider). */
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

function MaybeWrap({
  wrapper: W,
  children,
}: {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  children: React.ReactNode;
}) {
  return W ? <W>{children}</W> : <>{children}</>;
}

export function createDocsRoot(config: DocsRootConfig) {
  const {
    meta,
    favicons = [],
    header: Header,
    footer: Footer,
    initialTheme,
    cssUrl,
    notFoundComponent,
    wrapper: Wrapper,
  } = config;

  function RootComponent() {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    );
  }

  function RootDocument({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className="flex min-h-screen flex-col antialiased [--header-height:3.5rem] [--footer-height:3.5rem]">
          <ActiveThemeProvider initialTheme={initialTheme}>
            <RootProvider search={{ SearchDialog }}>
              <MaybeWrap wrapper={Wrapper}>
                <Header />
                <div className="flex flex-1 justify-center overflow-x-clip">
                  <div className="w-4 shrink-0 border-dashed blueprint-pattern lg:w-12 lg:border-l" aria-hidden="true" />
                  <div className="relative z-10 min-w-0 max-w-[1600px] flex-1 border-l border-r border-dashed bg-background">
                    {children}
                  </div>
                  <div className="w-4 shrink-0 border-dashed blueprint-pattern lg:w-12 lg:border-r" aria-hidden="true" />
                </div>
                <Footer />
              </MaybeWrap>
            </RootProvider>
          </ActiveThemeProvider>
          <Scripts />
        </body>
      </html>
    );
  }

  return createRootRoute({
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: meta.title },
        ...(meta.description ? [{ name: 'description', content: meta.description }] : []),
        { property: 'og:title', content: meta.title },
        ...(meta.description ? [{ property: 'og:description', content: meta.description }] : []),
        ...(meta.ogImage ? [{ property: 'og:image', content: meta.ogImage }] : []),
        { property: 'og:type', content: meta.ogType ?? 'website' },
        { name: 'twitter:card', content: meta.twitterCard ?? 'summary_large_image' },
      ],
      links: [
        { rel: 'stylesheet', href: cssUrl },
        ...favicons.map(({ rel, sizes, type, href }) => ({
          rel,
          ...(sizes && { sizes }),
          ...(type && { type }),
          href,
        })),
      ],
    }),
    component: RootComponent,
    notFoundComponent: notFoundComponent ?? DocsNotFound,
  });
}

export function DocsNotFound() {
  return (
    <div className="flex flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] items-center justify-center p-6">
      <ErrorPage backAction={{ label: 'Go back', onClick: () => window.history.back() }} />
    </div>
  );
}

