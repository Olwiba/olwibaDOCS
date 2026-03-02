// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { Terminal, Check } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import {
  Button,
  fireConfetti,
} from '@olwiba/cn';

interface CopyCommandButtonProps {
  command: string;
  copyCommand?: string;
}

export function CopyCommandButton({
  command,
  copyCommand,
}: CopyCommandButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(copyCommand ?? command);
    toast.success("Command copied to clipboard");
    fireConfetti();
  };

  const shortCommand = command.split(" ").at(-1);

  return (
    <Button
      className="font-mono text-xs md:text-sm"
      onClick={handleCopy}
      variant="outline"
    >
      {isCopied ? (
        <Check className="size-3 md:size-4 text-primary" />
      ) : (
        <Terminal className="size-3 md:size-4" />
      )}
      <span className="hidden sm:block">{command}</span>
      <span className="block sm:hidden">
        <span className="font-mono">{shortCommand}</span>
      </span>
    </Button>
  );
}
