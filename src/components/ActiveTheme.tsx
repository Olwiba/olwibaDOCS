// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import * as React from "react";
import { Theme, getThemeStyles } from "../lib/themes";

const COOKIE_NAME = "active_theme";
const DEFAULT_THEME = Theme.Emerald;

function setThemeCookie(theme: Theme) {
  if (typeof window === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

function getThemeCookie(): Theme | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? (match[1] as Theme) : null;
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

  // Load theme from cookie on mount (only when no explicit initialTheme)
  React.useEffect(() => {
    if (initialTheme) return;
    const savedTheme = getThemeCookie();
    if (savedTheme && savedTheme !== activeTheme) {
      setActiveThemeState(savedTheme);
    }
  }, []);

  // Apply theme styles
  React.useEffect(() => {
    setThemeCookie(activeTheme);

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
