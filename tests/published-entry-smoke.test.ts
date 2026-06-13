import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

describe('published entry points', () => {
  it.each([
    '@olwiba/docs',
    '@olwiba/docs/source',
    '@olwiba/docs/server',
    '@olwiba/docs/mdx',
    '@olwiba/docs/themes',
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
