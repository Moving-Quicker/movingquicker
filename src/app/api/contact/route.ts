import { NextResponse } from "next/server";
import { isEmailConfigured, sendContactEmail, sendConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_MS = 2000;

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

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

  const { name, email, whatsapp, businessType, message, source, _hp, _t } =
    body as Record<string, unknown>;

  if (typeof _hp === "string" && _hp.length > 0) {
    return NextResponse.json({ success: true });
  }

  if (typeof _t === "number" && Date.now() - _t < MIN_SUBMIT_MS) {
    return NextResponse.json({ success: true });
  }

  if (typeof name !== "string" || !stripHtml(name)) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Escribe un correo electrónico válido." }, { status: 400 });
  }

  if (typeof message !== "string" || !stripHtml(message)) {
    return NextResponse.json({ error: "El mensaje es obligatorio." }, { status: 400 });
  }

  const cleanName = stripHtml(name);
  const cleanEmail = email.trim().toLowerCase();
  const cleanWa =
    typeof whatsapp === "string" && whatsapp.trim() ? whatsapp.trim().replace(/\D/g, "") : undefined;
  const cleanMessage = stripHtml(message);
  const business =
    typeof businessType === "string" && businessType.trim()
      ? stripHtml(businessType)
      : undefined;

  try {
    await prisma.lead.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        whatsapp: cleanWa,
        businessType: business,
        message: cleanMessage,
        source: typeof source === "string" ? source : "form",
      },
    });
  } catch (err) {
    console.error("[contact] Failed to save lead:", err);
  }

  const ok = await sendContactEmail({
    name: cleanName,
    email: cleanEmail,
    whatsapp: cleanWa,
    businessType: business,
    message: cleanMessage,
  });

  if (!ok) {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Intenta de nuevo más tarde." },
      { status: 502 },
    );
  }

  sendConfirmationEmail(cleanEmail, cleanName).catch((err) =>
    console.error("[contact] confirmation email failed:", err),
  );

  return NextResponse.json({ success: true });
}
