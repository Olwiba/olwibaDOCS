// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { CodeFence } from './CodeFence';
import { setUsageCode, subscribeUsageCode, getUsageCode } from '../lib/usage-code-store';

/**
 * The parts of the component preview that demos themselves depend on.
 *
 * Separated from `ComponentPreview` because the two have different owners. The
 * preview holds a registry of that site's demos and is necessarily site-local;
 * these helpers are generic, and every published demo imports them. Keeping
 * them here lets a demo be published and rendered by another site without
 * carrying a consumer-local alias to a file that site does not have.
 */

/** Demos render `<DemoControls>` inline; the DOM is portaled below the canvas. */
export const ControlsPortalContext = React.createContext<HTMLDivElement | null>(null);

/** Tells `useUsageCode` which store key to write to. */
export const ComponentNameContext = React.createContext<string>('');

export function useUsageCode(code: string) {
  const name = React.useContext(ComponentNameContext);
  React.useEffect(() => {
    if (!name) return;
    setUsageCode(name, code);
  }, [name, code]);
  React.useEffect(() => {
    if (!name) return;
    return () => setUsageCode(name, null);
  }, [name]);
}

export function LiveUsageCode({ name, defaultCode }: { name: string; defaultCode: string }) {
  const [code, setCode] = React.useState<string>(() => getUsageCode(name) ?? defaultCode);
  React.useEffect(() => {
    setCode(getUsageCode(name) ?? defaultCode);
    return subscribeUsageCode(name, (c) => setCode(c ?? defaultCode));
  }, [name, defaultCode]);
  return <CodeFence code={code} language="tsx" />;
}

export function DemoControls({ children }: { children: React.ReactNode }) {
  const target = React.useContext(ControlsPortalContext);
  if (!target) return null;
  return createPortal(
    <div className="border-t border-fd-border px-6 py-4">{children}</div>,
    target,
  );
}
