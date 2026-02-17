import { useThemeConfig } from '@/components/ActiveTheme';
import { ThemeSelector } from '@/components/ThemeSelector';

export default function ActiveThemeDemo() {
  const { activeTheme } = useThemeConfig();

  return (
    <div className="flex flex-col items-center gap-4">
      <ThemeSelector />
      <p className="text-sm text-fd-muted-foreground">
        Active theme: <code className="font-mono text-fd-foreground">{activeTheme}</code>
      </p>
    </div>
  );
}
