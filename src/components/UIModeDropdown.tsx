'use client';

import * as React from 'react';
import { Blend } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@olwiba/cn';
import { getUIMode, setUIMode, subscribeUIMode } from '@/lib/ui-mode-store';

export interface UIModeOption {
  value: string;
  label: string;
}

export interface UIModeDropdownProps {
  modes: UIModeOption[];
}

export function UIModeDropdown({ modes }: UIModeDropdownProps) {
  const [mode, setMode] = React.useState<string>(getUIMode);

  React.useEffect(() => subscribeUIMode(setMode), []);

  const current = modes.find((m) => m.value === mode) ?? modes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Blend className="size-3.5" />
          <span className="hidden sm:inline">{current?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {modes.map((m) => (
          <DropdownMenuItem
            key={m.value}
            onClick={() => setUIMode(m.value)}
            className={mode === m.value ? 'font-medium' : undefined}
          >
            {m.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
