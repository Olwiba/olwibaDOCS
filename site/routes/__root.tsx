import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '~/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';
import { SearchDialog, type SearchDialogItem, type SearchDialogProps } from '@/components/SearchDialog';

const searchItems: SearchDialogItem[] = [
  { label: 'Get Started', href: '/docs' },
  { label: 'Components', href: '/docs/components' },
];

function DocsSearchDialog(props: SearchDialogProps) {
  return <SearchDialog items={searchItems} {...props} />;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'olwibaDOCS - Documentation Components for TanStack Start' },
      { name: 'description', content: 'Fumadocs abstraction for TanStack Start documentation sites. Build beautiful docs with ease.' },
      { property: 'og:title', content: 'olwibaDOCS' },
      { property: 'og:description', content: 'Documentation components for TanStack Start' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
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
        <RootProvider
          search={{
            SearchDialog: DocsSearchDialog,
          }}
        >
          <SiteHeader />
          <div className="mx-auto w-full max-w-[1400px] flex-1 border-r border-l border-dashed">
            {children}
          </div>
          <SiteFooter />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
