"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme";

const PH_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "phc_tEzFgzf3TCrfzL3MUHwiPDZnvGggV7jAVswxb4AsWmtE";

function PostHogInit() {
  useEffect(() => {
    if (!PH_KEY) return;
    posthog.init(PH_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PHProvider>
  );
}
