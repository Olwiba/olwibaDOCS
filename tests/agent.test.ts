import { describe, expect, it } from 'vitest';
import {
  docsAgentResponse,
  docsAlternateLinks,
  docsLlmsResponse,
  docsMarkdownOptions,
  linkLlmsToMarkdown,
  resolveDocsRepresentation,
  selectRepresentation,
} from '../src/lib/agent';

function request(url: string, accept?: string) {
  return new Request(url, accept ? { headers: { accept } } : undefined);
}

function jsx(name: string, attributes: Array<{ name: string; value: string; expression?: boolean }>) {
  return {
    type: 'mdxJsxFlowElement',
    name,
    attributes: attributes.map((a) => ({
      type: 'mdxJsxAttribute',
      name: a.name,
      value: a.expression ? { type: 'mdxJsxAttributeValueExpression', value: a.value } : a.value,
    })),
    children: [],
  } as never;
}

const stringify = (node: never) => docsMarkdownOptions.stringify!(node, undefined, {} as never, {} as never, undefined);
const keep = (node: never) => docsMarkdownOptions.filterElement!(node);

describe('selectRepresentation', () => {
  it('falls back when there is no Accept header or it is a wildcard', () => {
    expect(selectRepresentation(null, ['html', 'markdown'], 'html')).toBe('html');
    expect(selectRepresentation('*/*', ['html', 'markdown'], 'html')).toBe('html');
  });

  it('picks markdown when an agent asks for it', () => {
    expect(selectRepresentation('text/markdown', ['html', 'markdown'], 'html')).toBe('markdown');
    expect(selectRepresentation('text/markdown, text/html;q=0.5', ['html', 'markdown'], 'html')).toBe('markdown');
  });

  it('honours quality values instead of substring matching', () => {
    expect(selectRepresentation('text/html, text/markdown;q=0', ['html', 'markdown'], 'html')).toBe('html');
    expect(selectRepresentation('text/html;q=0.4, text/markdown;q=0.9', ['html', 'markdown'], 'html')).toBe('markdown');
  });

  it('prefers the more specific range on a tie', () => {
    expect(selectRepresentation('text/*, text/markdown', ['html', 'markdown'], 'html')).toBe('markdown');
  });

  it('returns null when nothing offered is acceptable', () => {
    expect(selectRepresentation('application/pdf', ['html', 'markdown'], 'html')).toBeNull();
    expect(selectRepresentation('text/html;q=0, text/markdown;q=0', ['html', 'markdown'], 'html')).toBeNull();
  });
});

describe('resolveDocsRepresentation', () => {
  it('serves markdown for a .md suffix and strips it from the slugs', () => {
    expect(resolveDocsRepresentation(request('https://x.dev/docs/components/button.md'), 'components/button.md')).toEqual({
      kind: 'markdown',
      slugs: ['components', 'button'],
    });
  });

  it('serves markdown for ?mode=agent and for Accept: text/markdown', () => {
    expect(resolveDocsRepresentation(request('https://x.dev/docs/a?mode=agent'), 'a')).toEqual({ kind: 'markdown', slugs: ['a'] });
    expect(resolveDocsRepresentation(request('https://x.dev/docs/a', 'text/markdown'), 'a')).toEqual({ kind: 'markdown', slugs: ['a'] });
  });

  it('treats the docs root as the index page', () => {
    expect(resolveDocsRepresentation(request('https://x.dev/docs/index.md'), 'index.md')).toEqual({ kind: 'markdown', slugs: [] });
    expect(resolveDocsRepresentation(request('https://x.dev/docs', 'text/markdown'), undefined)).toEqual({ kind: 'markdown', slugs: [] });
  });

  it('leaves browsers on HTML and reports an unsatisfiable Accept', () => {
    expect(resolveDocsRepresentation(request('https://x.dev/docs/a', 'text/html,*/*;q=0.8'), 'a').kind).toBe('html');
    expect(resolveDocsRepresentation(request('https://x.dev/docs/a', 'application/pdf'), 'a').kind).toBe('not-acceptable');
  });
});

describe('docsMarkdownOptions', () => {
  it('renders APIReference as a props table', () => {
    const out = stringify(
      jsx('APIReference', [
        { name: 'name', value: 'Button' },
        { name: 'extends', value: 'button' },
        {
          name: 'props',
          expression: true,
          value: `[{ name: "variant", type: '"default" | "outline"', default: '"default"', description: 'Visual style.' }, { name: "asChild", type: "boolean" }]`,
        },
      ]),
    );
    expect(out).toContain('### Button props');
    expect(out).toContain('Extends `button`.');
    expect(out).toContain('| `variant` | `"default" \\| "outline"` | `"default"` | Visual style. |');
    expect(out).toContain('| `asChild` | `boolean` |  |  |');
  });

  it('renders LiveUsageCode and CopyCommandButton as code fences', () => {
    expect(
      stringify(jsx('LiveUsageCode', [{ name: 'name', value: 'x' }, { name: 'defaultCode', expression: true, value: '`<Button>\\n  Hi\\n</Button>`' }])),
    ).toBe('```tsx\n<Button>\n  Hi\n</Button>\n```');
    expect(stringify(jsx('CopyCommandButton', [{ name: 'command', value: 'bun add @olwiba/ui' }]))).toBe('```sh\nbun add @olwiba/ui\n```');
  });

  it('drops interactive previews and unwraps other components', () => {
    expect(keep(jsx('ComponentPreview', [{ name: 'name', value: 'button' }]))).toBe(false);
    expect(keep(jsx('APIReference', []))).toBe(true);

    // remarkLLMs ignores filterElement, so stringify marks the node instead.
    const preview = jsx('Sandbox', [{ name: 'id', value: 'x' }]) as { data?: Record<string, unknown> };
    expect(stringify(preview as never)).toBeUndefined();
    expect(preview.data?._stringify).toBe('children-only');

    const wrapper = jsx('div', [{ name: 'className', value: 'flex' }]) as { data?: Record<string, unknown> };
    stringify(wrapper as never);
    expect(wrapper.data?._stringify).toBe('children-only');

    expect(stringify({ type: 'paragraph', children: [] } as never)).toBeUndefined();
  });

  it('degrades to nothing rather than throwing on an expression it cannot read', () => {
    expect(stringify(jsx('APIReference', [{ name: 'name', value: 'X' }, { name: 'props', expression: true, value: 'notDefined' }]))).toBe(
      '### X props',
    );
  });
});

describe('linkLlmsToMarkdown', () => {
  it('points page links at their markdown twins and leaves external links alone', () => {
    const index = '- [Button](/docs/components/button): A button\n- [Docs](/docs)\n- [Site](https://example.com)';
    expect(linkLlmsToMarkdown(index, '/docs')).toBe(
      '- [Button](/docs/components/button.md): A button\n- [Docs](/docs/index.md)\n- [Site](https://example.com)',
    );
  });
});

describe('docsAlternateLinks', () => {
  it('advertises the markdown twin, using index.md for the docs root', () => {
    expect(docsAlternateLinks('/docs/components/button')).toContain('</docs/components/button.md>; rel="alternate"; type="text/markdown"');
    expect(docsAlternateLinks('/docs')).toContain('</docs/index.md>; rel="alternate"');
    expect(docsAlternateLinks('/docs')).toContain('</llms.txt>; rel="describedby"');
  });
});

describe('gated pages', () => {
  const pages = [
    { url: '/docs/free', slugs: ['free'], data: { title: 'Free', description: 'Open page', getText: async () => 'free body' } },
    { url: '/docs/pro', slugs: ['pro'], data: { title: 'Pro', description: 'Paid page', getText: async () => 'secret body' } },
  ];
  const source = {
    baseUrl: '/docs',
    getPage: (slugs: string[]) => pages.find((p) => p.slugs.join('/') === slugs.join('/')),
    getPages: () => pages,
  } as never;
  const canRead = (slugs: string[]) => slugs[0] !== 'pro';

  it('serves readable pages in full', async () => {
    const res = await docsAgentResponse(source, request('https://x.dev/docs/free.md'), 'free.md', { canRead });
    expect(res?.status).toBe(200);
    expect(await res?.text()).toContain('free body');
  });

  it('answers a denied page with a 403 stub that never contains the body', async () => {
    const res = await docsAgentResponse(source, request('https://x.dev/docs/pro.md'), 'pro.md', { canRead, deniedMessage: 'Sign in.' });
    const text = await res!.text();
    expect(res!.status).toBe(403);
    expect(text).toContain('# Pro');
    expect(text).toContain('Sign in.');
    expect(text).not.toContain('secret body');
  });

  it('leaves denied pages out of llms-full.txt', async () => {
    const text = await (await docsLlmsResponse(source, { full: true, canRead })).text();
    expect(text).toContain('free body');
    expect(text).not.toContain('secret body');
  });
});
