type ProjectThemeConfig = {
  id: string
  label: string
  brandAccent: {
    hex: string
    lightOklch: string
    darkOklch: string
  }
  theme: {
    defaultName: string
    initialDocsTheme: string
  }
}

export const projectConfig = {
  id: "olwibaDOCS",
  label: "olwibaDOCS",
  brandAccent: {
    hex: "#2563eb",
    lightOklch: "oklch(0.546 0.245 262.881)",
    darkOklch: "oklch(0.623 0.214 259.815)",
  },
  theme: {
    defaultName: "blue",
    initialDocsTheme: "blue",
  },
} as const satisfies ProjectThemeConfig

export const projectThemeStyleCss = `:root {
  --project-brand-accent: ${projectConfig.brandAccent.lightOklch};
  --project-brand-accent-dark: ${projectConfig.brandAccent.darkOklch};
}`

export const projectBanner = {
  segments: [
    { text: "olwiba" },
    { text: "DOCS", colorHex: projectConfig.brandAccent.hex },
  ],
  compactSegments: [
    { text: "o" },
    { text: "DOCS", colorHex: projectConfig.brandAccent.hex },
  ],
}
