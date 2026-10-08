// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import * as React from "react";
import { Theme, getThemeStyles } from "../lib/themes";
import { brandColorCss } from '@olwiba/cn';
import { projectConfig } from "@/project.config";

const STORAGE_KEY = "active_theme";
const CUSTOM_STORAGE_KEY = "active_theme_custom";

/** The active theme: a named one, or "custom" for a colour picked by hand. */
export type ActiveTheme = Theme | "custom";
const DEFAULT_THEME = projectConfig.theme.defaultName as Theme;

function clearLegacyThemeCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

function setSessionTheme(theme: ActiveTheme) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, theme);
}

function getSessionTheme(): ActiveTheme | null {
  if (typeof window === "undefined") return null;
  const theme = window.sessionStorage.getItem(STORAGE_KEY);
  return theme ? (theme as ActiveTheme) : null;
}

function getSessionCustomColor(): string | null {
  if (typeof window === "undefined") return null;
  const hex = window.sessionStorage.getItem(CUSTOM_STORAGE_KEY);
  return hex && /^#[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : null;
}

interface ThemeContextType {
  activeTheme: ActiveTheme;
  setActiveTheme: (theme: ActiveTheme) => void;
  /** The hand-picked brand colour, used when `activeTheme` is "custom". */
  customColor: string | null;
  setCustomColor: (hex: string) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [activeTheme, setActiveThemeState] = React.useState<ActiveTheme>(
    () => initialTheme || DEFAULT_THEME
  );
  const [customColor, setCustomColorState] = React.useState<string | null>(null);
  const styleRef = React.useRef<HTMLStyleElement | null>(null);

  // Keep demo theme for the current browser session only.
  //
  // `initialTheme` is the application's default, not an override. It used to
  // short-circuit this effect, so any site that set one could never restore a
  // visitor's saved choice — the theme silently reset on every navigation.
  // Precedence is application default first, then whatever the visitor picked.
  React.useEffect(() => {
    clearLegacyThemeCookie();
    const savedCustom = getSessionCustomColor();
    if (savedCustom) setCustomColorState(savedCustom);
    const savedTheme = getSessionTheme();
    // A saved "custom" without its colour (cleared storage, a bad value) is
    // ignored rather than leaving the site on a theme that paints nothing.
    if (savedTheme && (savedTheme !== "custom" || savedCustom)) {
      setActiveThemeState((currentTheme) =>
        currentTheme === savedTheme ? currentTheme : savedTheme
      );
    }
  }, [initialTheme]);

  // Apply theme styles
  React.useEffect(() => {
    setSessionTheme(activeTheme);

    // Update theme class on body
    const themeClasses = Array.from(document.body.classList).filter((c) =>
      c.startsWith("theme-")
    );
    themeClasses.forEach((c) => document.body.classList.remove(c));
    document.body.classList.add(`theme-${activeTheme}`);

    // Inject theme CSS
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.id = "active-theme-styles";
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent =
      activeTheme === "custom"
        ? customColor
          ? brandColorCss(customColor)
          : getThemeStyles(DEFAULT_THEME)
        : getThemeStyles(activeTheme);

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [activeTheme, customColor]);

  const setActiveTheme = React.useCallback((theme: ActiveTheme) => {
    setActiveThemeState(theme);
  }, []);

  const setCustomColor = React.useCallback((hex: string) => {
    setCustomColorState(hex);
    if (typeof window !== "undefined") window.sessionStorage.setItem(CUSTOM_STORAGE_KEY, hex);
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider");
  }
  return context;
}
