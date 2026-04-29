// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { CopyButton } from "./CopyButton";

interface CodeFenceProps {
  children?: React.ReactNode;
  code?: string;
  language?: string;
  className?: string;
  preClassName?: string;
  codeClassName?: string;
  codeWrapClassName?: string;
  showCopyButton?: boolean;
  showLineNumbers?: boolean;
}

// Lazily create and cache the shiki highlighter
let highlighterPromise: ReturnType<typeof createHighlighterLazy> | null = null;

async function createHighlighterLazy() {
  const { createHighlighter } = await import("shiki");
  return createHighlighter({
    themes: ["github-dark", "github-light-default"],
    langs: ["bash", "tsx", "typescript", "css"],
  });
}

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterLazy();
  }
  return highlighterPromise;
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

export function CodeFence({
  children,
  code,
  language,
  className,
  preClassName,
  codeClassName,
  codeWrapClassName,
  showCopyButton = true,
  showLineNumbers = false,
}: CodeFenceProps) {
  const textContent = code ?? extractText(children).trim();
  const plainLines = React.useMemo(() => (code ?? "").split("\n"), [code]);
  const preRef = React.useRef<HTMLPreElement>(null);
  const [showFade, setShowFade] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    setHighlightedHtml(null);
    if (!code) return;
    let cancelled = false;

    getHighlighter().then((hl) => {
      if (cancelled) return;
      const html = hl.codeToHtml(code, {
        lang: language ?? "bash",
        themes: { light: "github-light-default", dark: "github-dark" },
        defaultColor: false,
        transformers: [
          {
            line(node) {
              node.properties["data-line"] = "";
              delete node.properties.class;
            },
          },
        ],
      });
      const match = html.match(/<code>([\s\S]*)<\/code>/);
      // Strip newlines between line spans — pre/white-space:pre would render them
      // as blank lines since each [data-line] span is display:block.
      setHighlightedHtml(match ? match[1].replace(/\n/g, '') : null);
    });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  React.useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const check = () => setShowFade(pre.scrollWidth > pre.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(pre);
    return () => ro.disconnect();
  }, [children, code, highlightedHtml]);

  return (
    <div className={cn("group my-4 flex overflow-hidden rounded-lg border bg-code text-code-foreground shadow-inner", className)}>
      <div className="relative min-w-0 flex-1">
        <pre
          ref={preRef}
          className={cn(
            "no-scrollbar overflow-x-auto px-4 py-3.5 text-sm font-mono",
            preClassName
          )}
        >
          <span className={cn(codeWrapClassName)}>
            {children ?? (
              highlightedHtml
                ? (
                  <code
                    className={codeClassName}
                    data-line-numbers={showLineNumbers || undefined}
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                )
                : (
                  <code
                    className={codeClassName}
                    data-line-numbers={showLineNumbers || undefined}
                  >
                    {plainLines.map((line, index) => (
                      <span data-line="" key={index}>
                        {line}
                      </span>
                    ))}
                  </code>
                )
            )}
          </span>
        </pre>
        {showFade && (
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 shrink-0 bg-gradient-to-r from-transparent to-[var(--color-code)]"
            aria-hidden
          />
        )}
      </div>
      {showCopyButton ? (
        <div className="flex shrink-0 items-center self-start pt-[10.5px] pr-2">
          <CopyButton text={textContent} />
        </div>
      ) : null}
    </div>
  );
}
