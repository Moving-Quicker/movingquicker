import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXCLUDED_IPS = (process.env.EXCLUDED_IPS ?? "")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const ip = getClientIp(request);

  const isInternal =
    EXCLUDED_IPS.includes(ip) ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip === "unknown";

  const vid = request.cookies.get("mq_vid");
  if (!vid) {
    const id = crypto.randomUUID();
    const variant = Math.random() < 0.5 ? "A" : "B";

    response.cookies.set("mq_vid", id, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    response.cookies.set("mq_var", variant, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (isInternal) {
    response.cookies.set("mq_internal", "1", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  } else if (request.cookies.get("mq_internal")) {
    response.cookies.delete("mq_internal");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|manifest\\.json|api/).*)",
  ],
};
