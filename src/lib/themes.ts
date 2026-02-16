export const Theme = {
  Default: "default",
  Emerald: "emerald",
  Blue: "blue",
  Purple: "purple",
  Rose: "rose",
  Orange: "orange",
  Slate: "slate",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const themes: { name: Theme; label: string; color: string }[] = [
  { name: Theme.Default, label: "Default", color: "oklch(0.145 0 0)" },
  { name: Theme.Emerald, label: "Emerald", color: "oklch(0.596 0.145 163.225)" },
  { name: Theme.Blue, label: "Blue", color: "oklch(0.546 0.245 262.881)" },
  { name: Theme.Purple, label: "Purple", color: "oklch(0.558 0.288 302.321)" },
  { name: Theme.Rose, label: "Rose", color: "oklch(0.645 0.246 16.439)" },
  { name: Theme.Orange, label: "Orange", color: "oklch(0.705 0.213 47.604)" },
  { name: Theme.Slate, label: "Slate", color: "oklch(0.446 0.043 257.281)" },
];

const themeStyles: Record<Theme, string> = {
  [Theme.Default]: `
    :root {
      --primary: oklch(0.205 0 0);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.708 0 0);
    }
    .dark {
      --primary: oklch(0.922 0 0);
      --primary-foreground: oklch(0.205 0 0);
      --ring: oklch(0.556 0 0);
    }
  `,
  [Theme.Emerald]: `
    :root {
      --primary: oklch(0.596 0.145 163.225);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.596 0.145 163.225);
    }
    .dark {
      --primary: oklch(0.765 0.177 163.223);
      --primary-foreground: oklch(0.145 0 0);
      --ring: oklch(0.765 0.177 163.223);
    }
  `,
  [Theme.Blue]: `
    :root {
      --primary: oklch(0.546 0.245 262.881);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.546 0.245 262.881);
    }
    .dark {
      --primary: oklch(0.623 0.214 259.815);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.623 0.214 259.815);
    }
  `,
  [Theme.Purple]: `
    :root {
      --primary: oklch(0.558 0.288 302.321);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.558 0.288 302.321);
    }
    .dark {
      --primary: oklch(0.714 0.203 305.504);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.714 0.203 305.504);
    }
  `,
  [Theme.Rose]: `
    :root {
      --primary: oklch(0.645 0.246 16.439);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.645 0.246 16.439);
    }
    .dark {
      --primary: oklch(0.717 0.194 17.428);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.717 0.194 17.428);
    }
  `,
  [Theme.Orange]: `
    :root {
      --primary: oklch(0.705 0.213 47.604);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.705 0.213 47.604);
    }
    .dark {
      --primary: oklch(0.792 0.184 70.08);
      --primary-foreground: oklch(0.145 0 0);
      --ring: oklch(0.792 0.184 70.08);
    }
  `,
  [Theme.Slate]: `
    :root {
      --primary: oklch(0.446 0.043 257.281);
      --primary-foreground: oklch(0.985 0 0);
      --ring: oklch(0.446 0.043 257.281);
    }
    .dark {
      --primary: oklch(0.704 0.04 256.788);
      --primary-foreground: oklch(0.129 0.042 264.695);
      --ring: oklch(0.704 0.04 256.788);
    }
  `,
};

// Full theme code for copying to user's CSS file
const themeCode: Record<Theme, string> = {
  [Theme.Default]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}`,

  [Theme.Emerald]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.596 0.145 163.225);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.596 0.145 163.225);
  --chart-1: oklch(0.765 0.177 163.223);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.596 0.145 163.225);
  --chart-4: oklch(0.508 0.118 165.612);
  --chart-5: oklch(0.432 0.095 166.913);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.765 0.177 163.223);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.765 0.177 163.223);
}`,

  [Theme.Blue]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.546 0.245 262.881);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.546 0.245 262.881);
  --chart-1: oklch(0.623 0.214 259.815);
  --chart-2: oklch(0.546 0.245 262.881);
  --chart-3: oklch(0.488 0.243 264.376);
  --chart-4: oklch(0.424 0.199 265.638);
  --chart-5: oklch(0.37 0.155 266.024);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.623 0.214 259.815);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.623 0.214 259.815);
}`,

  [Theme.Purple]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.558 0.288 302.321);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.558 0.288 302.321);
  --chart-1: oklch(0.714 0.203 305.504);
  --chart-2: oklch(0.627 0.265 303.9);
  --chart-3: oklch(0.558 0.288 302.321);
  --chart-4: oklch(0.496 0.265 301.924);
  --chart-5: oklch(0.438 0.218 303.724);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.714 0.203 305.504);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.714 0.203 305.504);
}`,

  [Theme.Rose]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.645 0.246 16.439);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.645 0.246 16.439);
  --chart-1: oklch(0.717 0.194 17.428);
  --chart-2: oklch(0.645 0.246 16.439);
  --chart-3: oklch(0.586 0.253 17.585);
  --chart-4: oklch(0.514 0.222 16.935);
  --chart-5: oklch(0.455 0.188 13.697);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.717 0.194 17.428);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.717 0.194 17.428);
}`,

  [Theme.Orange]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.705 0.213 47.604);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.705 0.213 47.604);
  --chart-1: oklch(0.792 0.184 70.08);
  --chart-2: oklch(0.705 0.213 47.604);
  --chart-3: oklch(0.646 0.222 41.116);
  --chart-4: oklch(0.553 0.195 38.402);
  --chart-5: oklch(0.47 0.157 37.304);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.792 0.184 70.08);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.792 0.184 70.08);
}`,

  [Theme.Slate]: `:root {
  --radius: 0.25rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.446 0.043 257.281);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.446 0.043 257.281);
  --chart-1: oklch(0.704 0.04 256.788);
  --chart-2: oklch(0.554 0.046 257.417);
  --chart-3: oklch(0.446 0.043 257.281);
  --chart-4: oklch(0.372 0.044 257.287);
  --chart-5: oklch(0.279 0.041 260.031);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.704 0.04 256.788);
  --primary-foreground: oklch(0.129 0.042 264.695);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.704 0.04 256.788);
}`,
};

export const getThemeStyles = (theme: Theme): string => {
  return themeStyles[theme] || themeStyles[Theme.Emerald];
};

export const getThemeCode = (theme: Theme): string => {
  return themeCode[theme] || themeCode[Theme.Emerald];
};
