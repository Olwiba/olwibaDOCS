import { createDocsRoot } from '@olwiba/docs';
import { ProjectThemeWrapper } from '~/components/ProjectThemeWrapper';
import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';
import { projectConfig } from '@/project.config';
import { siteMeta } from '~/lib/seo';
import appCss from '~/styles/app.css?url';
import { getBrowsePages } from '~/lib/browse-pages';

export const Route = createDocsRoot({
  meta: siteMeta,
  favicons: [
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32.png' },
    { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon/favicon-48.png' },
    { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon/favicon-64.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  ],
  header: SiteHeader,
  footer: SiteFooter,
  initialTheme: projectConfig.theme.initialDocsTheme,
  cssUrl: appCss,
  browsePagesLoader: () => getBrowsePages(),
  wrapper: ProjectThemeWrapper,
});
