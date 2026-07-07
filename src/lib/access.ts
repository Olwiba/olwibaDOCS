import { notFound, redirect } from '@tanstack/react-router';

export type DocsAccessMode = 'public' | 'private';
export type DocsUnauthorizedBehavior = 'not-found' | 'redirect';

export interface DocsAccessConfig<TSession = unknown> {
  mode?: DocsAccessMode;
  getSession?: () => Promise<TSession | null | undefined>;
  canAccess?: (session: TSession) => boolean | Promise<boolean>;
  unauthorizedBehavior?: DocsUnauthorizedBehavior;
  signInHref?: string;
}

export interface DocsAccessState<TSession = unknown> {
  mode: DocsAccessMode;
  isPrivate: boolean;
  isAuthenticated: boolean;
  canAccess: boolean;
  session: TSession | null;
}

function unauthorized<TSession>(config: DocsAccessConfig<TSession>) {
  if (config.unauthorizedBehavior === 'redirect') {
    throw redirect({ to: config.signInHref ?? '/login' });
  }
  throw notFound();
}

export async function resolveDocsAccess<TSession = unknown>(
  config: DocsAccessConfig<TSession> = {},
): Promise<DocsAccessState<TSession>> {
  const mode = config.mode ?? 'public';
  if (mode === 'public') {
    return {
      mode,
      isPrivate: false,
      isAuthenticated: false,
      canAccess: true,
      session: null,
    };
  }

  const session = (await config.getSession?.()) ?? null;
  const isAuthenticated = session !== null;
  const canAccess = session ? await (config.canAccess?.(session) ?? true) : false;

  return {
    mode,
    isPrivate: true,
    isAuthenticated,
    canAccess,
    session,
  };
}

export async function requireDocsAccess<TSession = unknown>(
  config: DocsAccessConfig<TSession>,
): Promise<TSession | null> {
  const state = await resolveDocsAccess(config);
  if (state.isPrivate && !state.canAccess) {
    unauthorized(config);
  }
  return state.session;
}

export async function guardDocsResponse<TSession = unknown>(
  config: DocsAccessConfig<TSession>,
): Promise<Response | null> {
  const state = await resolveDocsAccess(config);
  if (!state.isPrivate || state.canAccess) return null;

  if (config.unauthorizedBehavior === 'redirect') {
    return Response.redirect(config.signInHref ?? '/login', 302);
  }
  return new Response('Not Found', { status: 404 });
}
