"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

export function TrackPageview({ metadata }: { metadata?: Record<string, unknown> }) {
  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname, ...metadata });
  }, [metadata]);

  return null;
}
