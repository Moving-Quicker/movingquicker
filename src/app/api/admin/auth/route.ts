import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCredentials, createToken } from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min

function getIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const ip = getIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { user, password } = body as Record<string, unknown>;

  if (typeof user !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  if (user.length > 100 || password.length > 200) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  if (!verifyCredentials(user, password)) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // Reset attempts on success
  attempts.delete(ip);

  const token = createToken();

  const jar = await cookies();
  jar.set("mq_admin", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ ok: true });
}
