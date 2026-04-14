function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let _initialized = false;

function getVisitorInfo() {
  return {
    visitorId: getCookie("mq_vid") ?? "",
    variant: getCookie("mq_var") ?? "A",
  };
}

function isInternal(): boolean {
  return getCookie("mq_internal") === "1";
}

export function trackEvent(type: string, metadata?: Record<string, unknown>) {
  if (isInternal()) return;

  const { visitorId, variant } = getVisitorInfo();
  if (!visitorId) return;

  const payload: Record<string, unknown> = {
    visitorId,
    variant,
    type,
  };
  if (metadata) payload.metadata = metadata;

  if (!_initialized) {
    payload.userAgent = navigator.userAgent;
    payload.referrer = document.referrer || undefined;
    _initialized = true;
  }

  navigator.sendBeacon(
    "/api/events",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );
}

export function getVariant(): "A" | "B" {
  return (getCookie("mq_var") as "A" | "B") ?? "A";
}

export function getVisitorId(): string {
  return getCookie("mq_vid") ?? "";
}
