// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';
import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import {
  ASCII_CHAR_HEIGHT as CHAR_H,
  ASCII_CHAR_WIDTH as CHAR_W,
  composeAsciiText,
  dosrebelFont,
  getAsciiAccentColumns,
  parseFigletFont,
  renderAsciiFrameToContext,
  type AsciiFrameContext,
} from '@olwiba/dx/ascii';

// ── Component ──────────────────────────────────────────────────

export interface AsciiTextProps {
  text?: string;
  accent?: string;
  color?: string;
  accentColor?: string;
}

export function AsciiText({
  text = 'olwibaCN',
  accent = '',
  color,
  accentColor,
}: AsciiTextProps) {
  const font = useMemo(() => parseFigletFont(dosrebelFont), []);
  const { cells, cols, rows } = useMemo(() => composeAsciiText(font, text), [font, text]);

  // Pre-compute which columns belong to accent characters
  const accentCols = useMemo(() => {
    return getAsciiAccentColumns(font, text, accent);
  }, [font, text, accent]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const hasPaintedRef = useRef(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });
  const wavesRef = useRef<{ cx: number; cy: number; t: number }[]>([]);
  // Cached resolved colors. Recomputed only when inputs or theme change,
  // never inside the requestAnimationFrame loop. getComputedStyle on every
  // frame triggers a full style recalc and tanks fps when other compositor
  // work (e.g. the isometric plane) is on screen.
  const colorsRef = useRef<{ base: string; accent: string }>({ base: '#a3a3a3', accent: '#a3a3a3' });

  const resolveColors = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const style = getComputedStyle(canvas);
    const baseColor = color || style.color || '#a3a3a3';
    let highlightColor = baseColor;
    if (accentColor) {
      const varMatch = accentColor.match(/^var\(--([^)]+)\)$/);
      if (varMatch) {
        highlightColor = rootStyle.getPropertyValue(`--${varMatch[1]}`).trim() || baseColor;
      } else {
        highlightColor = accentColor;
      }
    }
    colorsRef.current = { base: baseColor, accent: highlightColor };
  }, [color, accentColor]);

  // Resolve colors when inputs change.
  useEffect(() => {
    resolveColors();
  }, [resolveColors]);

  // Re-resolve when the theme switches (dark/light class flips on <html>).
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => resolveColors());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    });
    return () => observer.disconnect();
  }, [resolveColors]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { base: baseColor, accent: highlightColor } = colorsRef.current;

    renderAsciiFrameToContext(ctx as unknown as AsciiFrameContext, { cells, cols, rows }, {
      accentColumns: accentCols,
      color: baseColor,
      accentColor: highlightColor,
      time,
      pointer: mouseRef.current,
      waves: wavesRef.current,
    });

    if (!hasPaintedRef.current) {
      hasPaintedRef.current = true;
      setIsCanvasReady(true);
    }

    // Prune old waves
    wavesRef.current = wavesRef.current.filter((w) => time - w.t < 3);
  }, [cells, accentCols, cols, rows]);

  useEffect(() => {
    hasPaintedRef.current = false;
    setIsCanvasReady(false);
  }, [text, accent, color, accentColor]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      timeRef.current += 0.016;
      render();
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [render]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        active: true,
      };
    },
    [],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      wavesRef.current.push({
        cx: (e.clientX - rect.left) * scaleX,
        cy: (e.clientY - rect.top) * scaleY,
        t: timeRef.current,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -100, y: -100, active: false };
  }, []);

  const canvasW = Math.ceil(cols * CHAR_W);
  const canvasH = rows * CHAR_H;
  const fallbackAccentColor = accentColor || 'currentColor';

  return (
    <div className="flex justify-center select-none mb-2 w-full px-4" aria-hidden="true">
      <div
        className="relative"
        style={{ width: canvasW, maxWidth: '100%' }}
      >
        <svg
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          className={`text-foreground pointer-events-none block h-auto w-full transition-opacity duration-200 ${
            isCanvasReady ? 'opacity-0' : 'opacity-100'
          }`}
          preserveAspectRatio="xMidYMid meet"
        >
          {cells.map((cell) => {
            const isAccent = accentCols.has(cell.col);
            return (
              <rect
                key={`${cell.col}-${cell.row}`}
                x={cell.col * CHAR_W}
                y={cell.row * CHAR_H}
                width={CHAR_W}
                height={CHAR_H}
                fill={isAccent ? fallbackAccentColor : 'currentColor'}
                opacity={cell.ch === '░' ? 0.15 : 0.78}
              />
            );
          })}
        </svg>
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          className={`text-foreground absolute top-0 left-0 block h-auto w-full cursor-pointer transition-opacity duration-200 ${
            isCanvasReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ aspectRatio: `${canvasW} / ${canvasH}` }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
}
