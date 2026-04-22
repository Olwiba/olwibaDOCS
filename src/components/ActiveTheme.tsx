// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import * as React from "react";
import { Theme, getThemeStyles } from "../lib/themes";
import { projectConfig } from "@/project.config";

const STORAGE_KEY = "active_theme";
const DEFAULT_THEME = projectConfig.theme.defaultName as Theme;

function clearLegacyThemeCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

function setSessionTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, theme);
}

function getSessionTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const theme = window.sessionStorage.getItem(STORAGE_KEY);
  return theme ? (theme as Theme) : null;
}

interface ThemeContextType {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [activeTheme, setActiveThemeState] = React.useState<Theme>(
    () => initialTheme || DEFAULT_THEME
  );
  const styleRef = React.useRef<HTMLStyleElement | null>(null);

  // Keep demo theme for the current browser session only.
  React.useEffect(() => {
    if (initialTheme) return;
    clearLegacyThemeCookie();
    const savedTheme = getSessionTheme();
    if (savedTheme) {
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
    styleRef.current.textContent = getThemeStyles(activeTheme);

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [activeTheme]);

  const setActiveTheme = React.useCallback((theme: Theme) => {
    setActiveThemeState(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
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
