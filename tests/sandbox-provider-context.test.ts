import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const sandboxPath = fileURLToPath(
  new URL('../src/components/Sandbox.tsx', import.meta.url)
);

describe('Sandbox iframe provider context', () => {
  it('portals preview children into the iframe without creating a second React root', async () => {
    const source = await readFile(sandboxPath, 'utf8');

    expect(source).toContain('createPortal(children, mountNode)');
    expect(source).not.toContain("from 'react-dom/client'");
    expect(source).not.toContain('createRoot(mountNode)');
  });

  it('lets desktop fill the available preview surface without changing device presets', async () => {
    const source = await readFile(sandboxPath, 'utf8');

    expect(source).toContain("viewport === 'desktop'");
    expect(source).toContain("previewWidth === undefined ? '100%' : `${previewWidth}px`");
    expect(source).toContain("tablet: 768");
    expect(source).toContain("mobile: 390");
  });
});
