// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface DocsFeedbackPayload {
  helpful: boolean;
  /** Page the feedback was given on, for context in the notification. */
  page?: string;
}

export interface DocsFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Server fns are compiled per-app by TanStack Start, so the host app wires
   * its own and passes it in — the component stays app-agnostic. Omit to
   * record nothing (the thank-you state still shows).
   */
  submit?: (payload: DocsFeedbackPayload) => Promise<{ ok: boolean }>;
  /** Current page path, forwarded in the payload. */
  page?: string;
  question?: string;
  thanksLabel?: string;
}

function FeedbackButton(props: Omit<React.ComponentPropsWithoutRef<'button'>, 'type' | 'className'>) {
  return (
    <button
      type="button"
      className="px-3 text-sm font-medium text-muted-foreground transition hover:bg-foreground/[0.025] hover:text-foreground"
      {...props}
    />
  );
}

export function DocsFeedback({
  submit,
  page,
  question = 'Was this page helpful?',
  thanksLabel = 'Thanks for your feedback!',
  className,
  ...props
}: DocsFeedbackProps) {
  const [submitted, setSubmitted] = React.useState(false);

  function respond(helpful: boolean) {
    setSubmitted(true);
    void submit?.({ helpful, page }).catch(() => {});
  }

  return (
    <div className={cn('relative h-8', className)} {...props}>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center gap-6 transition-opacity duration-300 md:justify-start',
          submitted && 'pointer-events-none opacity-0',
        )}
      >
        <p className="text-sm text-muted-foreground">{question}</p>
        <div className="group grid h-8 grid-cols-[1fr_1px_1fr] overflow-hidden rounded-full border border-foreground/10">
          <FeedbackButton onClick={() => respond(true)}>Yes</FeedbackButton>
          <div className="bg-foreground/10" />
          <FeedbackButton onClick={() => respond(false)}>No</FeedbackButton>
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-0 flex justify-center opacity-0 transition-opacity delay-150 duration-300 md:justify-start',
          submitted && 'opacity-100',
        )}
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-full bg-primary/5 py-1 pl-1.5 pr-3 text-sm text-foreground ring-1 ring-inset ring-primary/20">
          <Check className="size-5 flex-none rounded-full bg-primary/15 p-1 text-primary" aria-hidden="true" />
          {thanksLabel}
        </div>
      </div>
    </div>
  );
}
