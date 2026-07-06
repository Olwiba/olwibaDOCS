// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
export type EmailProviderName = 'preview' | 'none' | 'resend' | 'plunk';

export interface FeedbackEmailEnv {
  provider: EmailProviderName;
  from: string;
  replyTo?: string;
  /** Where feedback submissions are delivered. Falls back to EMAIL_REPLY_TO. */
  adminTo?: string;
  resendApiKey?: string;
  plunkApiKey?: string;
  plunkApiUrl?: string;
}

const PROVIDERS: readonly string[] = ['preview', 'none', 'resend', 'plunk'];

export function getFeedbackEmailEnv(): FeedbackEmailEnv {
  const raw = (process.env.EMAIL_PROVIDER ?? 'none').toLowerCase();
  const provider = PROVIDERS.includes(raw) ? (raw as EmailProviderName) : 'none';

  return {
    provider,
    from: process.env.EMAIL_FROM ?? 'Docs Feedback <noreply@localhost>',
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
    adminTo: process.env.EMAIL_ADMIN_TO || process.env.EMAIL_REPLY_TO || undefined,
    resendApiKey: process.env.RESEND_API_KEY || undefined,
    plunkApiKey: process.env.PLUNK_API_KEY || undefined,
    plunkApiUrl: process.env.PLUNK_API_URL || undefined,
  };
}
