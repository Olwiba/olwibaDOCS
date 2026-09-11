import * as React from 'react';
import { createRootRoute, HeadContent, Outlet, Scripts, useLoaderData, type NotFoundRouteProps } from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { ErrorPage } from '@/components/ErrorPage';
import { ActiveThemeProvider } from '@/components/ActiveTheme';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import {
  SearchDialog,
  type SearchDialogBrowsePage,
  type SearchDialogItem,
} from '@/components/SearchDialog';
import { type Theme } from '@/lib/themes';
import { buildDocsHead, type DocsRootMeta } from '@/lib/seo';

export type { DocsRootMeta } from '@/lib/seo';

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
  /** Quick links shown in search dialog when input is empty. */
  searchItems?: SearchDialogItem[];
  /** Browse pages shown when input is empty and no quick links are provided. */
  browsePages?: SearchDialogBrowsePage[];
  /**
   * Server-side alternative to `browsePages`. Runs in the root route loader
   * during SSR (result is dehydrated to the client), so implementations can
   * call a server fn that reads the fumadocs source without pulling its
   * node-only runtime into the client bundle. Ignored when `browsePages` is set.
   */
  browsePagesLoader?: () => Promise<SearchDialogBrowsePage[]>;
  /**
   * Whether search is available to this visitor. Called as a hook during
   * render, so it can read a session.
   *
   * Hiding the search *button* is not enough on a gated site: the provider
   * registers a Cmd+K handler, so search stays reachable by keyboard and will
   * happily list the titles of pages the visitor cannot open. Returning false
   * unmounts the dialog rather than hiding its trigger.
   *
   * Defaults to always-on, which is right for public docs.
   */
  useSearchEnabled?: () => boolean;
  /**
   * Inline scripts rendered first in <head>, before anything else.
   *
   * For configuration the app must have before its own bundle evaluates —
   * public env values, feature flags — which is the alternative to inlining
   * them at build time with a VITE_ prefix. A function rather than a string so
   * it is evaluated per render: on the server from the environment, in the
   * browser from whatever that first render already wrote, which is what keeps
   * the two markups identical through hydration.
   *
   * Trusted content, injected as-is. Escape anything that could contain a
   * closing script tag before returning it.
   */
  headScripts?: () => string[];
  notFoundComponent?: (props: NotFoundRouteProps) => React.ReactNode;
  /**
   * GA4 measurement ID, e.g. `G-XXXXXXXXXX`.
   *
   * Optional, and optional is the supported default: with nothing set, no
   * script is injected and no request reaches Google, so a site that has not
   * opted in carries no third party. Falls back to `VITE_GA_MEASUREMENT_ID`,
   * so most sites set the variable and pass nothing here.
   */
  gaMeasurementId?: string;
  /** Optional wrapper rendered around the full page body — use this to inject a root-level provider (e.g. OlwibaUIProvider). */
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

/** Default for `useSearchEnabled`: public docs search everything. */
function alwaysEnabled(): boolean {
  return true;
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
    browsePages,
    browsePagesLoader,
    searchItems,
    useSearchEnabled,
    headScripts,
    notFoundComponent,
    gaMeasurementId,
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
    const loaderData = useLoaderData({ from: '__root__' }) as
      | { browsePages?: SearchDialogBrowsePage[] }
      | undefined;
    const effectiveBrowsePages = browsePages ?? loaderData?.browsePages;
    const dialogItems = searchItems !== undefined && searchItems.length > 0 ? searchItems : undefined;
    const dialogBrowsePages =
      effectiveBrowsePages !== undefined && effectiveBrowsePages.length > 0 ? effectiveBrowsePages : undefined;
    // Resolved through a stable local so the hook call is unconditional —
    // `useSearchEnabled` comes from module-level config, never from state.
    const resolveSearchEnabled = useSearchEnabled ?? alwaysEnabled;
    const searchEnabled = resolveSearchEnabled();

    const SearchDialogComponent = React.useCallback(
      (props: React.ComponentProps<typeof SearchDialog>) => (
        <SearchDialog
          {...props}
          {...(dialogItems ? { items: dialogItems } : {})}
          {...(dialogBrowsePages ? { browsePages: dialogBrowsePages } : {})}
        />
      ),
      [dialogBrowsePages, dialogItems]
    );

    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          {headScripts?.().map((script, index) => (
            <script
              key={index}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: script }}
            />
          ))}
          <HeadContent />
        </head>
        <body className="flex min-h-screen flex-col antialiased [--header-height:3.5rem] [--footer-height:3.5rem]">
          <ActiveThemeProvider initialTheme={initialTheme}>
            <RootProvider
              search={
                searchEnabled ? { SearchDialog: SearchDialogComponent } : { enabled: false }
              }
            >
              <MaybeWrap wrapper={Wrapper}>
                {/* Inside the router, which it needs in order to count a route
                    change as a page view. Renders nothing when unconfigured. */}
                <GoogleAnalytics measurementId={gaMeasurementId} />
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
    loader: async () => ({
      browsePages: browsePagesLoader ? await browsePagesLoader() : undefined,
    }),
    head: () => {
      const head = buildDocsHead(meta);

      return {
        meta: head.meta,
        links: [
          { rel: 'stylesheet', href: cssUrl },
          ...head.links,
          ...favicons.map(({ rel, sizes, type, href }) => ({
            rel,
            ...(sizes && { sizes }),
            ...(type && { type }),
            href,
          })),
        ],
      };
    },
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

export function DocsErrorFallback({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] items-center justify-center p-6">
      <ErrorPage
        renderLink={({ href, children }) => <a href={href}>{children}</a>}
        backAction={{ label: 'Try again', onClick: reset }}
      />
    </div>
  );
}
