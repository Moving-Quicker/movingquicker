import posthog from "posthog-js";

const isDev = process.env.NODE_ENV === "development";

function phReady(): boolean {
  if (typeof window === "undefined") return false;
  return posthog.__loaded === true;
}

export function trackEvent(type: string, metadata?: Record<string, unknown>) {
  try {
    if (!phReady()) return;
    posthog.capture(type, metadata);
    if (isDev) console.debug("[PostHog]", type, metadata);
  } catch (err) {
    if (isDev) console.warn("[PostHog] capture failed:", type, err);
  }
}

export function getVariant(flag: string): string | undefined {
  try {
    if (!phReady()) return undefined;
    const value = posthog.getFeatureFlag(flag);
    return typeof value === "string" ? value : undefined;
  } catch {
    return undefined;
  }
}
