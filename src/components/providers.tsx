"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme";
import { persistUtm, getFirstTouchUrl } from "@/lib/tracking";

const PH_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "phc_tEzFgzf3TCrfzL3MUHwiPDZnvGggV7jAVswxb4AsWmtE";

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegrambot|bingpreview|yandex|baidu|duckduck|ia_archiver|pingdom|uptimerobot|headlesschrome|phantomjs|prerender|lighthouse|gtmetrix/i;

function isBot(): boolean {
  if (typeof navigator === "undefined") return true;
  return BOT_RE.test(navigator.userAgent);
}

function PostHogInit() {
  useEffect(() => {
    if (!PH_KEY || isBot()) return;
    posthog.init(PH_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
      persistence: "localStorage+cookie",
    });

    persistUtm();
    getFirstTouchUrl();
  }, []);
  return null;
}

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef("");

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    if (url !== lastUrl.current) {
      lastUrl.current = url;
      posthog.capture("$pageview", { $current_url: window.location.origin + url });
    }
  }, [pathname, searchParams]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PHProvider>
  );
}
