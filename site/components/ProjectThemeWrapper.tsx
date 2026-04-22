'use client';

import * as React from 'react';
import { projectThemeStyleCss } from '@/project.config';

export function ProjectThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{projectThemeStyleCss}</style>
      {children}
    </>
  );
}
