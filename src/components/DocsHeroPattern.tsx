// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface DocsGridPatternProps extends React.ComponentPropsWithoutRef<'svg'> {
  width: number;
  height: number;
  x: string | number;
  y: string | number;
  squares?: Array<[x: number, y: number]>;
}

/** Line-grid SVG pattern with optional highlighted squares. Shared by DocsHeroPattern and DocsCard. */
export function DocsGridPattern({ width, height, x, y, squares, ...props }: DocsGridPatternProps) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy]) => (
            <rect key={`${sx}-${sy}`} strokeWidth={0} width={width + 1} height={height + 1} x={sx * width} y={sy * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

export interface DocsHeroPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gradient start color. Defaults to the primary token. */
  fromColor?: string;
  /** Gradient end color. Defaults to a chart token. */
  toColor?: string;
}

/**
 * Product-docs hero backdrop: soft gradient wash with a skewed line grid,
 * masked so it fades toward the page. Place at the top of a docs landing page
 * inside a relatively positioned container.
 */
export function DocsHeroPattern({
  fromColor = 'color-mix(in oklab, var(--primary) 55%, transparent)',
  toColor = 'color-mix(in oklab, var(--chart-4) 45%, transparent)',
  className,
  ...props
}: DocsHeroPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden', className)}
      {...props}
    >
      <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] [mask-image:linear-gradient(white,transparent)]">
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:opacity-70"
          style={{ background: `linear-gradient(to right, ${fromColor}, ${toColor})` }}
        >
          <DocsGridPattern
            width={72}
            height={56}
            x={-12}
            y={4}
            squares={[
              [4, 3],
              [2, 1],
              [7, 3],
              [10, 6],
            ]}
            className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-foreground/20 stroke-foreground/25 mix-blend-overlay dark:fill-white/5 dark:stroke-white/10"
          />
        </div>
      </div>
    </div>
  );
}
