import { afterEach, describe, expect, it, vi } from 'vitest';

async function importStore() {
  vi.resetModules();
  return import('../src/lib/ui-mode-store');
}

describe('ui mode store', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to default mode without a browser window', async () => {
    const { getUIMode } = await importStore();

    expect(getUIMode()).toBe('default');
  });

  it('reads the initial mode from localStorage in the browser', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'compact'),
      setItem: vi.fn(),
    });

    const { getUIMode } = await importStore();

    expect(getUIMode()).toBe('compact');
    expect(localStorage.getItem).toHaveBeenCalledWith('olwiba-ui-mode');
  });

  it('persists changes and notifies active subscribers only', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    });

    const { getUIMode, setUIMode, subscribeUIMode } = await importStore();
    const activeSubscriber = vi.fn();
    const removedSubscriber = vi.fn();

    subscribeUIMode(activeSubscriber);
    const unsubscribe = subscribeUIMode(removedSubscriber);
    unsubscribe();

    setUIMode('dense');

    expect(getUIMode()).toBe('dense');
    expect(localStorage.setItem).toHaveBeenCalledWith('olwiba-ui-mode', 'dense');
    expect(activeSubscriber).toHaveBeenCalledWith('dense');
    expect(removedSubscriber).not.toHaveBeenCalled();
  });
});
