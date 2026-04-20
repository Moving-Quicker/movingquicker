import posthog from "posthog-js";

const isDev = process.env.NODE_ENV === "development";

export function trackEvent(type: string, metadata?: Record<string, unknown>) {
  try {
    if (typeof window === "undefined") return;
    posthog.capture(type, metadata);
    if (isDev) console.debug("[PostHog]", type, metadata);
  } catch (err) {
    if (isDev) console.warn("[PostHog] capture failed:", type, err);
  }
}

export function getVariant(flag: string): string | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const value = posthog.getFeatureFlag(flag);
    return typeof value === "string" ? value : undefined;
  } catch {
    return undefined;
  }
}
