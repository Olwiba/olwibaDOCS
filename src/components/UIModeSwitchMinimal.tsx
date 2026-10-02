'use client';

import * as React from 'react';
import { ModeSwitchMinimal } from '@olwiba/cn';
import { getUIMode, setUIMode, subscribeUIMode } from '@/lib/ui-mode-store';

/**
 * The UI mode switch for a docs site's header.
 *
 * The products' icon button (the one genesis puts in its nav), cycling the
 * mode in this package's store, which the site's provider reads. The icon-only
 * counterpart of `UIModeDropdown`.
 */
export function UIModeSwitchMinimal() {
  // Seeded with the default and read after mount: the store reads
  // localStorage, which the server render cannot see.
  const [mode, setMode] = React.useState<string>('default');

  React.useEffect(() => {
    setMode(getUIMode());
    return subscribeUIMode(setMode);
  }, []);

  return <ModeSwitchMinimal mode={mode} onModeChange={setUIMode} />;
}
