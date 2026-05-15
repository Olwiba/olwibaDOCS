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

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted || images.length === 0) return null;

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
        className="absolute inset-0 flex items-center justify-center opacity-[0.18] dark:opacity-[0.12]"
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
                  return (
                    <div
                      key={rowIdx}
                      className="bg-card border rounded-lg shrink-0 overflow-hidden"
                      style={{
                        width: cardWidth,
                        height: h,
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt ?? ''}
                        width={img.width}
                        height={img.height}
                        className={h ? 'w-full h-full object-cover' : 'w-full h-auto block'}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        draggable={false}
                      />
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
