import posthog from "posthog-js";
import { environments } from "@/config/environments";
import type { AnalyticsEvent } from "@/config/constants/analytics-events";

type EventProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let posthogReady = false;

export const initPosthog = () => {
  if (posthogReady || typeof window === "undefined") return;
  if (!environments.posthogKey) return;
  posthog.init(environments.posthogKey, {
    api_host: environments.posthogHost,
    // "history_change" makes PostHog capture SPA route changes as pageviews.
    defaults: "2025-05-24",
    person_profiles: "identified_only",
  });
  posthogReady = true;
};

export const trackEvent = (
  event: AnalyticsEvent,
  properties?: EventProperties,
) => {
  if (typeof window === "undefined") return;
  if (posthogReady) posthog.capture(event, properties);
  window.gtag?.("event", event, properties);
};

export const identifyUser = (
  userId: string,
  properties?: EventProperties,
) => {
  if (typeof window === "undefined") return;
  if (posthogReady) posthog.identify(userId, properties);
  window.gtag?.("set", "user_id", userId);
};

export const resetAnalytics = () => {
  if (typeof window === "undefined") return;
  if (posthogReady) posthog.reset();
  window.gtag?.("set", "user_id", null);
};
