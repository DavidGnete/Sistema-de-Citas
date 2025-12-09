import nodemailer from "nodemailer";
import { buildTicketCreatedEmail } from "@/lib/emailTemplates/ticketCreated";

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const auth = process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined;

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth,
    });
  }

  // Fallback a cuenta de prueba (Ethereal) para desarrollo
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

export async function sendTicketCreatedEmail(to: string, ticket: any) {
  const transporter = await createTransporter();
  const { subject, text, html } = buildTicketCreatedEmail(ticket);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@miapp.com",
    to,
    subject,
    text,
    html,
  });

  // Si usamos Ethereal o similar, devolver URL de preview en logs
  try {
    const preview = (nodemailer as any).getTestMessageUrl
      ? (nodemailer as any).getTestMessageUrl(info)
      : null;
    if (preview) console.log("Preview email:", preview);
  } catch (e) {
    // ignore
  }

  return info;
}
