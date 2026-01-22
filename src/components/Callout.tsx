'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@olwiba/cn';

export interface CalloutProps extends React.ComponentProps<typeof Alert> {
  icon?: React.ReactNode;
  variant?: 'default' | 'info' | 'warning';
}

export function Callout({
  title,
  children,
  icon,
  className,
  variant = 'default',
  ...props
}: CalloutProps) {
  return (
    <Alert
      data-variant={variant}
      className={cn(
        'bg-background text-foreground mt-6 w-auto border',
        className
      )}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  );
}
