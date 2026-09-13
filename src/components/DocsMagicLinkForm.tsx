'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@olwiba/cn';

export interface DocsMagicLinkFormProps {
  onSubmit: (email: string) => void | Promise<void>;
  loading?: boolean;
  sent?: boolean;
  error?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  sentTitle?: string;
  sentDescription?: string;
  brand?: React.ReactNode;
}

/** Provider-neutral passwordless sign-in UI for gated documentation sites. */
export function DocsMagicLinkForm({
  onSubmit,
  loading = false,
  sent = false,
  error,
  title = 'Sign in',
  description = 'Enter your email and we will send you a secure sign-in link.',
  submitLabel = 'Send magic link',
  sentTitle = 'Check your email',
  sentDescription = 'If this address has access, a sign-in link is on its way.',
  brand,
}: DocsMagicLinkFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim();
    if (email) void onSubmit(email);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        {brand && <div className="mb-2">{brand}</div>}
        <CardTitle>{sent ? sentTitle : title}</CardTitle>
        <CardDescription>{sent ? sentDescription : description}</CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-sm text-muted-foreground">
            The link expires shortly and can only be used once.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="docs-auth-email">Email</Label>
              <Input
                id="docs-auth-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : submitLabel}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
