import { createServerFn } from '@tanstack/react-start';
import { getFeedbackEmailEnv } from './env';
import { getEmailProvider } from './providers';
import { checkRateLimit } from './rate-limit';

export type FeedbackType = 'feedback' | 'feature-request';

export interface FeedbackSubmission {
  type: FeedbackType;
  message: string;
  email?: string;
  /** Page the widget was opened from, for context in the notification. */
  page?: string;
  /** Honeypot - humans never fill this. */
  website?: string;
}

export interface FeedbackResult {
  ok: boolean;
  error?: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const getFeedbackConfig = createServerFn({ method: 'GET' }).handler(async () => {
  return { enabled: getFeedbackEmailEnv().provider !== 'none' };
});

export const submitFeedback = createServerFn({ method: 'POST' })
  .validator((input: FeedbackSubmission): FeedbackSubmission => {
    if (input.type !== 'feedback' && input.type !== 'feature-request') {
      throw new Error('Invalid feedback type');
    }
    const message = (input.message ?? '').trim();
    if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message must be between 10 and ${MAX_MESSAGE_LENGTH} characters`);
    }
    const email = input.email?.trim() || undefined;
    if (email && (email.length > 254 || !EMAIL_PATTERN.test(email))) {
      throw new Error('Invalid email address');
    }
    return {
      type: input.type,
      message,
      email,
      page: input.page?.slice(0, 200),
      website: input.website,
    };
  })
  .handler(async ({ data }): Promise<FeedbackResult> => {
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

    const label = data.type === 'feature-request' ? 'Feature request' : 'Feedback';
    const text = [
      `Type: ${label}`,
      `From: ${data.email ?? 'anonymous'}`,
      data.page ? `Page: ${data.page}` : null,
      '',
      data.message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    try {
      await getEmailProvider(env).send({
        to: env.adminTo ?? 'preview@localhost',
        subject: `[Docs ${label.toLowerCase()}] ${data.message.slice(0, 60)}`,
        text,
        html: `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap;">${escapeHtml(text)}</pre>`,
        replyTo: data.email ?? env.replyTo,
      });
    } catch (error) {
      console.error('[feedback] send failed:', error);
      return { ok: false, error: 'Something went wrong sending your feedback. Please try again.' };
    }

    return { ok: true };
  });
