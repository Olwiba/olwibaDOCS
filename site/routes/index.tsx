import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AsciiText, Button } from '@olwiba/cn';
import { IsometricPlane, type IsometricImage } from '@/components/IsometricPlane';
import rawManifest from '../iso-previews-manifest.json';

type ManifestEntry = { file: string; width: number; height: number; theme: string };

function useColorScheme(): 'light' | 'dark' {
  // Always start 'light' so the first client render matches SSR output; the
  // effect below corrects to the real scheme immediately after hydration.
  const [scheme, setScheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const read = () =>
      setScheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return scheme;
}

function useIsoImages(scheme: 'light' | 'dark'): IsometricImage[] {
  return React.useMemo(
    () =>
      (rawManifest as ManifestEntry[])
        .filter((e) => e.theme === scheme)
        .map((e) => ({ src: `/iso-previews/${e.file}`, width: e.width, height: e.height })),
    [scheme],
  );
}

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const scheme = useColorScheme();
  const isoImages = useIsoImages(scheme);

  return (
    <div className="relative flex flex-col flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] justify-center items-center px-4 py-16 text-center">
      {isoImages.length > 0 && <IsometricPlane images={isoImages} />}

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/90 to-transparent dark:h-64 dark:from-background dark:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/90 to-transparent dark:h-64 dark:from-background dark:to-transparent" />
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background/90 to-transparent dark:w-64 dark:from-background dark:to-transparent" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background/90 to-transparent dark:w-64 dark:from-background dark:to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <AsciiText text="olwibaDOCS" accent="DOCS" accentColor="var(--primary)" />
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Fumadocs abstraction for TanStack Start documentation sites. Build beautiful docs with ease.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/docs/$" params={{ _splat: '' }}>
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/docs/$" params={{ _splat: 'components' }}>
              Reference
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
