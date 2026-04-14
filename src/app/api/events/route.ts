import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { visitorId, variant, type, metadata, userAgent, referrer } =
    body as Record<string, unknown>;

  if (typeof visitorId !== "string" || !visitorId.trim()) {
    return NextResponse.json({ error: "visitorId required" }, { status: 400 });
  }
  if (typeof type !== "string" || !type.trim()) {
    return NextResponse.json({ error: "type required" }, { status: 400 });
  }

  try {
    await prisma.visitor.upsert({
      where: { id: visitorId },
      update: {},
      create: {
        id: visitorId,
        variant: typeof variant === "string" ? variant : "A",
        userAgent: typeof userAgent === "string" ? userAgent.slice(0, 500) : null,
        referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
      },
    });

    await prisma.event.create({
      data: {
        visitorId,
        type: type.trim(),
        metadata: metadata && typeof metadata === "object" ? metadata as object : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[events]", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
