// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { BrandColorSwitchMinimal } from '@olwiba/cn';
import { useThemeConfig } from './ActiveTheme';
import { Theme, themes } from '../lib/themes';

/**
 * The brand colour switch for a docs site's header.
 *
 * The products' control (the palette button genesis puts in its nav), driving
 * the docs theme provider instead of its own storage, so a pick restyles the
 * site, its demos, and the code samples that print the active theme.
 */
export function DocsBrandSwitch() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <BrandColorSwitchMinimal
      colors={themes.map((theme) => ({
        name: theme.name,
        label: theme.label,
        swatch: theme.color,
        neutral: theme.name === Theme.Default,
      }))}
      value={activeTheme}
      onValueChange={(name: string) => setActiveTheme(name as Theme)}
    />
  );
}
