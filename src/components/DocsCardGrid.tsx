// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import { DocsGridPattern, type DocsGridPatternProps } from './DocsHeroPattern';

export interface DocsCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Grid pattern offset/squares for the card backdrop; sensible default per card. */
  pattern?: Pick<DocsGridPatternProps, 'y' | 'squares'>;
  /** External links render a plain anchor with target="_blank". */
  external?: boolean;
  className?: string;
}

export interface DocsCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid columns at the xl breakpoint. */
  columns?: 2 | 3 | 4;
}

const defaultPatterns: Array<Pick<DocsGridPatternProps, 'y' | 'squares'>> = [
  { y: 16, squares: [[0, 1], [1, 3]] },
  { y: -6, squares: [[-1, 2], [1, 3]] },
  { y: 32, squares: [[0, 2], [1, 4]] },
  { y: 22, squares: [[0, 1], [1, 3]] },
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function CardBackdrop({
  pattern,
  glowX,
  glowY,
}: {
  pattern: Pick<DocsGridPatternProps, 'y' | 'squares'>;
  glowX: number | null;
  glowY: number | null;
}) {
  const maskImage =
    glowX === null || glowY === null
      ? undefined
      : `radial-gradient(180px at ${glowX}px ${glowY}px, white, transparent)`;

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <DocsGridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-foreground/[0.02] stroke-foreground/5 dark:fill-white/[0.01] dark:stroke-white/[0.025]"
          {...pattern}
        />
      </div>
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/15 to-chart-4/15 opacity-0 transition duration-300 group-hover:opacity-100"
        style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      >
        <DocsGridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-foreground/40 stroke-foreground/60 dark:fill-white/[0.025] dark:stroke-white/10"
          {...pattern}
        />
      </div>
    </div>
  );
}

export function DocsCard({ href, title, description, icon: Icon, pattern, external, className }: DocsCardProps) {
  const [glow, setGlow] = React.useState<{ x: number; y: number } | null>(null);
  const resolvedPattern = pattern ?? defaultPatterns[hashString(title) % defaultPatterns.length]!;

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    setGlow({ x: event.clientX - left, y: event.clientY - top });
  }

  const linkContent = (
    <>
      <span className="absolute inset-0 rounded-2xl" />
      {title}
    </>
  );

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={() => setGlow(null)}
      className={cn(
        'group relative flex rounded-2xl bg-muted/40 transition-shadow hover:shadow-md hover:shadow-foreground/5',
        className,
      )}
    >
      <CardBackdrop pattern={resolvedPattern} glowX={glow?.x ?? null} glowY={glow?.y ?? null} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10 group-hover:ring-foreground/20" />
      <div className="relative rounded-2xl px-4 pb-4 pt-16">
        {Icon && (
          <div className="flex size-7 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-foreground/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-primary/10 group-hover:ring-primary">
            <Icon className="size-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
          </div>
        )}
        <h3 className={cn('text-sm font-semibold leading-7 text-foreground', Icon && 'mt-4')}>
          {external ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {linkContent}
            </a>
          ) : (
            <Link to={href}>{linkContent}</Link>
          )}
        </h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function DocsCardGrid({ columns = 3, className, children, ...props }: DocsCardGridProps) {
  return (
    <div
      className={cn(
        'not-prose mt-4 grid grid-cols-1 gap-6 border-t border-foreground/5 pt-10 sm:grid-cols-2',
        columns === 2 && 'xl:grid-cols-2',
        columns === 3 && 'xl:grid-cols-3',
        columns === 4 && 'xl:grid-cols-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
