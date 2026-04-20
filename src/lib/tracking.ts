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

export interface LeadProps {
  email: string;
  name: string;
  source: "form" | "chat";
  businessType?: string;
  projectType?: string;
}

export function identifyLead(lead: LeadProps) {
  try {
    if (!phReady()) return;
    posthog.identify(lead.email, {
      name: lead.name,
      email: lead.email,
      lead_source: lead.source,
      business_type: lead.businessType,
      project_type: lead.projectType,
    });
    if (isDev) console.debug("[PostHog] identify", lead.email);
  } catch (err) {
    if (isDev) console.warn("[PostHog] identify failed:", err);
  }
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
}

const UTM_STORAGE_KEY = "mq_utm";

export function persistUtm() {
  if (typeof window === "undefined") return;
  const utms = getUtmParams();
  if (Object.keys(utms).length === 0) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms));
  } catch { /* private browsing */ }
}

export function getPersistedUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getFirstTouchUrl(): string {
  if (typeof window === "undefined") return "";
  const key = "mq_landing";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const url = window.location.pathname + window.location.search;
    sessionStorage.setItem(key, url);
    return url;
  } catch {
    return window.location.pathname;
  }
}
