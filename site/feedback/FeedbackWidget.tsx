'use client';

import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from '@olwiba/cn';
import { MessageSquarePlus } from 'lucide-react';
import { getFeedbackConfig, submitFeedback, type FeedbackType } from './server';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function FeedbackWidget() {
  const [enabled, setEnabled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<FeedbackType>('feedback');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    getFeedbackConfig()
      .then((config) => {
        if (!cancelled && config.enabled) setEnabled(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled) return null;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setStatus('idle');
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim().length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }
    setStatus('sending');
    setError(null);
    try {
      const result = await submitFeedback({
        data: {
          type,
          message,
          email: email || undefined,
          page: window.location.pathname,
          website,
        },
      });
      if (result.ok) {
        setStatus('sent');
        setMessage('');
      } else {
        setStatus('error');
        setError(result.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="fixed bottom-4 right-4 z-50 shadow-lg"
        >
          <MessageSquarePlus />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {status === 'sent' ? (
          <>
            <DialogHeader>
              <DialogTitle>Thanks for the feedback!</DialogTitle>
              <DialogDescription>
                Your message has been sent. We appreciate you taking the time.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Share feedback</DialogTitle>
              <DialogDescription>
                Spotted a problem, or want something added? Let us know.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-1.5">
              {(
                [
                  ['feedback', 'Feedback'],
                  ['feature-request', 'Feature request'],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={type === value ? 'default' : 'secondary'}
                  onClick={() => setType(value)}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessage(event.target.value)
                }
                placeholder={
                  type === 'feature-request'
                    ? 'What would you like to see?'
                    : 'What can we improve?'
                }
                rows={5}
                maxLength={2000}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback-email">
                Email <span className="text-muted-foreground">(optional, for replies)</span>
              </Label>
              <Input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
              />
            </div>

            {/* Honeypot - visually hidden, bots fill it, humans never see it. */}
            <div className="absolute -left-[9999px] top-0" aria-hidden="true">
              <label htmlFor="feedback-website">Website</label>
              <input
                id="feedback-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
