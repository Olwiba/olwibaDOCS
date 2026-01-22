"use client";

import { Menu, Text } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@olwiba/cn";
import { cn } from "../lib/utils";

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds]);

  return activeId;
}

interface ScrollProgress {
  top: number;
  height: number;
}

/**
 * Calculates scroll progress indicator position based on document scroll.
 * Maps the user's scroll position to a corresponding position on the TOC track,
 * smoothly interpolating between TOC items.
 */
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

      // Get all heading positions in the document
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
      
      // Trigger point is ~20% from top of viewport
      const triggerPoint = scrollTop + viewportHeight * 0.2;

      // Find which section we're in and how far through it
      let currentIndex = 0;
      for (let i = headingPositions.length - 1; i >= 0; i--) {
        if (triggerPoint >= headingPositions[i].docTop) {
          currentIndex = i;
          break;
        }
      }

      const current = headingPositions[currentIndex];
      const next = headingPositions[currentIndex + 1];

      // Calculate progress between current and next section
      let progressRatio = 0;
      if (next) {
        const sectionLength = next.docTop - current.docTop;
        const positionInSection = triggerPoint - current.docTop;
        progressRatio = Math.max(0, Math.min(1, positionInSection / sectionLength));
      } else {
        // Last section - calculate progress to end of document
        const remainingDoc = docHeight - current.docTop - viewportHeight;
        if (remainingDoc > 0) {
          const positionInSection = triggerPoint - current.docTop;
          progressRatio = Math.max(0, Math.min(1, positionInSection / remainingDoc));
        } else {
          progressRatio = 1;
        }
      }

      // Interpolate position on the TOC track
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

    // Check if the active element is outside the visible area
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
  const itemIds = useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);
  const scrollProgress = useScrollProgress(containerRef, itemIds);

  // Auto-scroll the TOC container to keep active item visible
  useScrollToActive(containerRef, activeHeading);

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
        {/* Track line */}
        <div className="absolute top-0 left-px h-full w-px bg-border" />
        {/* Scroll progress marker - moves smoothly as you scroll */}
        <div
          className="absolute left-px w-px bg-foreground transition-[top] duration-100 ease-out"
          style={{
            top: scrollProgress.top,
            height: scrollProgress.height,
          }}
        />
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
