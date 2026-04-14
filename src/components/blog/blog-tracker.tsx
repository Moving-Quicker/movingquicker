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

    function onBeforeUnload() {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      trackEvent("blog_time_on_page", { slug, seconds });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [slug, title, tags]);

  return null;
}
