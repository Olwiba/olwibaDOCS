'use client';

import * as React from 'react';
import { useRouterState } from '@tanstack/react-router';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface GoogleAnalyticsProps {
  /**
   * GA4 measurement ID, e.g. `G-XXXXXXXXXX`.
   *
   * Falls back to `VITE_GA_MEASUREMENT_ID`, which is the usual case: a docs
   * site sets the variable and needs no code. Pass it explicitly when the site
   * resolves public settings at runtime rather than at build time.
   */
  measurementId?: string;
}

function resolveMeasurementId(explicit?: string): string | undefined {
  if (explicit) return explicit;
  // Read defensively. A consumer bundling this outside Vite has no
  // `import.meta.env`, and analytics must never be the reason a site fails to
  // render.
  try {
    return (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      ?.VITE_GA_MEASUREMENT_ID;
  } catch {
    return undefined;
  }
}

/**
 * Google Analytics 4, dormant until configured.
 *
 * With no measurement ID this renders nothing, injects no script and makes no
 * request to Google, so a deployment that has not opted in has no third party
 * in it at all and no consent question to answer.
 *
 * Note that `VITE_GA_MEASUREMENT_ID` is a build argument like every `VITE_*`
 * var: it is baked into the bundle when the image is built, so setting it on a
 * running container does nothing until the image is rebuilt. In Coolify it has
 * to be marked as a build variable and the app redeployed, not restarted.
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps = {}) {
  const id = resolveMeasurementId(measurementId);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const search = useRouterState({ select: (state) => state.location.searchStr });
  const loaded = React.useRef(false);

  // Injected from an effect rather than rendered as a <script> tag so it never
  // runs during SSR, where `window` does not exist and there is no visitor to
  // count yet.
  React.useEffect(() => {
    if (!id || loaded.current) return;
    loaded.current = true;

    window.dataLayer = window.dataLayer || [];
    // gtag pushes `arguments` itself, an array-like rather than a spread, and
    // GA reads it back expecting exactly that shape. A rest parameter here
    // would push a real array and the calls would be silently ignored.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', id, {
      // Page views are sent manually below. GA4's automatic pageview fires once
      // on script load, which in a single-page app means every route after the
      // first would go uncounted.
      send_page_view: false,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }, [id]);

  // Fires on the first render too, which is the initial page view that
  // `send_page_view: false` suppressed above.
  React.useEffect(() => {
    if (!id) return;
    window.gtag?.('event', 'page_view', {
      page_path: `${pathname}${search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [id, pathname, search]);

  return null;
}

/**
 * Reports an event, or does nothing when analytics is not configured.
 *
 * Safe to call unconditionally: a page should not have to branch on whether
 * this deployment has analytics, and a tracking call must never be the reason
 * something breaks.
 */
export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
  measurementId?: string,
): void {
  if (typeof window === 'undefined') return;
  if (!resolveMeasurementId(measurementId)) return;
  window.gtag?.('event', name, params);
}
