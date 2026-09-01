"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    const ids = idsKey.split("|").filter(Boolean);
    if (ids.length === 0) return;

    const hashId = window.location.hash.replace(/^#/, "");
    if (hashId && ids.includes(hashId)) {
      setActiveId(hashId);
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let bestId = ids[0];
        let bestRatio = -1;

        for (const id of ids) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio > 0) {
          setActiveId(bestId);
          return;
        }

        const scrollY = window.scrollY;
        let fallback = ids[0];

        for (const el of elements) {
          if (el.offsetTop - 120 <= scrollY) {
            fallback = el.id;
          }
        }

        setActiveId(fallback);
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
