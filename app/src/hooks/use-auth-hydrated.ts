"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

export const useAuthHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
};
