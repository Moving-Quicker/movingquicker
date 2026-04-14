import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function getSecret(): string {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  return `${user}:${pass}:mq-salt-2026`;
}

export function verifyCredentials(user: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const userBuf = Buffer.from(user);
  const expectedUserBuf = Buffer.from(expectedUser);
  const passBuf = Buffer.from(password);
  const expectedPassBuf = Buffer.from(expectedPass);

  const userMatch =
    userBuf.length === expectedUserBuf.length &&
    timingSafeEqual(userBuf, expectedUserBuf);
  const passMatch =
    passBuf.length === expectedPassBuf.length &&
    timingSafeEqual(passBuf, expectedPassBuf);

  return userMatch && passMatch;
}

export function createToken(): string {
  const payload = `${Date.now()}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");

  if (sig.length !== expectedSig.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false;

  const ts = parseInt(payload, 10);
  if (Number.isNaN(ts)) return false;

  return Date.now() - ts < TOKEN_TTL_MS;
}

export async function isAdminAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get("mq_admin")?.value;
  if (!token) return false;
  return verifyToken(token);
}
