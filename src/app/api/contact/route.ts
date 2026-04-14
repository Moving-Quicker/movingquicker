import { NextResponse } from "next/server";
import { isEmailConfigured, sendContactEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "El envío de correo no está configurado en el servidor." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { name, whatsapp, businessType, message, visitorId, source } =
    body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }

  if (typeof whatsapp !== "string" || !whatsapp.trim()) {
    return NextResponse.json({ error: "El WhatsApp es obligatorio." }, { status: 400 });
  }

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "El mensaje es obligatorio." }, { status: 400 });
  }

  const business =
    typeof businessType === "string" && businessType.trim()
      ? businessType.trim()
      : undefined;

  // Save lead to DB if visitor ID is present
  if (typeof visitorId === "string" && visitorId.trim()) {
    try {
      await prisma.lead.create({
        data: {
          visitorId: visitorId.trim(),
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          businessType: business,
          message: message.trim(),
          source: typeof source === "string" ? source : "form",
        },
      });
    } catch (err) {
      console.error("[contact] Failed to save lead:", err);
    }
  }

  const ok = await sendContactEmail({
    name: name.trim(),
    whatsapp: whatsapp.trim(),
    businessType: business,
    message: message.trim(),
  });

  if (!ok) {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Intenta de nuevo más tarde." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
