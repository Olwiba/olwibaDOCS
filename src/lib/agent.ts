/**
 * Agent-readable docs: a Markdown twin for every page, `llms.txt`, and HTTP
 * content negotiation, so an agent pointed at a docs site gets clean Markdown
 * instead of scraping rendered HTML.
 *
 * Server-only and React-free. Three pieces:
 *
 * - `docsMarkdownOptions` goes into the site's `source.config.ts` as
 *   `postprocess.includeProcessedMarkdown`, and decides how the docs' own MDX
 *   components read as Markdown (an API table, a code fence, or nothing).
 * - `docsAgentResponse` answers a docs page request with Markdown when the
 *   client asked for it (`.md` suffix, `?mode=agent`, or `Accept`), and returns
 *   null otherwise so the route falls through to the normal SSR page.
 * - `docsLlmsResponse` serves `/llms.txt` and `/llms-full.txt`.
 */
import type { LoaderOutput } from 'fumadocs-core/source';
import { llms } from 'fumadocs-core/source/llms';

/* ------------------------------------------------------------------------- */
/* Content negotiation (RFC 9110 12.5.1)                                      */
/* ------------------------------------------------------------------------- */

export type DocsRepresentation = 'html' | 'markdown';

const MEDIA: Record<DocsRepresentation, [string, string]> = {
  html: ['text', 'html'],
  markdown: ['text', 'markdown'],
};

interface AcceptEntry {
  type: string;
  sub: string;
  q: number;
}

function parseAccept(header: string): AcceptEntry[] {
  const entries: AcceptEntry[] = [];
  for (const raw of header.split(',')) {
    const [media, ...params] = raw.trim().split(';');
    if (!media) continue;
    const [type = '*', sub = '*'] = media.trim().toLowerCase().split('/');
    let q = 1;
    for (const param of params) {
      const [key, value] = param.trim().split('=');
      if (key?.trim().toLowerCase() === 'q') {
        const parsed = Number(value);
        q = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 1;
      }
    }
    entries.push({ type, sub, q });
  }
  return entries;
}

/** How closely an Accept range names a media type: 2 exact, 1 `type/*`, 0 `*\/*`, -1 no match. */
function specificity(entry: AcceptEntry, [type, sub]: [string, string]) {
  if (entry.type === type && entry.sub === sub) return 2;
  if (entry.type === type && entry.sub === '*') return 1;
  if (entry.type === '*' && entry.sub === '*') return 0;
  return -1;
}

/**
 * Picks the best representation the client accepts. Each offer takes the
 * quality of the most specific range that matches it, so `text/*;q=1,
 * text/markdown;q=0` rejects Markdown. Ties go to `fallback`, then to offer
 * order. Returns null when nothing offered is acceptable (a 406).
 */
export function selectRepresentation(
  accept: string | null | undefined,
  offered: DocsRepresentation[],
  fallback: DocsRepresentation,
): DocsRepresentation | null {
  if (!accept?.trim()) return fallback;
  const entries = parseAccept(accept);

  let best: DocsRepresentation | null = null;
  let bestQ = 0;
  let bestSpecificity = -1;
  for (const repr of offered) {
    let q = 0;
    let matched = -1;
    for (const entry of entries) {
      const s = specificity(entry, MEDIA[repr]);
      if (s > matched) {
        matched = s;
        q = entry.q;
      }
    }
    if (matched < 0 || q <= 0) continue;
    const better =
      q > bestQ ||
      (q === bestQ && matched > bestSpecificity) ||
      (q === bestQ && matched === bestSpecificity && repr === fallback);
    if (better) {
      best = repr;
      bestQ = q;
      bestSpecificity = matched;
    }
  }
  return best;
}

export type DocsRequestResolution =
  | { kind: 'markdown'; slugs: string[] }
  | { kind: 'html' }
  | { kind: 'not-acceptable' };

/**
 * Decides what a docs page request wants. `splat` is the route's catch-all
 * param (`components/button.md`, or undefined for the docs root).
 */
export function resolveDocsRepresentation(request: Request, splat: string | undefined): DocsRequestResolution {
  const raw = (splat ?? '').replace(/^\/+|\/+$/g, '');
  const toSlugs = (path: string) => (path === '' || path === 'index' ? [] : path.split('/'));

  if (raw.endsWith('.md')) return { kind: 'markdown', slugs: toSlugs(raw.slice(0, -3)) };
  if (new URL(request.url).searchParams.get('mode') === 'agent') return { kind: 'markdown', slugs: toSlugs(raw) };

  const chosen = selectRepresentation(request.headers.get('accept'), ['html', 'markdown'], 'html');
  if (chosen === null) return { kind: 'not-acceptable' };
  return chosen === 'markdown' ? { kind: 'markdown', slugs: toSlugs(raw) } : { kind: 'html' };
}

/* ------------------------------------------------------------------------- */
/* MDX components as Markdown                                                 */
/* ------------------------------------------------------------------------- */

interface JsxAttribute {
  type: string;
  name?: string;
  value?: string | { type: string; value: string } | null;
}

interface JsxNode {
  type: string;
  name?: string | null;
  attributes?: JsxAttribute[];
  data?: Record<string, unknown>;
}

/** Interactive previews that have nothing to say as text. */
const DROPPED_COMPONENTS = new Set(['ComponentPreview', 'Sandbox', 'InstallationTabs', 'DocsFeedback']);

function isJsx(node: JsxNode): boolean {
  return node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
}

function stringAttr(node: JsxNode, name: string): string | undefined {
  const attr = node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  return typeof attr?.value === 'string' ? attr.value : undefined;
}

/**
 * Reads a JSX expression attribute (`props={[...]}`, `` defaultCode={`...`} ``).
 * This runs while the site builds its own MDX, never on request input, so
 * evaluating the literal is safe; anything it cannot read becomes undefined.
 */
function expressionAttr(node: JsxNode, name: string): unknown {
  const attr = node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  const value = attr?.value;
  if (typeof value === 'string') return value;
  if (!value || value.type !== 'mdxJsxAttributeValueExpression') return undefined;
  try {
    return new Function(`return (${value.value});`)();
  } catch {
    return undefined;
  }
}

function cell(value: unknown, code = false): string {
  if (value === undefined || value === null || value === '') return '';
  const text = String(value).replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|');
  return code ? `\`${text}\`` : text;
}

interface ApiProp {
  name?: unknown;
  type?: unknown;
  default?: unknown;
  description?: unknown;
}

function apiReferenceMarkdown(node: JsxNode): string {
  const name = stringAttr(node, 'name') ?? 'Component';
  const extendsTag = stringAttr(node, 'extends');
  const props = expressionAttr(node, 'props');
  const lines = [`### ${name} props`];
  if (extendsTag) lines.push('', `Extends \`${extendsTag}\`.`);
  if (Array.isArray(props) && props.length > 0) {
    lines.push('', '| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
    for (const prop of props as ApiProp[]) {
      lines.push(`| ${cell(prop.name, true)} | ${cell(prop.type, true)} | ${cell(prop.default, true)} | ${cell(prop.description)} |`);
    }
  }
  return lines.join('\n');
}

function fence(code: unknown, language: string): string | undefined {
  if (typeof code !== 'string' || !code.trim()) return undefined;
  return `\`\`\`${language}\n${code.replace(/\n+$/, '')}\n\`\`\``;
}

/**
 * `remarkLLMs` replaces any `filterElement` it is given, and treats an empty
 * string from `stringify` as "not handled". The supported way to drop a tag is
 * this hint on the node: render its children only, which is nothing for a
 * self-closing preview.
 */
function childrenOnly(node: JsxNode): undefined {
  node.data = { ...node.data, _stringify: 'children-only' };
  return undefined;
}

/**
 * Pass as `postprocess.includeProcessedMarkdown` on the docs collection, so
 * `page.data.getText('processed')` is available at runtime. It is compiled in
 * at build time, which matters: production images do not ship `content/`, so
 * `getText('raw')` has no file to read there.
 */
export const docsMarkdownOptions = {
  /** `## Notes` rather than `## Notes [#notes]`; agents do not need anchors. */
  headingIds: false,
  // `unknown` so the options satisfy fumadocs' mdast `Nodes` signature without depending on mdast types.
  filterElement(input: unknown): boolean | 'children-only' {
    const node = input as JsxNode;
    if (!isJsx(node)) return true;
    if (node.name && DROPPED_COMPONENTS.has(node.name)) return false;
    if (node.name === 'APIReference' || node.name === 'LiveUsageCode' || node.name === 'CopyCommandButton') return true;
    return 'children-only';
  },
  stringify(input: unknown, ..._rest: unknown[]): string | undefined {
    const node = input as JsxNode;
    if (!isJsx(node)) return undefined;
    switch (node.name) {
      case 'APIReference':
        return apiReferenceMarkdown(node);
      case 'LiveUsageCode':
        return fence(expressionAttr(node, 'defaultCode'), 'tsx') ?? childrenOnly(node);
      case 'CopyCommandButton':
        return fence(stringAttr(node, 'command'), 'sh') ?? childrenOnly(node);
      default:
        // Wrappers keep their content; self-closing previews have none and vanish.
        return childrenOnly(node);
    }
  },
};

/* ------------------------------------------------------------------------- */
/* Responses                                                                  */
/* ------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySource = LoaderOutput<any>;

interface PageText {
  url: string;
  slugs?: string[];
  data: {
    title?: string;
    description?: string;
    getText?: (type: 'raw' | 'processed') => Promise<string>;
  };
}

function stripFrontmatter(text: string) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

async function pageBody(page: PageText): Promise<string> {
  const getText = page.data.getText;
  if (!getText) return '';
  try {
    return (await getText('processed')).trim();
  } catch {
    // Not built with docsMarkdownOptions; the raw MDX is still better than nothing.
    try {
      return stripFrontmatter(await getText('raw')).trim();
    } catch {
      return '';
    }
  }
}

/** One page as a standalone Markdown document: title, description, body. */
export async function renderPageMarkdown(page: PageText): Promise<string> {
  const parts = [`# ${page.data.title ?? page.url}`];
  if (page.data.description) parts.push(`> ${page.data.description}`);
  // Dropped previews leave blank runs behind; collapse them.
  const body = (await pageBody(page)).replace(/\n{3,}/g, '\n\n');
  if (body) parts.push(body);
  return `${parts.join('\n\n')}\n`;
}

/** `/docs/a` -> `/docs/a.md`; the docs root -> `/docs/index.md`, a path the catch-all route still sees. */
function markdownSibling(url: string, baseUrl = '/docs') {
  const path = url.replace(/\/+$/, '');
  const base = baseUrl.replace(/\/+$/, '');
  return path === base ? `${base}/index.md` : `${path}.md`;
}

/** RFC 8288 `Link` value advertising a page's Markdown twin and the site index. */
export function docsAlternateLinks(pageUrl: string, baseUrl = '/docs'): string {
  return [
    `<${markdownSibling(pageUrl, baseUrl)}>; rel="alternate"; type="text/markdown"`,
    '</llms.txt>; rel="describedby"; type="text/plain"',
  ].join(', ');
}

function textResponse(body: string, contentType: string, status = 200, link?: string) {
  const headers = new Headers({
    'Content-Type': `${contentType}; charset=utf-8`,
    Vary: 'Accept',
    'Cache-Control': 'public, max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  if (link) headers.set('Link', link);
  return new Response(body, { status, headers });
}

/**
 * Answers a docs page request with Markdown when the client asked for it, or
 * returns null so the route renders HTML. Wire it into the catch-all route:
 *
 * ```ts
 * server: {
 *   handlers: {
 *     GET: async ({ request, params, next }) => {
 *       const [{ docsAgentResponse }, { source }] = await Promise.all([
 *         import('@olwiba/docs/agent'),
 *         import('@/lib/source'),
 *       ]);
 *       return (await docsAgentResponse(source, request, params._splat)) ?? next();
 *     },
 *   },
 * },
 * ```
 */
export interface DocsAgentAccess {
  /**
   * Whether this request may read the page's content. Gated sites pass their
   * own entitlement check here. A denied page answers 403 with only its title
   * and description, which the locked HTML page already shows.
   */
  canRead?: (slugs: string[]) => boolean | Promise<boolean>;
  /** Shown on a denied page, e.g. where to sign in. */
  deniedMessage?: string;
}

export async function docsAgentResponse(
  source: AnySource,
  request: Request,
  splat: string | undefined,
  access: DocsAgentAccess = {},
): Promise<Response | null> {
  const resolution = resolveDocsRepresentation(request, splat);
  if (resolution.kind === 'html') return null;
  if (resolution.kind === 'not-acceptable') {
    return textResponse('This page is available as text/html or text/markdown.\n', 'text/plain', 406);
  }

  const page = source.getPage(resolution.slugs) as PageText | undefined;
  if (!page) return textResponse('# Not found\n\nSee /llms.txt for every page.\n', 'text/markdown', 404);
  const baseUrl = (source as { baseUrl?: string }).baseUrl ?? '/docs';
  const link = docsAlternateLinks(page.url, baseUrl);

  if (access.canRead && !(await access.canRead(resolution.slugs))) {
    const stub = [`# ${page.data.title ?? page.url}`];
    if (page.data.description) stub.push(`> ${page.data.description}`);
    stub.push(access.deniedMessage ?? 'This page requires access.');
    return textResponse(`${stub.join('\n\n')}\n`, 'text/markdown', 403, link);
  }
  return textResponse(await renderPageMarkdown(page), 'text/markdown', 200, link);
}

/** Rewrites `llms.txt` page links to their `.md` twins, so an agent can fetch each one as-is. */
export function linkLlmsToMarkdown(index: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  return index.replace(/\]\((\/[^)\s]*)\)/g, (match, path: string) => {
    if (path !== base && !path.startsWith(`${base}/`)) return match;
    if (path.endsWith('.md')) return match;
    return `](${path === base ? `${base}/index` : path.replace(/\/+$/, '')}.md)`;
  });
}

export interface DocsLlmsOptions {
  /** `llms-full.txt`: every page's Markdown in one file, instead of the linked index. */
  full?: boolean;
  /** Heading for the file. Defaults to the page tree's name. */
  title?: string;
  /** One-line summary under the heading: what the site is and when to use it. */
  description?: string;
  /** `llms-full.txt` only includes pages this allows. The index still lists every title. */
  canRead?: DocsAgentAccess['canRead'];
}

/** Serves `/llms.txt` (a linked index) or `/llms-full.txt` (everything inline). */
export async function docsLlmsResponse(source: AnySource, options: DocsLlmsOptions = {}): Promise<Response> {
  const baseUrl = (source as { baseUrl?: string }).baseUrl ?? '/docs';
  const header = [`# ${options.title ?? 'Documentation'}`, ...(options.description ? ['', `> ${options.description}`] : [])].join('\n');

  if (options.full) {
    const pages = source.getPages() as PageText[];
    const canRead = options.canRead;
    const readable = canRead
      ? (await Promise.all(pages.map(async (page) => ((await canRead(page.slugs ?? [])) ? page : null)))).filter(
          (page): page is PageText => page !== null,
        )
      : pages;
    const docs = await Promise.all(readable.map(renderPageMarkdown));
    return textResponse(`${header}\n\n${docs.join('\n---\n\n')}`, 'text/plain');
  }

  const index = linkLlmsToMarkdown(llms(source).index(), baseUrl);
  // fumadocs opens with its own `# <tree name>` heading; replace it with ours when given.
  const body = options.title ? index.replace(/^# .*\n+(> .*\n+)?/, '') : index;
  return textResponse(`${options.title ? `${header}\n\n` : ''}${body}\n`, 'text/plain');
}
