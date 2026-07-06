// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
// Portable feedback core — validation, rate limiting, email composition and
// delivery. No createServerFn here: TanStack Start only compiles server fns
// from app source, so each app wraps these in its own thin server fns
// (see ./server.ts for this app's wiring).

import { getFeedbackEmailEnv } from './env';
import { getEmailProvider } from './providers';
import { checkRateLimit } from './rate-limit';

export interface FeedbackSubmission {
  /** 1-5 answer to "Do you like this?" */
  rating: number;
  message: string;
  /** Page the dialog was opened from, for context in the notification. */
  page?: string;
  /** Honeypot - humans never fill this. */
  website?: string;
}

export interface FeedbackResult {
  ok: boolean;
  error?: string;
}

const MAX_MESSAGE_LENGTH = 2000;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** Whether the feedback dialog should render at all. */
export function feedbackEnabled(): { enabled: boolean } {
  return { enabled: getFeedbackEmailEnv().provider !== 'none' };
}

/** Throws on invalid input; returns the normalized submission. */
export function validateFeedbackSubmission(input: FeedbackSubmission): FeedbackSubmission {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  const message = (input.message ?? '').trim();
  if (message.length < 3 || message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message must be between 3 and ${MAX_MESSAGE_LENGTH} characters`);
  }
  return {
    rating: input.rating,
    message,
    page: input.page?.slice(0, 200),
    website: input.website,
  };
}

/** Rate-limits, composes and sends the admin notification email. */
export async function deliverFeedback(data: FeedbackSubmission): Promise<FeedbackResult> {
  // Honeypot filled - pretend success, send nothing.
  if (data.website) return { ok: true };

  if (!checkRateLimit('feedback', 10, 60_000)) {
    return { ok: false, error: 'Too many submissions right now. Please try again shortly.' };
  }

  const env = getFeedbackEmailEnv();
  if (env.provider === 'none') {
    return { ok: false, error: 'Feedback is not enabled on this site.' };
  }
  if (!env.adminTo && env.provider !== 'preview') {
    console.warn('[feedback] EMAIL_ADMIN_TO / EMAIL_REPLY_TO not set - cannot deliver feedback');
    return { ok: false, error: 'Feedback is not fully configured on this site.' };
  }

  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
  const text = [
    `Rating: ${stars} (${data.rating}/5)`,
    data.page ? `Page: ${data.page}` : null,
    '',
    data.message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    await getEmailProvider(env).send({
      to: env.adminTo ?? 'preview@localhost',
      subject: `[Docs feedback] ${data.rating}/5 - ${data.message.slice(0, 60)}`,
      text,
      html: `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap;">${escapeHtml(text)}</pre>`,
      replyTo: env.replyTo,
    });
  } catch (error) {
    console.error('[feedback] send failed:', error);
    return { ok: false, error: 'Something went wrong sending your feedback. Please try again.' };
  }

  return { ok: true };
}
