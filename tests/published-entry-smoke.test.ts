import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';

const execFileAsync = promisify(execFile);

describe('published entry points', () => {
  it('keeps the React Router runtime and declarations free of TanStack imports', async () => {
    for (const file of ['dist/react-router.js', 'dist/react-router.d.ts']) {
      expect(await readFile(file, 'utf8')).not.toMatch(/@tanstack\//);
    }
  });
  it.each([
    '@olwiba/docs',
    '@olwiba/docs/source',
    '@olwiba/docs/server',
    '@olwiba/docs/mdx',
    '@olwiba/docs/themes',
    '@olwiba/docs/agent',
    '@olwiba/docs/react-router',
  ])('imports %s from built dist without throwing', async (specifier) => {
    const script = `await import(${JSON.stringify(specifier)}); process.exit(0);`;
    const bunCommand = process.platform === 'win32' ? 'bun.exe' : 'bun';

    await expect(
      execFileAsync(bunCommand, ['--eval', script], {
        cwd: process.cwd(),
        timeout: 45_000,
      })
    ).resolves.toBeDefined();
  }, 45_000);
});
