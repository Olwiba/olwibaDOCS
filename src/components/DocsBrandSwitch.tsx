// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import { BrandColorSwitchMinimal } from '@olwiba/cn';
import { useThemeConfig, type ActiveTheme } from './ActiveTheme';
import { Theme, themes } from '../lib/themes';

/**
 * The brand colour switch for a docs site's header.
 *
 * The products' control (the palette button genesis puts in its nav), driving
 * the docs theme provider instead of its own storage, so a pick restyles the
 * site, its demos, and the code samples that print the active theme. A custom
 * colour goes to the provider too, which derives its light and dark tokens.
 */
export function DocsBrandSwitch() {
  const { activeTheme, setActiveTheme, customColor, setCustomColor } = useThemeConfig();

  return (
    <BrandColorSwitchMinimal
      colors={themes.map((theme) => ({
        name: theme.name,
        label: theme.label,
        swatch: theme.color,
        neutral: theme.name === Theme.Default,
      }))}
      value={activeTheme}
      onValueChange={(name: string) => setActiveTheme(name as ActiveTheme)}
      customColor={customColor}
      onCustomColorChange={(hex: string) => setCustomColor(hex)}
    />
  );
}
