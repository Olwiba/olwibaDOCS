// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';
import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import {
  ASCII_CHAR_HEIGHT as CHAR_H,
  ASCII_CHAR_WIDTH as CHAR_W,
  composeAsciiText,
  dosrebelFont,
  getAsciiAccentColumns,
  getAsciiCellIntensity,
  parseFigletFont,
  renderAsciiFrameToContext,
  type AsciiFrameContext,
} from '@olwiba/dx/ascii';

// ── Component ──────────────────────────────────────────────────

export interface AsciiTextProps {
  text?: string;
  accent?: string;
  accents?: Array<{ text: string; color: string }>;
  shine?: string;
  shineColor?: string;
  color?: string;
  accentColor?: string;
}

export function AsciiText({
  text = 'olwibaCN',
  accent = '',
  accents,
  shine = '',
  shineColor = 'rgba(255,255,255,0.92)',
  color,
  accentColor,
}: AsciiTextProps) {
  const font = useMemo(() => parseFigletFont(dosrebelFont), []);
  const { cells, cols, rows } = useMemo(() => composeAsciiText(font, text), [font, text]);

  // Pre-compute which columns belong to accent characters
  const accentCols = useMemo(() => {
    return getAsciiAccentColumns(font, text, accent);
  }, [font, text, accent]);
  const multiAccentCols = useMemo(() => {
    if (!accents?.length) return null;
    const map = new Map<number, string>();
    for (const item of accents) {
      const cols = getAsciiAccentColumns(font, text, item.text);
      for (const col of cols) map.set(col, item.color);
    }
    return map;
  }, [accents, font, text]);
  const getCellColor = useCallback((col: number, baseColor: string, highlightColor: string) => {
    return multiAccentCols?.get(col) ?? (accentCols.has(col) ? highlightColor : baseColor);
  }, [accentCols, multiAccentCols]);
  const shineCols = useMemo(() => {
    return getAsciiAccentColumns(font, text, shine);
  }, [font, shine, text]);
  const shineBounds = useMemo(() => {
    if (!shineCols.size) return null;
    const cols = Array.from(shineCols);
    return { min: Math.min(...cols), max: Math.max(...cols) };
  }, [shineCols]);

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

    if (multiAccentCols || shineCols.size) {
      for (const cell of cells) {
        const intensity = getAsciiCellIntensity(cell, {
          time,
          pointer: mouseRef.current,
          waves: wavesRef.current,
        });
        ctx.globalAlpha = intensity;
        ctx.fillStyle = getCellColor(cell.col, baseColor, highlightColor);
        ctx.fillRect(cell.col * CHAR_W, cell.row * CHAR_H, CHAR_W, CHAR_H);

        if (shineBounds && shineCols.has(cell.col)) {
          const alpha = getShineAlpha(cell.col, cell.row, time, shineBounds) * (cell.ch === '░' ? 0.55 : 1);
          if (alpha > 0) {
            ctx.globalAlpha = intensity * alpha;
            ctx.fillStyle = shineColor;
            ctx.fillRect(cell.col * CHAR_W, cell.row * CHAR_H, CHAR_W, CHAR_H);
          }
        }
      }
      ctx.globalAlpha = 1;
    } else {
      renderAsciiFrameToContext(ctx as unknown as AsciiFrameContext, { cells, cols, rows }, {
        accentColumns: accentCols,
        color: baseColor,
        accentColor: highlightColor,
        time,
        pointer: mouseRef.current,
        waves: wavesRef.current,
      });
    }

    if (!hasPaintedRef.current) {
      hasPaintedRef.current = true;
      setIsCanvasReady(true);
    }

    // Prune old waves
    wavesRef.current = wavesRef.current.filter((w) => time - w.t < 3);
  }, [accentCols, cells, cols, getCellColor, multiAccentCols, rows, shineBounds, shineColor, shineCols]);

  useEffect(() => {
    hasPaintedRef.current = false;
    setIsCanvasReady(false);
  }, [text, accent, accents, shine, shineColor, color, accentColor]);

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
            const multiAccentColor = multiAccentCols?.get(cell.col);
            const shineAlpha = shineBounds && shineCols.has(cell.col)
              ? getShineAlpha(cell.col, cell.row, 0.2, shineBounds) * (cell.ch === '░' ? 0.55 : 1)
              : 0;
            return (
              <React.Fragment key={`${cell.col}-${cell.row}`}>
                <rect
                  x={cell.col * CHAR_W}
                  y={cell.row * CHAR_H}
                  width={CHAR_W}
                  height={CHAR_H}
                  fill={multiAccentColor ?? (isAccent ? fallbackAccentColor : 'currentColor')}
                  opacity={cell.ch === '░' ? 0.15 : 0.78}
                />
                {shineAlpha > 0 && (
                  <rect
                    x={cell.col * CHAR_W}
                    y={cell.row * CHAR_H}
                    width={CHAR_W}
                    height={CHAR_H}
                    fill={shineColor}
                    opacity={shineAlpha}
                  />
                )}
              </React.Fragment>
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

// Sweeps per second for the shine bands. Tuned by feel — was 1.35, slowed 25%.
const SHINE_SPEED = 1.0125;

function getShineAlpha(col: number, row: number, time: number, bounds: { min: number; max: number }) {
  const span = bounds.max - bounds.min + 1;
  const travel = span + 6;
  const diagonalCol = col + row * 0.62;
  const primarySweep = bounds.max + 3 - ((time * SHINE_SPEED) % 1) * travel;
  const secondarySweep = bounds.max + 3 - (((time * SHINE_SPEED) + 0.5) % 1) * travel;
  const primary = getShineBandAlpha(diagonalCol, primarySweep);
  const secondary = getShineBandAlpha(diagonalCol, secondarySweep);
  return Math.min(0.86, primary + secondary * 0.82);
}

function getShineBandAlpha(diagonalCol: number, sweep: number) {
  const distance = Math.abs(diagonalCol - sweep);
  return Math.max(0, 1 - distance / 2.7) ** 2 * 0.78;
}
