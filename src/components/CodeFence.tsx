// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { CopyButton } from "./CopyButton";

interface CodeFenceProps {
  children?: React.ReactNode;
  code?: string;
  className?: string;
}

// Recursively extract text from React nodes (handles rehype-pretty-code nested spans)
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    if (props.children) {
      return extractText(props.children as React.ReactNode);
    }
  }
  return "";
}

export function CodeFence({ children, code, className }: CodeFenceProps) {
  const textContent = code ?? extractText(children).trim();
  const preRef = React.useRef<HTMLPreElement>(null);
  const [showFade, setShowFade] = React.useState(false);

  React.useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const check = () => setShowFade(pre.scrollWidth > pre.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(pre);
    return () => ro.disconnect();
  }, [children, code]);

  return (
    <div className={cn("group my-4 flex overflow-hidden rounded-lg border bg-code text-code-foreground shadow-inner", className)}>
      <div className="relative min-w-0 flex-1">
        <pre
          ref={preRef}
          className="no-scrollbar overflow-x-auto px-4 py-3.5 text-sm font-mono"
        >
          {children ?? <code>{code}</code>}
        </pre>
        {showFade && (
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 shrink-0 bg-gradient-to-r from-transparent to-[var(--color-code)]"
            aria-hidden
          />
        )}
      </div>
      <div className="flex shrink-0 items-center self-start pt-[10.5px] pr-2">
        <CopyButton text={textContent} />
      </div>
    </div>
  );
}
