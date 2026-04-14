import posthog from "posthog-js";

export function trackEvent(type: string, metadata?: Record<string, unknown>) {
  try {
    posthog.capture(type, metadata);
  } catch {
    // PostHog not initialized (SSR or missing key)
  }
}

export function getVariant(flag: string): string | undefined {
  try {
    const value = posthog.getFeatureFlag(flag);
    return typeof value === "string" ? value : undefined;
  } catch {
    return undefined;
  }
}
