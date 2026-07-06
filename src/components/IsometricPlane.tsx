// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';

export interface IsometricImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface IsometricPlaneProps {
  images: IsometricImage[];
  cols?: number;
  rows?: number;
  cardWidth?: number;
  cardHeight?: number | 'auto';
  scrollDuration?: number;
}

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function buildGrid<T>(items: T[], rows: number, cols: number): T[][] {
  return Array.from({ length: rows }, (_, r) => {
    const rng = seededRng(r * 31 + 17);
    return Array.from({ length: cols }, () =>
      items[Math.floor(rng() * items.length)]
    );
  });
}

export function IsometricPlane({
  images,
  cols = 13,
  rows = 22,
  cardWidth = 176,
  cardHeight = 'auto',
  scrollDuration = 75,
}: IsometricPlaneProps) {
  const baseRows = React.useMemo(
    () => buildGrid(images, rows, cols),
    [images, rows, cols],
  );

  // The card grid is deterministic (seeded RNG) and its chrome is theme-neutral
  // (CSS variables), so the skeleton renders during SSR and animates from first
  // paint. Only the <img> layer is client-gated: held until every unique image
  // is fetched and decoded, so images fade in populated instead of popping in
  // one by one. Server and first client render both have imagesReady=false,
  // keeping hydration consistent.
  const [imagesReady, setImagesReady] = React.useState(false);
  React.useEffect(() => {
    setImagesReady(false);
    if (images.length === 0) return;
    let cancelled = false;
    const srcs = [...new Set(images.map((img) => img.src))];
    Promise.allSettled(
      srcs.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            const settle = () => {
              img.decode().catch(() => {}).finally(resolve);
            };
            img.onload = settle;
            img.onerror = () => resolve();
            img.src = src;
            if (img.complete) settle();
          }),
      ),
    ).then(() => {
      if (!cancelled) setImagesReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [images]);

  if (images.length === 0) return null;

  const h = cardHeight === 'auto' ? undefined : cardHeight;
  const tripled = [...baseRows, ...baseRows, ...baseRows];

  // `contain: layout paint style` bounds layout/paint so style invalidations
  // don't leak out of this subtree. `isolation: isolate` gives the subtree
  // its own stacking context so the browser keeps it as one composited layer.
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none animate-iso-fadein"
      aria-hidden="true"
      style={{ contain: 'layout paint style', isolation: 'isolate' }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.38] dark:opacity-[0.22]"
        style={{ perspective: '700px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          style={{
            transform: 'translateX(180px) scale(1.6) rotateX(55deg) rotateZ(-45deg)',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            data-iso-scroll
            className="flex gap-3 will-change-transform"
            style={{
              animation: `iso-scroll ${scrollDuration}s linear infinite`,
              // Skip painting the back face of every card under preserve-3d.
              backfaceVisibility: 'hidden',
            }}
          >
            {Array.from({ length: cols }, (_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-3">
                {tripled.map((row, rowIdx) => {
                  const img = row[colIdx];
                  // Without a fixed height, size the empty card from the image's
                  // intrinsic ratio so the SSR skeleton doesn't collapse.
                  const ratio =
                    h == null && img.width && img.height
                      ? `${img.width} / ${img.height}`
                      : undefined;
                  return (
                    <div
                      key={rowIdx}
                      className="bg-card border border-border/80 shadow-sm shadow-black/[0.06] rounded-lg shrink-0 overflow-hidden dark:border-border dark:shadow-none"
                      style={{
                        width: cardWidth,
                        height: h,
                        aspectRatio: ratio,
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {imagesReady && (
                        <img
                          src={img.src}
                          alt={img.alt ?? ''}
                          width={img.width}
                          height={img.height}
                          className={
                            h != null || ratio
                              ? 'w-full h-full object-cover'
                              : 'w-full h-auto block'
                          }
                          style={{ animation: 'iso-fadein 0.5s ease-out both' }}
                          draggable={false}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
