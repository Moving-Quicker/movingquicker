"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/tracking";

interface BlogTrackerProps {
  slug: string;
  title: string;
  tags: string[];
}

export function BlogTracker({ slug, title, tags }: BlogTrackerProps) {
  const tracked = useRef({ "25": false, "50": false, "75": false, "100": false });
  const startTime = useRef(Date.now());
  const sentTime = useRef(false);

  useEffect(() => {
    trackEvent("blog_view", { slug, title, tags });

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of ["25", "50", "75", "100"] as const) {
        if (pct >= Number(threshold) && !tracked.current[threshold]) {
          tracked.current[threshold] = true;
          trackEvent("blog_scroll_depth", { slug, depth: Number(threshold) });
        }
      }
    }

    function sendTimeOnPage() {
      if (sentTime.current) return;
      sentTime.current = true;
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      trackEvent("blog_time_on_page", { slug, seconds });
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") sendTimeOnPage();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", sendTimeOnPage);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", sendTimeOnPage);
    };
  }, [slug, title, tags]);

  return null;
}
