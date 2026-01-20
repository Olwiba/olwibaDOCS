"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@olwiba/cn/button";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { cn } from "../lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-7 opacity-0 transition-opacity group-hover:opacity-100", className)}
      onClick={() => copyToClipboard(text)}
    >
      {isCopied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span className="sr-only">Copy code</span>
    </Button>
  );
}
