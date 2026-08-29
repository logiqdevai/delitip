"use client";

import { useEffect } from "react";

/**
 * Warns on browser tab close/refresh when there are unsaved changes.
 * Next.js App Router has no built-in way to intercept in-app `<Link>`
 * navigation, so this only covers leaving the page/tab entirely.
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);
}
