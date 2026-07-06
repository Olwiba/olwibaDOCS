'use client';

import * as React from 'react';
import { projectThemeStyleCss } from '@/project.config';
import { FeedbackWidget } from '~/feedback/FeedbackWidget';

export function ProjectThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{projectThemeStyleCss}</style>
      {children}
      <FeedbackWidget />
    </>
  );
}
