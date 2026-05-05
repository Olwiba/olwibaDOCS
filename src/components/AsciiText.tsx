// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';
import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import fontRaw from '../assets/dosrebel.flf?raw';

const CHAR_W = 7.5;
const CHAR_H = 15;

// ── FIGlet parser ──────────────────────────────────────────────

interface FigFont {
  height: number;
  baseline: number;
  hardblank: string;
  chars: Map<number, string[]>;
}

function parseFont(raw: string): FigFont {
  const lines = raw.split('\n');
  // Strip BOM
  if (lines[0].charCodeAt(0) === 0xfeff) {
    lines[0] = lines[0].slice(1);
  }

  const header = lines[0];
  const hardblank = header[5]; // character after "flf2a"
  const parts = header.slice(6).trim().split(/\s+/);
  const height = parseInt(parts[0], 10);
  const baseline = parseInt(parts[1], 10);
  const commentLines = parseInt(parts[4], 10);

  const dataStart = 1 + commentLines;
  const chars = new Map<number, string[]>();

  let lineIdx = dataStart;
  let ascii = 32;

  while (lineIdx + height <= lines.length) {
    const charLines: string[] = [];
    for (let r = 0; r < height; r++) {
      let line = lines[lineIdx + r] ?? '';
      // Strip trailing @ markers
      line = line.replace(/@+$/, '');
      // Replace hardblank with space
      line = line.replaceAll(hardblank, ' ');
      charLines.push(line);
    }
    chars.set(ascii, charLines);
    lineIdx += height;
    ascii++;
    if (ascii > 126) break;
  }

  return { height, baseline, hardblank, chars };
}

// ── Text composer ──────────────────────────────────────────────

interface ComposedCell {
  ch: string; // '█', '░', or ' '
  col: number;
  row: number;
}

function composeText(
  font: FigFont,
  text: string,
): { cells: ComposedCell[]; cols: number; rows: number } {
  // Render each character and lay them side by side
  // Bottom-align: all characters align at baseline row
  const charBlocks: { lines: string[]; width: number }[] = [];
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const glyph = font.chars.get(code) ?? font.chars.get(32)!;
    const width = Math.max(...glyph.map((l) => l.length));
    const paddedLines = glyph.map((l) => l.padEnd(width));
    charBlocks.push({ lines: paddedLines, width });
  }

  // Total width = sum of char widths (FIGlet chars already include spacing)
  const totalWidth = charBlocks.reduce((s, b) => s + b.width, 0);
  const totalHeight = font.height;

  const cells: ComposedCell[] = [];
  let offsetX = 0;

  for (const block of charBlocks) {
    for (let r = 0; r < totalHeight; r++) {
      const line = block.lines[r] ?? '';
      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        if (ch === '█' || ch === '░') {
          cells.push({ ch, col: offsetX + c, row: r });
        }
      }
    }
    offsetX += block.width;
  }

  return { cells, cols: totalWidth, rows: totalHeight };
}

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
  const font = useMemo(() => parseFont(fontRaw), []);
  const { cells, cols, rows } = useMemo(() => composeText(font, text), [font, text]);

  // Pre-compute which columns belong to accent characters
  const accentCols = useMemo(() => {
    if (!accent) return new Set<number>();
    const set = new Set<number>();
    let offsetX = 0;
    for (const ch of text) {
      const code = ch.charCodeAt(0);
      const glyph = font.chars.get(code) ?? font.chars.get(32)!;
      const width = Math.max(...glyph.map((l) => l.length));
      if (accent.includes(ch)) {
        for (let c = 0; c < width; c++) set.add(offsetX + c);
      }
      offsetX += width;
    }
    return set;
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

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const style = getComputedStyle(canvas);
    const baseColor = color || style.color || '#a3a3a3';
    // Resolve CSS variables for canvas (which can't use var() directly)
    let highlightColor = baseColor;
    if (accentColor) {
      const varMatch = accentColor.match(/^var\(--([^)]+)\)$/);
      if (varMatch) {
        highlightColor = rootStyle.getPropertyValue(`--${varMatch[1]}`).trim() || baseColor;
      } else {
        highlightColor = accentColor;
      }
    }

    for (const cell of cells) {
      const isAccent = accentCols.has(cell.col);

      if (cell.ch === '░') {
        // Shadow — subtle, mostly static with very slow drift
        const drift = Math.sin(time * 0.3 + cell.col * 0.1) * 0.03;
        ctx.globalAlpha = 0.15 + drift;
        ctx.fillStyle = isAccent ? highlightColor : baseColor;
        ctx.fillRect(
          cell.col * CHAR_W,
          cell.row * CHAR_H,
          CHAR_W,
          CHAR_H,
        );
        continue;
      }

      // Body (█) — flowing liquid texture, bright but alive
      const nx = cell.col * 0.18 + time * 0.9;
      const ny = cell.row * 0.3 + time * 0.55;
      const noise =
        Math.sin(nx) * 0.12 +
        Math.sin(ny * 1.4 + nx * 0.6) * 0.1 +
        Math.sin(nx * 0.4 - ny * 0.8 + time * 1.6) * 0.08 +
        Math.sin((cell.col + cell.row) * 0.15 + time * 0.4) * 0.07;

      // Per-cell flicker — rare, gentle brightness pops
      const seed = cell.col * 7.13 + cell.row * 13.37;
      const flickerPhase = Math.sin(seed) * 1000;
      const flickerWave = Math.sin(time * 0.8 + flickerPhase);
      const flicker = flickerWave > 0.97 ? 0.15 : 0;

      let intensity = 0.7 + noise + flicker; // bright base, visible flow

      // Hover glow with ripple
      if (mouseRef.current.active) {
        const mdx = cell.col * CHAR_W + CHAR_W / 2 - mouseRef.current.x;
        const mdy = cell.row * CHAR_H + CHAR_H / 2 - mouseRef.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const radius = 80;
        if (mDist < radius) {
          const falloff = 1 - mDist / radius;
          const ripple =
            Math.sin(mDist * 0.08 - time * 4) * 0.12 * falloff * falloff;
          intensity = Math.min(1, intensity + falloff * 0.2 + ripple);
        }
      }

      // Click ripples
      const px = cell.col * CHAR_W + CHAR_W / 2;
      const py = cell.row * CHAR_H + CHAR_H / 2;
      for (const wave of wavesRef.current) {
        const wdx = px - wave.cx;
        const wdy = py - wave.cy;
        const dist = Math.sqrt(wdx * wdx + wdy * wdy);
        const age = time - wave.t;
        const waveRadius = age * 200;
        const delta = dist - waveRadius;
        const fade = Math.exp(-age * 1.5);
        const ring = Math.exp(-delta * delta * 0.002) * fade;
        intensity = Math.min(1, intensity + ring * 0.5 * Math.sin(delta * 0.06 + 1.5));
      }

      intensity = Math.max(0.5, Math.min(1, intensity));

      ctx.globalAlpha = intensity;
      ctx.fillStyle = isAccent ? highlightColor : baseColor;
      ctx.fillRect(
        cell.col * CHAR_W,
        cell.row * CHAR_H,
        CHAR_W,
        CHAR_H,
      );
    }

    ctx.globalAlpha = 1;

    if (!hasPaintedRef.current) {
      hasPaintedRef.current = true;
      setIsCanvasReady(true);
    }

    // Prune old waves
    wavesRef.current = wavesRef.current.filter((w) => time - w.t < 3);
  }, [cells, accentCols, color, accentColor]);

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
