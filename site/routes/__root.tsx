import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '~/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { SearchDialog } from '@/components/SearchDialog';
import { ActiveThemeProvider } from '@/components/ActiveTheme';
import { Theme } from '@/lib/themes';
import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'olwibaDOCS - Documentation Components for TanStack Start' },
      { name: 'description', content: 'Fumadocs abstraction for TanStack Start documentation sites. Build beautiful docs with ease.' },
      { property: 'og:title', content: 'olwibaDOCS' },
      { property: 'og:description', content: 'Documentation components for TanStack Start' },
      { property: 'og:image', content: 'https://docs.olwiba.com/og-image.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon/favicon-48.png' },
      { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon/favicon-64.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
    </div>
  ),
});

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
        <ActiveThemeProvider initialTheme={Theme.Blue}>
          <RootProvider
            search={{
              SearchDialog,
            }}
          >
            <SiteHeader />
            <div className="flex flex-1 justify-center">
              <div className="w-4 shrink-0 border-dashed blueprint-pattern lg:w-12 lg:border-l" aria-hidden="true" />
              <div className="relative z-10 w-full max-w-[1400px] flex-1 border-l border-r border-dashed bg-background">
                {children}
              </div>
              <div className="w-4 shrink-0 border-dashed blueprint-pattern lg:w-12 lg:border-r" aria-hidden="true" />
            </div>
            <SiteFooter />
          </RootProvider>
        </ActiveThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
