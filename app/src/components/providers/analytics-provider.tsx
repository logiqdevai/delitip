"use client";

import { useEffect } from "react";
import Script from "next/script";
import { environments } from "@/config/environments";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { Routes } from "@/routes/routes";
import {
  identifyUser,
  initPosthog,
  resetAnalytics,
  trackEvent,
} from "@/lib/analytics/analytics";
import { useAuthStore } from "@/stores/auth.store";

const { gaMeasurementId } = environments;

// Loads GA4 + PostHog and ties both to the signed-in user. Pageviews are
// automatic: GA4 enhanced measurement and PostHog both follow history changes.
// Each tool is a no-op until its env var is set.
export function AnalyticsProvider() {
  useEffect(() => {
    initPosthog();

    const syncUser = (user: { id: string; role?: string } | null) => {
      if (user) identifyUser(user.id, { role: user.role });
      else resetAnalytics();
    };

    syncUser(useAuthStore.getState().user);
    let previousId = useAuthStore.getState().user?.id;
    return useAuthStore.subscribe((state) => {
      if (state.user?.id === previousId) return;
      previousId = state.user?.id;
      syncUser(state.user);
    });
  }, []);

  // Marketing CTAs all link to sign-up; one delegated listener covers them.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a");
      if (!link || link.getAttribute("href") !== Routes.landing.getStarted) return;
      trackEvent(AnalyticsEvents.ctaClicked, {
        cta: "get_started",
        label: link.textContent?.trim().slice(0, 60),
        page: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!gaMeasurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaMeasurementId}');`}
      </Script>
    </>
  );
}
