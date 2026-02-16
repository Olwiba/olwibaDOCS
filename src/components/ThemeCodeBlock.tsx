// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { useThemeConfig } from './ActiveTheme';
import { Theme, themes, getThemeCode } from "../lib/themes";
import { CodeFence } from "./CodeFence";
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@olwiba/cn';
import * as React from "react";

export function ThemeCodeBlock() {
  const { activeTheme } = useThemeConfig();
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(activeTheme);

  // Sync with active theme when it changes
  React.useEffect(() => {
    setSelectedTheme(activeTheme);
  }, [activeTheme]);

  const themeCode = getThemeCode(selectedTheme);

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Select theme to copy:</span>
        <Select
          value={selectedTheme}
          onValueChange={(value: string) => setSelectedTheme(value as Theme)}
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
      </div>
      <div className="[&_pre]:max-h-[400px] [&_pre]:overflow-y-auto">
        <CodeFence code={themeCode} />
      </div>
    </div>
  );
}
