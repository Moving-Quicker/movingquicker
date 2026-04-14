import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ContactEmail, type ContactEmailProps } from "./emails/contact-email";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_FROM = SMTP_USER || "noreply@movingquicker.com";
const FROM = `"Moving Quicker" <${SMTP_FROM}>`;
const CONTACT_TO = process.env.CONTACT_EMAIL || SMTP_USER;

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
