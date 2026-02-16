// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { Menu, Text } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@olwiba/cn';


function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!itemIds.length) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const triggerPoint = scrollTop + viewportHeight * 0.5;

      // At bottom of page — last heading wins
      if (scrollTop + viewportHeight >= docHeight - 2) {
        setActiveId(itemIds[itemIds.length - 1]);
        return;
      }

      // Find the last heading above the trigger point
      let active: string | null = null;
      for (const id of itemIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top + scrollTop <= triggerPoint) {
          active = id;
        } else {
          break;
        }
      }

      setActiveId(active ?? itemIds[0]);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [itemIds]);

  return activeId;
}

interface ScrollProgress {
  top: number;
  height: number;
}

function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  itemIds: string[]
): ScrollProgress {
  const [progress, setProgress] = useState<ScrollProgress>({
    top: 0,
    height: 20,
  });

  useEffect(() => {
    if (!itemIds.length) return;

    const updateProgress = () => {
      const container = containerRef.current;
      if (!container) return;

      const headingPositions = itemIds
        .map((id) => {
          const el = document.getElementById(id);
          const tocEl = container.querySelector(`[data-toc-id="${id}"]`) as HTMLElement | null;
          if (!el || !tocEl) return null;
          return {
            id,
            docTop: el.getBoundingClientRect().top + window.scrollY,
            tocTop: tocEl.offsetTop,
            tocHeight: tocEl.offsetHeight,
          };
        })
        .filter(Boolean) as Array<{
          id: string;
          docTop: number;
          tocTop: number;
          tocHeight: number;
        }>;

      if (!headingPositions.length) return;

      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = docHeight - viewportHeight;

      if (maxScroll > 0 && scrollTop + viewportHeight >= docHeight - 2) {
        const last = headingPositions[headingPositions.length - 1];
        setProgress({ top: last.tocTop, height: last.tocHeight });
        return;
      }

      if (scrollTop <= 2) {
        const first = headingPositions[0];
        setProgress({ top: first.tocTop, height: first.tocHeight });
        return;
      }

      const triggerPoint = scrollTop + viewportHeight * 0.5;

      let currentIndex = 0;
      for (let i = headingPositions.length - 1; i >= 0; i--) {
        if (triggerPoint >= headingPositions[i].docTop) {
          currentIndex = i;
          break;
        }
      }

      const current = headingPositions[currentIndex];
      const next = headingPositions[currentIndex + 1];

      let progressRatio = 0;
      if (next) {
        const sectionLength = next.docTop - current.docTop;
        const positionInSection = triggerPoint - current.docTop;
        progressRatio = Math.max(0, Math.min(1, positionInSection / sectionLength));
      } else {
        const sectionScrollStart = current.docTop - viewportHeight * 0.5;
        const sectionScrollEnd = maxScroll;
        const range = sectionScrollEnd - sectionScrollStart;
        if (range > 0) {
          progressRatio = Math.max(0, Math.min(1, (scrollTop - sectionScrollStart) / range));
        } else {
          progressRatio = 1;
        }
      }

      const tocStart = current.tocTop;
      const tocEnd = next ? next.tocTop : current.tocTop + current.tocHeight;
      const interpolatedTop = tocStart + (tocEnd - tocStart) * progressRatio;

      setProgress({
        top: interpolatedTop,
        height: current.tocHeight,
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [containerRef, itemIds]);

  return progress;
}

function useScrollToActive(
  containerRef: React.RefObject<HTMLElement | null>,
  activeId: string | null
) {
  useEffect(() => {
    if (!activeId || !containerRef.current) return;

    const container = containerRef.current;
    const activeElement = container.querySelector(
      `[data-toc-id="${activeId}"]`
    ) as HTMLElement | null;

    if (!activeElement) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    const isAbove = activeRect.top < containerRect.top;
    const isBelow = activeRect.bottom > containerRect.bottom;

    if (isAbove || isBelow) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeId, containerRef]);
}

// --- SVG track path generation ---

function depthToX(depth: number): number {
  if (depth <= 2) return 1;
  if (depth === 3) return 17;
  return 33;
}

function generateTocPath(
  container: HTMLElement,
  itemIds: string[],
  toc: TocItem[]
): string {
  const items = itemIds.map((id, i) => {
    const el = container.querySelector(`[data-toc-id="${id}"]`) as HTMLElement | null;
    if (!el) return null;
    return {
      top: el.offsetTop,
      bottom: el.offsetTop + el.offsetHeight,
      x: depthToX(toc[i]?.depth ?? 2),
    };
  }).filter(Boolean) as { top: number; bottom: number; x: number }[];

  if (!items.length) return "";

  let d = `M ${items[0].x} ${items[0].top}`;
  d += ` L ${items[0].x} ${items[0].bottom}`;

  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1];
    const curr = items[i];

    if (curr.x === prev.x) {
      d += ` L ${curr.x} ${curr.bottom}`;
    } else {
      // Straight through the gap, then angle within the next item's space
      const OFFSET = 8; // px into the next item where the angle completes
      const off = Math.min(OFFSET, (curr.bottom - curr.top) / 2);
      d += ` L ${prev.x} ${curr.top - off}`;
      d += ` L ${curr.x} ${curr.top + off}`;
      d += ` L ${curr.x} ${curr.bottom}`;
    }
  }

  return d;
}

/**
 * Builds a lookup table mapping y-coordinates to cumulative path lengths.
 * Used to convert pixel-based scroll progress to path-based dash offsets.
 */
function buildYToLengthMap(path: SVGPathElement, samples = 200) {
  const totalLength = path.getTotalLength();
  const map: { y: number; length: number }[] = [];

  for (let i = 0; i <= samples; i++) {
    const length = (i / samples) * totalLength;
    const point = path.getPointAtLength(length);
    map.push({ y: point.y, length });
  }

  return { map, totalLength };
}

function lookupLengthAtY(
  map: { y: number; length: number }[],
  targetY: number
): number {
  if (!map.length) return 0;
  if (targetY <= map[0].y) return map[0].length;
  if (targetY >= map[map.length - 1].y) return map[map.length - 1].length;

  let low = 0;
  let high = map.length - 1;
  while (low < high - 1) {
    const mid = Math.floor((low + high) / 2);
    if (map[mid].y <= targetY) low = mid;
    else high = mid;
  }

  const prev = map[low];
  const next = map[high];
  if (next.y === prev.y) return prev.length;
  const t = (targetY - prev.y) / (next.y - prev.y);
  return prev.length + t * (next.length - prev.length);
}

function useTocPath(
  containerRef: React.RefObject<HTMLElement | null>,
  pathRef: React.RefObject<SVGPathElement | null>,
  itemIds: string[],
  toc: TocItem[]
) {
  const [trackD, setTrackD] = useState("");
  const yMapRef = useRef<{ y: number; length: number }[]>([]);
  const totalLengthRef = useRef(0);

  // Generate path from item positions
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !itemIds.length) return;

    const compute = () => {
      setTrackD(generateTocPath(container, itemIds, toc));
    };

    const raf = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
    };
  }, [containerRef, itemIds, toc]);

  // Precompute y-to-length map once path renders
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !trackD) {
      yMapRef.current = [];
      totalLengthRef.current = 0;
      return;
    }

    const { map, totalLength } = buildYToLengthMap(path);
    yMapRef.current = map;
    totalLengthRef.current = totalLength;
  }, [trackD, pathRef]);

  const yToLength = useCallback((y: number) => {
    return lookupLengthAtY(yMapRef.current, y);
  }, []);

  return { trackD, totalLength: totalLengthRef, yToLength };
}

// --- Component ---

export interface TocItem {
  title: string;
  url: string;
  depth: number;
}

export interface DocsTocProps {
  toc: TocItem[];
  variant?: "dropdown" | "list";
  className?: string;
}

export function DocsToc({
  toc,
  variant = "list",
  className,
}: DocsTocProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const itemIds = useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);
  const scrollProgress = useScrollProgress(containerRef, itemIds);
  const { trackD, totalLength, yToLength } = useTocPath(
    containerRef,
    svgPathRef,
    itemIds,
    toc
  );

  useScrollToActive(containerRef, activeHeading);

  // Convert pixel-based scroll progress to path-length-based dash values
  const total = totalLength.current;
  const startLen = yToLength(scrollProgress.top);
  const endLen = yToLength(scrollProgress.top + scrollProgress.height);
  const segLen = endLen - startLen;

  if (!toc?.length) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn("h-8 md:h-7", className)}
            size="sm"
            variant="outline"
          >
            <Menu className="size-4" /> On This Page
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="no-scrollbar max-h-[70svh]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {toc.map((item) => (
            <DropdownMenuItem
              asChild
              className="data-[depth=3]:pl-6 data-[depth=4]:pl-8"
              data-depth={item.depth}
              key={item.url}
              onClick={() => {
                setOpen(false);
              }}
            >
              <a href={item.url}>{item.title}</a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("relative flex flex-col gap-2 p-4 pt-0 text-sm", className)}>
      <p className="sticky top-0 z-10 flex h-6 items-center gap-1.5 bg-background text-muted-foreground text-xs">
        <Text className="size-4" />
        On This Page
      </p>
      <div ref={containerRef} className="relative overflow-y-auto">
        {/* SVG track with curved path */}
        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-3 overflow-visible"
          aria-hidden="true"
        >
          {/* Background track */}
          <path
            ref={svgPathRef}
            d={trackD}
            fill="none"
            className="stroke-border"
            strokeWidth="1"
          />
          {/* Progress indicator — follows the curved path */}
          {total > 0 && segLen > 0 && (
            <path
              d={trackD}
              fill="none"
              className="stroke-foreground"
              strokeWidth="1"
              strokeDasharray={`${segLen} ${total - segLen}`}
              strokeDashoffset={-startLen}
              style={{ transition: "stroke-dashoffset 100ms ease-out, stroke-dasharray 100ms ease-out" }}
            />
          )}
        </svg>
        {/* TOC items */}
        <div className="flex flex-col gap-2 pl-3">
          {toc.map((item) => {
            const id = item.url.replace("#", "");
            return (
              <a
                className="text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-6 data-[active=true]:text-foreground"
                data-active={id === activeHeading}
                data-depth={item.depth}
                data-toc-id={id}
                href={item.url}
                key={item.url}
              >
                {item.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
