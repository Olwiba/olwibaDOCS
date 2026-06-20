export interface DocsRootMeta {
  title: string;
  description?: string;
  /** Production origin, e.g. https://docs.example.com. Enables canonical and og:url. */
  siteUrl?: string;
  /** Defaults to siteUrl when provided. */
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  siteName?: string;
  locale?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  keywords?: string | string[];
  author?: string;
  robots?: string;
}

export interface DocsPageSeoData {
  url?: string;
  frontmatter?: {
    title?: string;
    description?: string;
    ogImage?: string;
    image?: string;
  };
}

type MetaTag =
  | { charSet: string }
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

type LinkTag = { rel: string; href: string; [key: string]: string };

function compact<T>(items: Array<T | '' | false | null | undefined>) {
  return items.filter(Boolean) as T[];
}

function joinUrl(base: string | undefined, path: string | undefined) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (!base) return path;

  const cleanBase = base.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

function normaliseCanonical(url: string | undefined) {
  if (!url) return undefined;
  return url.replace(/\/$/, '') || url;
}

function serialiseKeywords(keywords: string | string[] | undefined) {
  return Array.isArray(keywords) ? keywords.join(', ') : keywords;
}

export function buildDocsMetaTags(meta: DocsRootMeta): MetaTag[] {
  const canonicalUrl = normaliseCanonical(meta.canonicalUrl ?? meta.siteUrl);
  const ogImage = joinUrl(meta.siteUrl, meta.ogImage);
  const keywords = serialiseKeywords(meta.keywords);

  return compact<MetaTag>([
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: meta.title },
    meta.description && { name: 'description', content: meta.description },
    meta.robots && { name: 'robots', content: meta.robots },
    keywords && { name: 'keywords', content: keywords },
    meta.author && { name: 'author', content: meta.author },
    { property: 'og:title', content: meta.title },
    meta.description && { property: 'og:description', content: meta.description },
    canonicalUrl && { property: 'og:url', content: canonicalUrl },
    meta.siteName && { property: 'og:site_name', content: meta.siteName },
    meta.locale && { property: 'og:locale', content: meta.locale },
    ogImage && { property: 'og:image', content: ogImage },
    ogImage && { property: 'og:image:width', content: '1200' },
    ogImage && { property: 'og:image:height', content: '630' },
    meta.ogImageAlt && { property: 'og:image:alt', content: meta.ogImageAlt },
    { property: 'og:type', content: meta.ogType ?? 'website' },
    { name: 'twitter:card', content: meta.twitterCard ?? 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    meta.description && { name: 'twitter:description', content: meta.description },
    ogImage && { name: 'twitter:image', content: ogImage },
    meta.ogImageAlt && { name: 'twitter:image:alt', content: meta.ogImageAlt },
    meta.twitterSite && { name: 'twitter:site', content: meta.twitterSite },
    meta.twitterCreator && { name: 'twitter:creator', content: meta.twitterCreator },
  ]);
}

export function buildDocsLinkTags(meta: DocsRootMeta): LinkTag[] {
  const canonicalUrl = normaliseCanonical(meta.canonicalUrl ?? meta.siteUrl);
  return compact<LinkTag>([canonicalUrl && { rel: 'canonical', href: canonicalUrl }]);
}

export function buildDocsHead(meta: DocsRootMeta) {
  return {
    meta: buildDocsMetaTags(meta),
    links: buildDocsLinkTags(meta),
  };
}

export function buildDocsPageHead(rootMeta: DocsRootMeta, page: DocsPageSeoData) {
  const pageTitle = page.frontmatter?.title;
  const title = pageTitle && pageTitle !== rootMeta.title ? `${pageTitle} | ${rootMeta.title}` : rootMeta.title;
  const description = page.frontmatter?.description ?? rootMeta.description;
  const pageUrl = joinUrl(rootMeta.siteUrl, page.url);
  const ogImage = page.frontmatter?.ogImage ?? page.frontmatter?.image ?? rootMeta.ogImage;

  return buildDocsHead({
    ...rootMeta,
    title,
    description,
    canonicalUrl: pageUrl ?? rootMeta.canonicalUrl,
    ogImage,
    ogType: 'article',
  });
}
