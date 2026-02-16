// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@olwiba/cn';
import { Theme, themes } from "../lib/themes";
import { useThemeConfig } from './ActiveTheme';

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <Select
      value={activeTheme}
      onValueChange={(value: string) => setActiveTheme(value as Theme)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem key={theme.name} value={theme.name}>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-3 rounded-sm border border-foreground/20"
                style={{ backgroundColor: theme.color }}
              />
              <span>{theme.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
