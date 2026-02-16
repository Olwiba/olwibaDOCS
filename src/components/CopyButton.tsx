// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { Check, Copy } from "lucide-react";
import { Button } from '@olwiba/cn';
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
      className={cn(
        "size-7 transition-all duration-200",
        "opacity-50 hover:opacity-100 group-hover:opacity-100",
        "hover:bg-muted-foreground/10 hover:scale-105",
        className
      )}
      onClick={() => copyToClipboard(text)}
    >
      <span className="relative flex items-center justify-center">
        <Copy
          className={cn(
            "size-3.5 transition-all duration-200",
            isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <Check
          className={cn(
            "absolute size-3.5 text-green-500 transition-all duration-200",
            isCopied
              ? "scale-100 opacity-100 animate-in zoom-in-50"
              : "scale-0 opacity-0"
          )}
        />
      </span>
      <span className="sr-only">Copy code</span>
    </Button>
  );
}
