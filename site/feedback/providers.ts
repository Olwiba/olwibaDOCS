import type { EmailProviderName, FeedbackEmailEnv } from './env';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface EmailProvider {
  name: EmailProviderName;
  send(message: EmailMessage): Promise<void>;
}

function parseFromAddress(from: string): { email: string; name?: string } {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1]!.trim(), email: match[2]!.trim() };
  }
  return { email: from.trim() };
}

function createPreviewProvider(): EmailProvider {
  return {
    name: 'preview',
    async send({ to, subject, text }) {
      console.log(`[feedback:preview] captured "${subject}" for ${to} (no send)\n${text}`);
    },
  };
}

function createNoneProvider(): EmailProvider {
  return {
    name: 'none',
    async send() {
      // Intentionally silent - feedback is disabled.
    },
  };
}

function createResendProvider(env: FeedbackEmailEnv): EmailProvider {
  return {
    name: 'resend',
    async send({ to, subject, text, html, replyTo }) {
      if (!env.resendApiKey) {
        throw new Error('RESEND_API_KEY required when EMAIL_PROVIDER=resend');
      }
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.from,
          to: [to],
          subject,
          html,
          text,
          reply_to: replyTo,
        }),
      });
      if (!res.ok) {
        throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
      }
    },
  };
}

function createPlunkProvider(env: FeedbackEmailEnv): EmailProvider {
  return {
    name: 'plunk',
    async send({ to, subject, html }) {
      if (!env.plunkApiKey) {
        throw new Error('PLUNK_API_KEY required when EMAIL_PROVIDER=plunk');
      }
      const base = (env.plunkApiUrl ?? 'https://api.useplunk.com').replace(/\/$/, '');
      const { email: fromEmail, name } = parseFromAddress(env.from);
      const res = await fetch(`${base}/v1/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.plunkApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body: html,
          from: fromEmail,
          name,
        }),
      });
      if (!res.ok) {
        throw new Error(`Plunk failed: ${res.status} ${await res.text()}`);
      }
    },
  };
}

export function getEmailProvider(env: FeedbackEmailEnv): EmailProvider {
  switch (env.provider) {
    case 'resend':
      return createResendProvider(env);
    case 'plunk':
      return createPlunkProvider(env);
    case 'preview':
      return createPreviewProvider();
    case 'none':
    default:
      return createNoneProvider();
  }
}
