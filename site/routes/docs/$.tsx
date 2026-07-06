import { createFileRoute, Link } from '@tanstack/react-router';
import { ErrorPage } from '@/components/ErrorPage';
import { buildDocsPageHead } from '@olwiba/docs';
import { siteMeta } from '~/lib/seo';

function DocsNotFound() {
  return (
    <div className="flex flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] items-center justify-center p-6">
      <ErrorPage
        renderLink={({ href, children }) => <Link to={href}>{children}</Link>}
        backAction={{ label: 'Go back', onClick: () => window.history.back() }}
      />
    </div>
  );
}
import browserCollections from 'fumadocs-mdx:collections/browser';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import { mdxComponents } from '@/lib/mdx-components';
import { ComponentPreview } from '~/components/ComponentPreview';
import { CopyCommandButton } from '@/components/CopyCommandButton';
import { type SidebarSection } from '@/components/DocsSidebar';
import { DocsLayout, type PageLoaderData } from '@/components/DocsLayout';
import { FeedbackSidebarItem } from '@/feedback/FeedbackSidebarItem';
import { getFeedbackConfig, submitFeedback } from '~/lib/feedback-server';
import { serverLoader } from './-loader';

const sidebarSections: SidebarSection[] = [
  { name: 'Get Started', href: '/docs' },
  { name: 'Builder', href: '/docs/builder' },
  { name: 'Themes', href: '/docs/themes' },
  { name: 'Status', href: '/docs/status' },
  { name: 'Reference', href: '/docs/components', enchanted: true },
];

export const Route = createFileRoute('/docs/$')({
  notFoundComponent: DocsNotFound,
  component: Page,
  head: ({ loaderData }) => buildDocsPageHead(siteMeta, loaderData as PageLoaderData),
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = (await serverLoader({ data: slugs })) as PageLoaderData;
    await clientLoader.preload(data.path);
    return data;
  },
});

const clientLoader = browserCollections.docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <div className="w-full flex-1">
        <MDX
          components={{
            ...defaultMdxComponents,
            ...mdxComponents,
            ComponentPreview,
            CopyCommandButton,
          }}
        />
      </div>
    );
  },
});

function Page() {
  const loaderData = Route.useLoaderData() as PageLoaderData;
  const data = useFumadocsLoader(loaderData);

  return (
    <DocsLayout
      loaderData={loaderData}
      pageTree={data.pageTree}
      sections={sidebarSections}
      sidebarBottomSlot={
        <FeedbackSidebarItem
          getConfig={() => getFeedbackConfig()}
          submit={(payload) => submitFeedback({ data: payload })}
        />
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        {clientLoader.useContent(data.path, undefined)}
      </Suspense>
    </DocsLayout>
  );
}
