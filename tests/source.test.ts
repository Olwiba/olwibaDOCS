import { describe, expect, it, vi } from 'vitest';

const loaderMock = vi.fn((options: unknown) => options);
const lucidePlugin = { name: 'lucide-icons' };
const existingPlugin = { name: 'existing-plugin' };

vi.mock('fumadocs-core/source', () => ({
  loader: loaderMock,
}));

vi.mock('fumadocs-core/source/lucide-icons', () => ({
  lucideIconsPlugin: vi.fn(() => lucidePlugin),
}));

describe('createSource', () => {
  it('prepends the lucide icons plugin before existing plugins', async () => {
    const { createSource } = await import('../src/lib/source');

    const result = createSource({
      source: { files: [] },
      baseUrl: '/docs',
      plugins: [existingPlugin],
    } as never);

    expect(loaderMock).toHaveBeenCalledWith({
      source: { files: [] },
      baseUrl: '/docs',
      plugins: [lucidePlugin, existingPlugin],
    });
    expect(result).toEqual({
      source: { files: [] },
      baseUrl: '/docs',
      plugins: [lucidePlugin, existingPlugin],
    });
  });

  it('treats a missing plugins array as empty', async () => {
    loaderMock.mockClear();
    const { createSource } = await import('../src/lib/source');

    createSource({
      source: { files: [] },
      baseUrl: '/docs',
    } as never);

    expect(loaderMock).toHaveBeenCalledWith({
      source: { files: [] },
      baseUrl: '/docs',
      plugins: [lucidePlugin],
    });
  });
});
