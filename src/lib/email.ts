import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ContactEmail, type ContactEmailProps } from "./emails/contact-email";
import { ConfirmationEmail } from "./emails/confirmation-email";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_FROM = SMTP_USER || "noreply@movingquicker.com";
const FROM = `"Moving Quicker" <${SMTP_FROM}>`;
const CONTACT_TO = process.env.CONTACT_EMAIL || SMTP_USER;
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, "") || undefined;

function createTransporter() {
  if (!SMTP_USER || !process.env.SMTP_PASSWORD) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const transporter = createTransporter();

export function isEmailConfigured(): boolean {
  return !!transporter && !!CONTACT_TO;
}

export async function sendContactEmail(
  opts: ContactEmailProps,
): Promise<boolean> {
  if (!transporter || !CONTACT_TO) return false;

  try {
    const html = await render(ContactEmail(opts));

    await transporter.sendMail({
      from: FROM,
      to: CONTACT_TO,
      subject: `Contacto web: ${opts.name}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] sendContactEmail failed:", err);
    return false;
  }
}

export async function sendConfirmationEmail(
  to: string,
  name: string,
): Promise<boolean> {
  if (!transporter) return false;

  try {
    const html = await render(ConfirmationEmail({ name, waNumber: WA_NUMBER }));

    await transporter.sendMail({
      from: FROM,
      replyTo: `"Moving Quicker" <${CONTACT_TO}>`,
      to,
      subject: "Recibimos tu mensaje — Moving Quicker",
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] sendConfirmationEmail failed:", err);
    return false;
  }
}
