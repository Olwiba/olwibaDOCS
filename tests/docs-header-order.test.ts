import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('DocsHeader trailing controls', () => {
  it('keeps utilities, auth, and the optional theme toggle in semantic order', () => {
    const source = readFileSync(
      new URL('../src/components/DocsHeader.tsx', import.meta.url),
      'utf8',
    );

    const utilities = source.lastIndexOf('{rightSlot}');
    const auth = source.lastIndexOf('{authSlot}');
    const theme = source.lastIndexOf('{showModeSwitcher && <ThemeSwitchMinimal />}');

    expect(utilities).toBeGreaterThan(-1);
    expect(auth).toBeGreaterThan(utilities);
    expect(theme).toBeGreaterThan(auth);
  });
});
